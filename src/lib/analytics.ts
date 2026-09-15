import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, createHmac } from "node:crypto";
import type {
  AnalyticsEvent,
  AnalyticsSummary,
  Channel,
  CustomEvent,
  DailyPoint,
  PageviewEvent,
  Row,
  Totals,
} from "./analyticsTypes";
import { countryName } from "./geo";
import type { Lead } from "./leadTypes";
import { classifySource } from "./trafficSource";

/**
 * First-party, cookieless analytics.
 *
 * Events are appended to one file per day (data/analytics/YYYY-MM-DD.ndjson,
 * next to the lead register; git-ignored data survives Hostinger deploys) or,
 * when Upstash is configured, to one Redis list per day. No IP address or
 * persistent identifier is stored: unique visitors are counted with a hash of
 * IP + user agent + a salt that changes every day, so the same person cannot
 * be followed from one day to the next.
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = Boolean(REDIS_URL && REDIS_TOKEN);

const DIR = process.env.ANALYTICS_DIR || path.join(process.cwd(), "data", "analytics");
const RETENTION_DAYS = 400;
const DAY = 86_400_000;

async function redis(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(REDIS_URL as string, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

/** Dates are bucketed in Hong Kong / Taiwan time (UTC+8), the markets this dashboard watches. */
const TZ_OFFSET = 8 * 3_600_000;
export const dayKey = (ts: number) => new Date(ts + TZ_OFFSET).toISOString().slice(0, 10);

export function visitorHash(ip: string, userAgent: string, ts: number): string {
  const salt = createHmac("sha256", process.env.ANALYTICS_SALT || process.env.ADMIN_PASSWORD || "kodinav-analytics")
    .update(dayKey(ts))
    .digest("hex");
  return createHash("sha256").update(`${salt}|${ip}|${userAgent}`).digest("hex").slice(0, 16);
}

let lastCleanup = "";

async function cleanupOldFiles(today: string) {
  if (lastCleanup === today) return;
  lastCleanup = today;
  const cutoff = dayKey(Date.now() - RETENTION_DAYS * DAY);
  try {
    for (const file of await fs.readdir(/*turbopackIgnore: true*/ DIR)) {
      const m = file.match(/^(\d{4}-\d{2}-\d{2})\.ndjson$/);
      if (m && m[1] < cutoff) await fs.unlink(path.join(/*turbopackIgnore: true*/ DIR, file));
    }
  } catch {
    // directory may not exist yet
  }
}

export async function recordEvent(event: AnalyticsEvent): Promise<void> {
  const day = dayKey(event.ts);
  const line = JSON.stringify(event);
  if (useRedis) {
    const key = `kodinav:analytics:${day}`;
    await redis(["RPUSH", key, line]);
    await redis(["EXPIRE", key, RETENTION_DAYS * 86_400]);
    return;
  }
  await fs.mkdir(/*turbopackIgnore: true*/ DIR, { recursive: true });
  // Appends of a single short line are atomic enough for one Node process.
  await fs.appendFile(/*turbopackIgnore: true*/ path.join(DIR, `${day}.ndjson`), `${line}\n`, "utf8");
  void cleanupOldFiles(day);
}

/** Deploy check: can this server write analytics? Writes and removes a probe file (or pings Redis). */
export async function probeStorage(): Promise<"file-ok" | "redis-ok"> {
  if (useRedis) {
    await redis(["PING"]);
    return "redis-ok";
  }
  const probe = path.join(/*turbopackIgnore: true*/ DIR, `.probe-${process.pid}`);
  await fs.mkdir(/*turbopackIgnore: true*/ DIR, { recursive: true });
  await fs.writeFile(/*turbopackIgnore: true*/ probe, "ok", "utf8");
  await fs.unlink(/*turbopackIgnore: true*/ probe);
  return "file-ok";
}

async function readDay(day: string): Promise<AnalyticsEvent[]> {
  let lines: string[];
  if (useRedis) {
    lines = ((await redis(["LRANGE", `kodinav:analytics:${day}`, 0, -1])) as string[]) ?? [];
  } else {
    try {
      lines = (await fs.readFile(/*turbopackIgnore: true*/ path.join(DIR, `${day}.ndjson`), "utf8")).split("\n");
    } catch {
      return [];
    }
  }
  const events: AnalyticsEvent[] = [];
  for (const line of lines) {
    if (!line) continue;
    try {
      events.push(JSON.parse(line) as AnalyticsEvent);
    } catch {
      // skip a torn line
    }
  }
  return events;
}

