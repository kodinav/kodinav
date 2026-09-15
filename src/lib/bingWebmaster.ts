/**
 * Bing Webmaster Tools, via its API key (Bing Webmaster → Settings → API
 * access → generate key; set BING_WEBMASTER_API_KEY). Bing's index also feeds
 * Yahoo Taiwan, DuckDuckGo and ChatGPT search, so it is worth watching even
 * with a small search share. Bing reports are global (no country filter).
 */

const SITE = "https://kodinav.com/";

export const bingConfigured = () => Boolean(process.env.BING_WEBMASTER_API_KEY);

/** Bing's WCF dates look like "/Date(1757894400000-0700)/". */
function parseDate(value: string): string {
  const ms = Number(value.match(/\/Date\((-?\d+)/)?.[1]);
  return Number.isFinite(ms) ? new Date(ms).toISOString().slice(0, 10) : "";
}

async function bing<T>(method: string): Promise<T> {
  const url = `https://ssl.bing.com/webmaster/api.svc/json/${method}?siteUrl=${encodeURIComponent(SITE)}&apikey=${encodeURIComponent(
    process.env.BING_WEBMASTER_API_KEY ?? ""
  )}`;
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
  const text = await res.text();
  if (!res.ok) throw new Error(`Bing Webmaster error ${res.status}: ${text.slice(0, 160)}`);
  return (JSON.parse(text) as { d: T }).d;
}

export async function bingTraffic(days: number) {
  const rows = await bing<{ Date: string; Clicks: number; Impressions: number }[]>("GetRankAndTrafficStats");
  const cutoff = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  return rows
    .map((r) => ({ date: parseDate(r.Date), clicks: r.Clicks, impressions: r.Impressions }))
    .filter((r) => r.date && r.date >= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function bingQueries(limit = 20) {
  const rows = await bing<
    { Query: string; Clicks: number; Impressions: number; AvgImpressionPosition: number; Date: string }[]
  >("GetQueryStats");
  // Rows are per query per week; fold them into one row per query.
  const byQuery = new Map<string, { clicks: number; impressions: number; posSum: number; n: number }>();
  for (const r of rows) {
    const q = byQuery.get(r.Query) ?? { clicks: 0, impressions: 0, posSum: 0, n: 0 };
    q.clicks += r.Clicks;
    q.impressions += r.Impressions;
    if (r.AvgImpressionPosition > 0) {
      q.posSum += r.AvgImpressionPosition;
      q.n++;
    }
    byQuery.set(r.Query, q);
  }
  return [...byQuery.entries()]
    .map(([query, q]) => ({ query, clicks: q.clicks, impressions: q.impressions, position: q.n ? q.posSum / q.n : 0 }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit);
}
