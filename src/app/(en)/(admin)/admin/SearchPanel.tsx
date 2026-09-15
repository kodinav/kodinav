"use client";

import { useEffect, useRef, useState } from "react";
import { BarList, ColumnChart, StatTile } from "./charts";
import { fmtNum } from "./format";

type Totals = { clicks: number; impressions: number; ctr: number; position: number };
type GoogleData =
  | { configured: false }
  | { configured: true; email: string | null; error: string }
  | {
      configured: true;
      email: string | null;
      site: string;
      range: { startDate: string; endDate: string };
      totals: Totals;
      previous: Totals;
      daily: { date: string; clicks: number; impressions: number }[];
      countries: { code: string; clicks: number; impressions: number; position: number }[];
      queries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
      pages: { page: string; clicks: number; impressions: number; position: number }[];
      sitemaps: { path: string; lastDownloaded?: string; isPending?: boolean; errors?: string; warnings?: string; contents?: { type: string; submitted: string }[] }[];
      index: { url: string; verdict: string; coverageState: string; lastCrawlTime?: string }[];
    };
type BingData =
  | { configured: false }
  | { configured: true; error: string }
  | {
      configured: true;
      daily: { date: string; clicks: number; impressions: number }[];
      queries: { query: string; clicks: number; impressions: number; position: number }[];
    };

const COUNTRY_NAMES: Record<string, string> = { HK: "Hong Kong", TW: "Taiwan", IN: "India", US: "United States", AE: "UAE", SG: "Singapore", GB: "United Kingdom", MO: "Macau" };

const card = "min-w-0 border border-line bg-surface-raised p-5 sm:p-6";
const btn = (on: boolean) =>
  `border px-3 py-1.5 text-xs transition-colors ${
    on ? "border-foreground bg-foreground text-background" : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
  }`;

function Setup({ title, steps, env }: { title: string; steps: React.ReactNode[]; env: string }) {
  return (
    <div className={card}>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-muted">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-faint">
        Environment variable: <code className="bg-surface px-1.5 py-0.5 text-foreground">{env}</code> — set it in Hostinger
        → your Node.js app → Environment variables, then redeploy.
      </p>
    </div>
  );
}