/* ------------------------------------------------------------------ */
/* Aggregation                                                         */
/* ------------------------------------------------------------------ */

function countBy<T>(items: T[], key: (item: T) => string | undefined) {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    if (k) map.set(k, (map.get(k) ?? 0) + 1);
  }
  return map;
}

function toRows(map: Map<string, number>, label: (key: string) => string = (k) => k, limit = 20): Row[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, label: label(key), value }));
}

function totalsOf(
  pageviews: PageviewEvent[],
  customs: CustomEvent[],
  engaged: Map<string, number>,
  leads: Lead[]
): Totals {
  const days = new Map<string, Set<string>>();
  for (const pv of pageviews) {
    const d = dayKey(pv.ts);
    if (!days.has(d)) days.set(d, new Set());
    days.get(d)!.add(pv.v);
  }
  const perVisit = countBy(pageviews, (pv) => pv.sid);
  const times = pageviews.map((pv) => engaged.get(pv.id)).filter((ms): ms is number => ms !== undefined && ms > 0);
  const contactEvents = customs.filter((e) => e.n === "whatsapp" || e.n === "email" || e.n === "phone");
  return {
    pageviews: pageviews.length,
    visitors: [...days.values()].reduce((sum, set) => sum + set.size, 0),
    visits: perVisit.size,
    avgEngagedSec: times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length / 1000) : 0,
    bounceRate: perVisit.size ? [...perVisit.values()].filter((n) => n === 1).length / perVisit.size : 0,
    leads: leads.length,
    contacts: contactEvents.length,
    whatsapp: contactEvents.filter((e) => e.n === "whatsapp").length,
  };
}

function leadChannel(lead: Lead): { source: string; channel: Channel } {
  if (!lead.referrer && !lead.utmSource && !lead.landingPage) return { source: "Not recorded", channel: "Direct" };
  return classifySource({
    referrer: lead.referrer,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    gclid: lead.gclid,
  });
}

