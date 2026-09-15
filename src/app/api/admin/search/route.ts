import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { bingConfigured, bingQueries, bingTraffic } from "@/lib/bingWebmaster";
import {
  inspectUrl,
  searchAnalytics,
  searchConsoleConfigured,
  serviceAccountEmail,
  siteUrl,
  sitemaps,
  type IndexStatus,
} from "@/lib/searchConsole";
import { site } from "@/data/site";

export const dynamic = "force-dynamic";

/** Pages whose Google index status the Search tab tracks. */
const WATCHED = [
  "/",
  "/web-development-hong-kong",
  "/zh-hk",
  "/zh-hk/website-cost",
  "/zh-hk/profits-tax-calculator",
  "/blog/website-cost-hong-kong-2026",
  "/hong-kong-profits-tax-calculator",
  "/web-development-taiwan",
  "/zh-tw",
  "/zh-tw/website-cost",
  "/zh-tw/business-tax-calculator",
  "/blog/website-cost-taiwan-2026",
  "/taiwan-business-tax-calculator",
];

// Search Console reports countries as ISO 3166-1 alpha-3.
const ALPHA3: Record<string, string> = {
  hkg: "HK", twn: "TW", mac: "MO", ind: "IN", usa: "US", are: "AE", sgp: "SG", gbr: "GB", can: "CA", aus: "AU",
  mys: "MY", chn: "CN", jpn: "JP", kor: "KR", phl: "PH", idn: "ID", tha: "TH", vnm: "VN", deu: "DE", fra: "FR",
  nld: "NL", nga: "NG", pak: "PK", bgd: "BD", npl: "NP", lka: "LK", sau: "SA", qat: "QA", zaf: "ZA", bra: "BR",
  mex: "MX", esp: "ES", ita: "IT", irl: "IE", nzl: "NZ", che: "CH", swe: "SE", tur: "TR", egy: "EG", ken: "KE",
};

const cache = new Map<string, { at: number; data: unknown }>();
async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.data as T;
  const data = await load();
  cache.set(key, { at: Date.now(), data });
  return data;
}

const isoDay = (offsetDays: number) => new Date(Date.now() - offsetDays * 86_400_000).toISOString().slice(0, 10);

async function googleReport(days: number, country: string) {
  const range = { startDate: isoDay(days - 1), endDate: isoDay(0) };
  const prev = { startDate: isoDay(days * 2 - 1), endDate: isoDay(days) };
  const filter = country === "all" ? undefined : country;
  const [totals, previous, daily, countries, queries, pages, maps] = await Promise.all([
    searchAnalytics({ ...range, dimensions: [], country: filter, rowLimit: 1 }),
    searchAnalytics({ ...prev, dimensions: [], country: filter, rowLimit: 1 }),
    searchAnalytics({ ...range, dimensions: ["date"], country: filter, rowLimit: days + 5 }),
    searchAnalytics({ ...range, dimensions: ["country"], rowLimit: 12 }),
    searchAnalytics({ ...range, dimensions: ["query"], country: filter, rowLimit: 30 }),
    searchAnalytics({ ...range, dimensions: ["page"], country: filter, rowLimit: 20 }),
    sitemaps().catch(() => []),
  ]);
  const sum = (rows: typeof totals) =>
    rows[0]
      ? { clicks: rows[0].clicks, impressions: rows[0].impressions, ctr: rows[0].ctr, position: rows[0].position }
      : { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  return {
    site: await siteUrl(),
    range,
    totals: sum(totals),
    previous: sum(previous),
    daily: daily.map((r) => ({ date: r.keys[0], clicks: r.clicks, impressions: r.impressions })),
    countries: countries.map((r) => ({
      code: ALPHA3[r.keys[0]] ?? r.keys[0].toUpperCase(),
      clicks: r.clicks,
      impressions: r.impressions,
      position: r.position,
    })),
    queries: queries.map((r) => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })),
    pages: pages.map((r) => ({
      page: r.keys[0].replace(site.url, "") || "/",
      clicks: r.clicks,
      impressions: r.impressions,
      position: r.position,
    })),
    sitemaps: maps,
  };
}

async function indexReport(): Promise<IndexStatus[]> {
  const out: IndexStatus[] = [];
  // Four at a time: the URL Inspection API is slow and rate limited
  for (let i = 0; i < WATCHED.length; i += 4) {
    const batch = await Promise.all(
      WATCHED.slice(i, i + 4).map((p) =>
        inspectUrl(`${site.url}${p === "/" ? "/" : p}`).catch((err: Error) => ({
          url: `${site.url}${p}`,
          verdict: "ERROR",
          coverageState: err.message.slice(0, 120),
        }))
      )
    );
    out.push(...batch);
  }
  return out;
}

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const params = new URL(request.url).searchParams;
  const days = [7, 28, 90].includes(Number(params.get("days"))) ? Number(params.get("days")) : 28;
  const country = ["all", "hkg", "twn"].includes(params.get("country") ?? "") ? params.get("country")! : "all";
  const refresh = params.get("refresh") === "1";
  if (refresh) cache.clear();

  const google = searchConsoleConfigured()
    ? await Promise.all([
        cached(`g:${days}:${country}`, 30 * 60_000, () => googleReport(days, country)),
        cached("g:index", 6 * 3_600_000, indexReport),
      ])
        .then(([report, index]) => ({ configured: true as const, email: serviceAccountEmail(), ...report, index }))
        .catch((err: Error) => ({ configured: true as const, email: serviceAccountEmail(), error: err.message }))
    : { configured: false as const };

  const bing = bingConfigured()
    ? await cached(`b:${days}`, 60 * 60_000, async () => ({
        daily: await bingTraffic(days),
        queries: await bingQueries(20),
      }))
        .then((report) => ({ configured: true as const, ...report }))
        .catch((err: Error) => ({ configured: true as const, error: err.message }))
    : { configured: false as const };

  return NextResponse.json({ google, bing, days, country });
}