export function SearchPanel() {
  const [days, setDays] = useState(28);
  const [country, setCountry] = useState<"all" | "hkg" | "twn">("all");
  const [data, setData] = useState<{ google: GoogleData; bing: BingData } | null>(null);
  const [failed, setFailed] = useState("");
  const [nonce, setNonce] = useState(0);
  const refreshRef = useRef(false);
  // Loading is derived: the request key changes immediately, the loaded key
  // catches up when the response lands (no synchronous setState in the effect).
  const requestKey = `${days}|${country}|${nonce}`;
  const [loadedKey, setLoadedKey] = useState("");
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    const refresh = refreshRef.current;
    refreshRef.current = false;
    let cancelled = false;
    fetch(`/api/admin/search?days=${days}&country=${country}${refresh ? "&refresh=1" : ""}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setFailed("");
      })
      .catch((err: Error) => {
        if (!cancelled) setFailed(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadedKey(`${days}|${country}|${nonce}`);
      });
    return () => {
      cancelled = true;
    };
  }, [days, country, nonce]);

  const load = (refresh: boolean) => {
    refreshRef.current = refresh;
    setNonce((n) => n + 1);
  };

  const g = data?.google;
  const b = data?.bing;
  const period = `vs previous ${days} days`;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="annotation">Google Search Console · Bing Webmaster Tools</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Search.</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="annotation mr-1">Period</span>
        {[7, 28, 90].map((d) => (
          <button key={d} onClick={() => setDays(d)} className={btn(days === d)}>
            Last {d} days
          </button>
        ))}
        <span className="annotation mr-1 ml-4">Country</span>
        {(
          [
            ["all", "All"],
            ["hkg", "Hong Kong"],
            ["twn", "Taiwan"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} onClick={() => setCountry(id)} className={btn(country === id)}>
            {label}
          </button>
        ))}
        <button
          onClick={() => load(true)}
          className="ml-auto border border-line-strong px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {loading ? "Loading…" : "Refresh from Google"}
        </button>
      </div>

      {failed && <p className="border border-line-strong p-4 text-sm text-[#b42318]">Could not load search data: {failed}</p>}

      <div className={`flex flex-col gap-10 transition-opacity ${loading && data ? "opacity-60" : ""}`}>
        {/* ---------------- Google ---------------- */}
        {!g ? (
          <p className="text-sm text-faint">Loading Search Console…</p>
        ) : !g.configured ? (
          <Setup
            title="Connect Google Search Console"
            env="GOOGLE_SERVICE_ACCOUNT_JSON"
            steps={[
              <>In Google Cloud Console, create a project (or use any) and enable the <b>Google Search Console API</b>.</>,
              <>IAM &amp; Admin → Service accounts → <b>Create service account</b> (no roles needed) → Keys → <b>Add key → JSON</b>. A .json file downloads.</>,
              <>In Search Console, open the kodinav.com property → Settings → Users and permissions → <b>Add user</b> → paste the service account&apos;s email (it ends in iam.gserviceaccount.com) → permission <b>Restricted</b>.</>,
              <>Paste the whole contents of the .json file into the environment variable below (or its base64). The dashboard picks the kodinav.com property automatically.</>,
            ]}
          />
        ) : "error" in g ? (
          <div className={card}>
            <h3 className="font-medium text-foreground">Search Console is connected but returned an error</h3>
            <p className="mt-2 text-sm text-[#b42318]">{g.error}</p>
            {g.email && (
              <p className="mt-2 text-sm text-muted">
                Service account: <code className="bg-surface px-1.5 py-0.5">{g.email}</code>. Make sure it is added as a user on
                the property and the Search Console API is enabled in its Google Cloud project.
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-faint">
              Property {g.site} · {g.range.startDate} → {g.range.endDate} · Google data runs about two days behind
            </p>
            <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
              <StatTile label="Clicks from Google" value={g.totals.clicks} previous={g.previous.clicks} periodLabel={period} />
              <StatTile label="Impressions" value={g.totals.impressions} previous={g.previous.impressions} periodLabel={period} />
              <StatTile
                label="Click-through rate"
                value={Math.round(g.totals.ctr * 1000)}
                display={`${(g.totals.ctr * 100).toFixed(1)}%`}
                previous={Math.round(g.previous.ctr * 1000)}
                periodLabel={period}
              />
              <StatTile
                label="Average position"
                value={Math.round(g.totals.position * 10)}
                display={g.totals.position ? g.totals.position.toFixed(1) : "—"}
                previous={g.previous.position ? Math.round(g.previous.position * 10) : undefined}
                lowerIsBetter
                periodLabel={period}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className={card}>
                <ColumnChart
                  title="Impressions per day"
                  series={["Impressions"]}
                  data={g.daily.map((d) => ({ key: d.date, values: [d.impressions], detail: [["clicks", fmtNum(d.clicks)]] }))}
                  empty="No impressions in this period yet. New pages usually take days to weeks to appear."
                />
              </div>
              <div className={card}>
                <ColumnChart
                  title="Clicks per day"
                  series={["Clicks"]}
                  data={g.daily.map((d) => ({ key: d.date, values: [d.clicks], detail: [["impressions", fmtNum(d.impressions)]] }))}
                  empty="No clicks in this period yet."
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="overflow-x-auto border border-line bg-surface-raised">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <caption className="px-4 pt-4 text-left text-sm font-medium text-foreground">
                    Top queries{country !== "all" ? ` in ${country === "hkg" ? "Hong Kong" : "Taiwan"}` : ""}
                  </caption>
                  <thead>
                    <tr className="border-b border-line-strong">
                      <th className="annotation px-4 py-3 font-normal">Query</th>
                      <th className="annotation px-4 py-3 text-right font-normal">Clicks</th>
                      <th className="annotation px-4 py-3 text-right font-normal">Impr.</th>
                      <th className="annotation px-4 py-3 text-right font-normal">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.queries.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-faint">
                          No queries yet for this filter.
                        </td>
                      </tr>
                    ) : (
                      g.queries.map((q) => (
                        <tr key={q.query} className="border-b border-line last:border-0">
                          <td className="px-4 py-2.5 text-foreground">{q.query}</td>
                          <td className="tabular px-4 py-2.5 text-right font-medium">{fmtNum(q.clicks)}</td>
                          <td className="tabular px-4 py-2.5 text-right text-muted">{fmtNum(q.impressions)}</td>
                          <td className="tabular px-4 py-2.5 text-right text-muted">{q.position.toFixed(1)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className={card}>
                <BarList
                  title="Impressions by country"
                  rows={g.countries.map((c) => ({
                    key: c.code,
                    label: COUNTRY_NAMES[c.code] ?? c.code,
                    value: c.impressions,
                    sub: `pos ${c.position.toFixed(1)}`,
                    emphasis: c.code === "HK" || c.code === "TW",
                  }))}
                  note="Hong Kong and Taiwan highlighted"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-line bg-surface-raised">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <caption className="px-4 pt-4 text-left text-sm font-medium text-foreground">Top pages in Google</caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    <th className="annotation px-4 py-3 font-normal">Page</th>
                    <th className="annotation px-4 py-3 text-right font-normal">Clicks</th>
                    <th className="annotation px-4 py-3 text-right font-normal">Impr.</th>
                    <th className="annotation px-4 py-3 text-right font-normal">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {g.pages.map((p) => (
                    <tr key={p.page} className="border-b border-line last:border-0">
                      <td className="max-w-[26rem] truncate px-4 py-2.5 text-foreground">{p.page}</td>
                      <td className="tabular px-4 py-2.5 text-right font-medium">{fmtNum(p.clicks)}</td>
                      <td className="tabular px-4 py-2.5 text-right text-muted">{fmtNum(p.impressions)}</td>
                      <td className="tabular px-4 py-2.5 text-right text-muted">{p.position.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto border border-line bg-surface-raised">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <caption className="px-4 pt-4 text-left text-sm font-medium text-foreground">
                  Google index status: Hong Kong &amp; Taiwan pages
                  <span className="block text-xs font-normal text-faint">Checked with the URL Inspection API, refreshed every 6 hours</span>
                </caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    <th className="annotation px-4 py-3 font-normal">Page</th>
                    <th className="annotation px-4 py-3 font-normal">Status</th>
                    <th className="annotation px-4 py-3 font-normal">Last crawled</th>
                  </tr>
                </thead>
                <tbody>
                  {g.index.map((r) => {
                    const indexed = r.verdict === "PASS";
                    return (
                      <tr key={r.url} className="border-b border-line last:border-0">
                        <td className="px-4 py-2.5 text-foreground">{r.url.replace("https://kodinav.com", "") || "/"}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center gap-1.5 ${indexed ? "text-[#006300]" : r.verdict === "ERROR" ? "text-[#b42318]" : "text-muted"}`}>
                            <span aria-hidden>{indexed ? "✓" : r.verdict === "ERROR" ? "!" : "○"}</span>
                            {r.coverageState}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-muted">
                          {r.lastCrawlTime ? new Date(r.lastCrawlTime).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {g.sitemaps.length > 0 && (
              <p className="text-sm text-muted">
                Sitemaps:{" "}
                {g.sitemaps.map((m) => (
                  <span key={m.path} className="mr-4">
                    {m.path.replace("https://kodinav.com", "")} — {m.contents?.[0]?.submitted ?? "?"} URLs submitted
                    {m.lastDownloaded ? `, read ${new Date(m.lastDownloaded).toLocaleDateString("en-GB")}` : ""}
                    {m.errors && m.errors !== "0" ? `, ${m.errors} errors` : ""}
                  </span>
                ))}
              </p>
            )}
          </>
        )}

        {/* ---------------- Bing ---------------- */}
        <div className="flex flex-col gap-4 border-t border-line-strong pt-10">
          <div>
            <h2 className="text-2xl sm:text-3xl">Bing.</h2>
            <p className="mt-1.5 text-sm text-muted">Also powers Yahoo Taiwan, DuckDuckGo and ChatGPT search results. Global figures.</p>
          </div>
          {!b ? null : !b.configured ? (
            <Setup
              title="Connect Bing Webmaster Tools"
              env="BING_WEBMASTER_API_KEY"
              steps={[
                <>Open bing.com/webmasters and add kodinav.com (use <b>Import from Google Search Console</b>; nothing else to verify).</>,
                <>Settings (gear) → <b>API access</b> → API key → <b>Generate</b>.</>,
                <>Paste the key into the environment variable below.</>,
              ]}
            />
          ) : "error" in b ? (
            <p className="border border-line-strong p-4 text-sm text-[#b42318]">Bing returned an error: {b.error}</p>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              <div className={card}>
                <ColumnChart
                  title="Bing clicks per day"
                  series={["Clicks"]}
                  data={b.daily.map((d) => ({ key: d.date, values: [d.clicks], detail: [["impressions", fmtNum(d.impressions)]] }))}
                  empty="No Bing clicks in this period yet."
                />
              </div>
              <div className={card}>
                <BarList
                  title="Top Bing queries"
                  rows={b.queries.map((q) => ({ key: q.query, label: q.query, value: q.impressions, sub: `${q.clicks} clicks` }))}
                  note="By impressions"
                  empty="No Bing queries recorded yet."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