export async function getAnalyticsSummary(days: number, allLeads: Lead[]): Promise<AnalyticsSummary> {
  const now = Date.now();
  const dayList = (offset: number) =>
    Array.from({ length: days }, (_, i) => dayKey(now - (days - 1 - i + offset) * DAY));
  const current = dayList(0);
  const previous = dayList(days);

  const [curEvents, prevEvents] = await Promise.all([
    Promise.all(current.map(readDay)).then((d) => d.flat()),
    Promise.all(previous.map(readDay)).then((d) => d.flat()),
  ]);

  const split = (events: AnalyticsEvent[]) => {
    const pageviews = events.filter((e): e is PageviewEvent => e.t === "pv");
    const customs = events.filter((e): e is CustomEvent => e.t === "ev");
    const engaged = new Map<string, number>();
    for (const e of events) {
      if (e.t === "lv") engaged.set(e.id, Math.max(engaged.get(e.id) ?? 0, e.ms));
    }
    return { pageviews, customs, engaged };
  };
  const cur = split(curEvents);
  const prev = split(prevEvents);

  const inRange = (list: string[]) => (lead: Lead) => list.includes(dayKey(new Date(lead.receivedAt).getTime()));
  const curLeads = allLeads.filter(inRange(current));
  const prevLeads = allLeads.filter(inRange(previous));

  // Daily series
  const daily: DailyPoint[] = current.map((date) => {
    const pvs = cur.pageviews.filter((pv) => dayKey(pv.ts) === date);
    return {
      date,
      pageviews: pvs.length,
      visitors: new Set(pvs.map((pv) => pv.v)).size,
      visits: new Set(pvs.map((pv) => pv.sid)).size,
      leads: curLeads.filter((l) => dayKey(new Date(l.receivedAt).getTime()) === date).length,
      contacts: cur.customs.filter(
        (e) => dayKey(e.ts) === date && (e.n === "whatsapp" || e.n === "email" || e.n === "phone")
      ).length,
    };
  });

  // Visits are attributed by their first page view (entry)
  const entries = new Map<string, PageviewEvent>();
  for (const pv of [...cur.pageviews].sort((a, b) => a.ts - b.ts)) {
    if (!entries.has(pv.sid)) entries.set(pv.sid, pv);
  }
  const visits = [...entries.values()];

  // Pages
  const pageMap = new Map<string, { views: number; visitors: Set<string>; ms: number[]; entries: number }>();
  for (const pv of cur.pageviews) {
    const row = pageMap.get(pv.p) ?? { views: 0, visitors: new Set(), ms: [], entries: 0 };
    row.views++;
    row.visitors.add(`${dayKey(pv.ts)}|${pv.v}`);
    const ms = cur.engaged.get(pv.id);
    if (ms) row.ms.push(ms);
    pageMap.set(pv.p, row);
  }
  for (const v of visits) {
    const row = pageMap.get(v.p);
    if (row) row.entries++;
  }
  const pages = [...pageMap.entries()]
    .sort((a, b) => b[1].views - a[1].views)
    .slice(0, 40)
    .map(([p, r]) => ({
      key: p,
      label: p,
      value: r.views,
      sub: `${r.visitors.size} visitors`,
      avgSec: r.ms.length ? Math.round(r.ms.reduce((a, b) => a + b, 0) / r.ms.length / 1000) : 0,
      entries: r.entries,
    }));

  // Markets
  const markets = (["HK", "TW"] as const).map((code) => {
    const pvs = cur.pageviews.filter((pv) => pv.c === code);
    return {
      code,
      name: code === "HK" ? "Hong Kong" : "Taiwan",
      visits: new Set(pvs.map((pv) => pv.sid)).size,
      pageviews: pvs.length,
      contacts: cur.customs.filter((e) => e.c === code && (e.n === "whatsapp" || e.n === "email" || e.n === "phone"))
        .length,
      leads: curLeads.filter((l) => l.country === code).length,
      zhPageviews: pvs.filter((pv) => pv.lang.startsWith("zh")).length,
    };
  });

  const emphasiseMarkets = (rows: Row[]) => rows.map((r) => ({ ...r, emphasis: r.key === "HK" || r.key === "TW" }));

  const campaignMap = countBy(visits, (v) => (v.us ? [v.us, v.um, v.uc].filter(Boolean).join(" / ") : undefined));
  const leadSourceMap = countBy(curLeads, (l) => leadChannel(l).source);
  const leadChannelMap = countBy(curLeads, (l) => leadChannel(l).channel);

  return {
    from: current[0],
    to: current[current.length - 1],
    days,
    generatedAt: new Date(now).toISOString(),
    storage: useRedis ? "redis" : "file",
    totals: totalsOf(cur.pageviews, cur.customs, cur.engaged, curLeads),
    previous: totalsOf(prev.pageviews, prev.customs, prev.engaged, prevLeads),
    daily,
    realtime: new Set(cur.pageviews.filter((pv) => now - pv.ts < 5 * 60_000).map((pv) => pv.sid)).size,
    markets,
    channels: toRows(countBy(visits, (v) => v.ch)),
    sources: toRows(countBy(visits, (v) => v.src)),
    aiSources: toRows(countBy(visits.filter((v) => v.ch === "AI assistants"), (v) => v.src)),
    campaigns: toRows(campaignMap),
    pages,
    landingPages: toRows(countBy(visits, (v) => v.p), undefined, 15),
    countries: emphasiseMarkets(toRows(countBy(visits, (v) => v.c), countryName, 15)),
    languages: toRows(countBy(cur.pageviews, (pv) => pv.lang), (k) =>
      k === "zh-HK" ? "Chinese (Hong Kong pages)" : k === "zh-TW" ? "Chinese (Taiwan pages)" : k === "en" ? "English pages" : k
    ),
    devices: toRows(countBy(visits, (v) => v.dev), (k) => k[0].toUpperCase() + k.slice(1)),
    events: toRows(countBy(cur.customs, (e) => e.n), (k) =>
      ({ whatsapp: "WhatsApp clicks", email: "Email clicks", phone: "Phone clicks", lead: "Form submissions", audit: "Website audits run" })[k] ?? k
    ),
    leadSources: toRows(leadSourceMap),
    leadChannels: toRows(leadChannelMap),
  };
}
