import Link from "next/link";
import type { AnalyticsSummary } from "@/lib/analyticsTypes";
import type { Lead } from "@/lib/leadTypes";
import { BarList, ColumnChart, StatTile } from "./charts";
import { fmtDuration, fmtNum } from "./format";

const card = "min-w-0 border border-line bg-surface-raised p-5 sm:p-6";

function Section({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl">{title}</h2>
        {lead && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

function EmptyNotice({ summary }: { summary: AnalyticsSummary }) {
  if (summary.totals.pageviews > 0) return null;
  return (
    <div className="border border-dashed border-line-strong bg-surface-raised p-5 text-sm leading-relaxed text-muted">
      <p className="font-medium text-foreground">No visits recorded in this period yet.</p>
      <p className="mt-1">
        Tracking runs on every public page of the site (English and Chinese) from the deploy that added it. Visits
        appear here within seconds of happening. Your own visits count too, unless you browse in a private window with
        tracking blocked.
      </p>
    </div>
  );
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function OverviewPanel({ summary: s, leads }: { summary: AnalyticsSummary; leads: Lead[] }) {
  // Until an earlier period has data, every delta would read "New" — hide them.
  const compare = s.previous.pageviews > 0;
  const period = `vs previous ${s.days} days`;
  const prev = (n: number) => (compare ? n : undefined);
  const conversion = s.totals.visits ? (s.totals.leads + s.totals.contacts) / s.totals.visits : 0;
  const prevConversion = s.previous.visits ? (s.previous.leads + s.previous.contacts) / s.previous.visits : 0;
  const recent = leads.slice(0, 5);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="annotation">
            {s.from} → {s.to} · Hong Kong time
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl">Overview.</h1>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted">
          <span className="relative flex size-2">
            {s.realtime > 0 && <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />}
            <span className={`relative inline-flex size-2 rounded-full ${s.realtime > 0 ? "bg-accent" : "bg-line-strong"}`} />
          </span>
          <span className="font-medium text-foreground">{s.realtime}</span> on the site now
        </p>
      </div>

      <EmptyNotice summary={s} />

      <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        <StatTile label="Visitors" value={s.totals.visitors} previous={prev(s.previous.visitors)} periodLabel={period} />
        <StatTile label="Page views" value={s.totals.pageviews} previous={prev(s.previous.pageviews)} periodLabel={period} />
        <StatTile label="Leads" value={s.totals.leads} previous={prev(s.previous.leads)} periodLabel={period} />
        <StatTile
          label="WhatsApp / email / call clicks"
          value={s.totals.contacts}
          previous={prev(s.previous.contacts)}
          periodLabel={period}
        />
        <StatTile label="Visits" value={s.totals.visits} previous={prev(s.previous.visits)} periodLabel={period} />
        <StatTile
          label="Avg. time on page"
          value={s.totals.avgEngagedSec}
          display={fmtDuration(s.totals.avgEngagedSec)}
          previous={prev(s.previous.avgEngagedSec)}
          periodLabel={period}
        />
        <StatTile
          label="Single-page visits"
          value={Math.round(s.totals.bounceRate * 100)}
          display={pct(s.totals.bounceRate)}
          previous={prev(Math.round(s.previous.bounceRate * 100))}
          lowerIsBetter
          periodLabel={period}
        />
        <StatTile
          label="Enquiry rate"
          value={Math.round(conversion * 1000)}
          display={`${(conversion * 100).toFixed(1)}%`}
          previous={prev(Math.round(prevConversion * 1000))}
          periodLabel={period}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className={card}>
          <ColumnChart
            title="Visitors per day"
            series={["Visitors"]}
            data={s.daily.map((d) => ({
              key: d.date,
              values: [d.visitors],
              detail: [
                ["page views", fmtNum(d.pageviews)],
                ["visits", fmtNum(d.visits)],
              ],
            }))}
          />
        </div>
        <div className={card}>
          <ColumnChart
            title="Enquiries per day"
            series={["Leads", "Contact clicks"]}
            data={s.daily.map((d) => ({ key: d.date, values: [d.leads, d.contacts] }))}
            empty="No leads or WhatsApp / email / call clicks in this period yet."
          />
        </div>
      </div>

      <Section
        title="Hong Kong & Taiwan."
        lead="Visitors whose browser runs on Hong Kong or Taiwan time, and the enquiries they sent. Chinese page views count visits to /zh-hk and /zh-tw."
      >
        <div className="grid gap-px border border-line bg-line md:grid-cols-2">
          {s.markets.map((m) => (
            <div key={m.code} className="flex flex-col gap-4 bg-surface-raised p-5 sm:p-6">
              <p className="text-lg font-medium text-foreground">{m.name}</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-5">
                {(
                  [
                    ["Visits", m.visits],
                    ["Page views", m.pageviews],
                    ["Chinese pages", m.zhPageviews],
                    ["Contact clicks", m.contacts],
                    ["Leads", m.leads],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt className="annotation">{k}</dt>
                    <dd className="mt-1 text-2xl font-semibold text-foreground">{fmtNum(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={card}>
          <BarList title="Where visits come from" rows={s.channels} note="By channel, counted per visit" />
        </div>
        <div className={card}>
          <BarList title="Top sources" rows={s.sources.slice(0, 8)} />
        </div>
        <div className={card}>
          <BarList
            title="Countries"
            rows={s.countries.slice(0, 8)}
            note="Hong Kong and Taiwan highlighted"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className={card}>
          <BarList
            title="Leads by channel"
            rows={s.leadChannels}
            note="Where the visit that produced each lead started"
            empty="No leads in this period."
          />
        </div>
        <div className={card}>
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-foreground">Latest leads</h3>
            <Link href="/admin?tab=leads" className="text-xs text-accent hover:underline">
              All leads →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="border border-dashed border-line px-4 py-6 text-center text-sm text-faint">No leads yet.</p>
          ) : (
            <ul className="flex flex-col">
              {recent.map((l) => (
                <li key={l.id} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0">
                  <span className="min-w-0 truncate">
                    <span className="text-foreground">{l.name}</span>
                    <span className="text-faint">
                      {" "}
                      · {l.source}
                      {l.country ? ` · ${l.country}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {new Date(l.receivedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function TrafficPanel({ summary: s }: { summary: AnalyticsSummary }) {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <p className="annotation">
          {s.from} → {s.to} · Hong Kong time · stored in {s.storage === "redis" ? "Upstash Redis" : "data/analytics on the server"}
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Traffic.</h1>
      </div>

      <EmptyNotice summary={s} />

      <div className={card}>
        <ColumnChart
          title="Page views per day"
          series={["Page views"]}
          height={240}
          data={s.daily.map((d) => ({
            key: d.date,
            values: [d.pageviews],
            detail: [
              ["visitors", fmtNum(d.visitors)],
              ["visits", fmtNum(d.visits)],
            ],
          }))}
        />
      </div>

      <Section title="Pages." lead="Views, visitors, average visible time on the page, and how many visits started there.">
        <div className="overflow-x-auto border border-line bg-surface-raised">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line-strong">
                <th className="annotation px-4 py-3 font-normal">Page</th>
                <th className="annotation px-4 py-3 text-right font-normal">Views</th>
                <th className="annotation px-4 py-3 text-right font-normal">Visitors</th>
                <th className="annotation px-4 py-3 text-right font-normal">Avg. time</th>
                <th className="annotation px-4 py-3 text-right font-normal">Entries</th>
              </tr>
            </thead>
            <tbody>
              {s.pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-faint">
                    No page views yet.
                  </td>
                </tr>
              ) : (
                s.pages.map((p) => (
                  <tr key={p.key} className="border-b border-line last:border-0">
                    <td className="max-w-[22rem] truncate px-4 py-2.5">
                      <a href={p.key} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent">
                        {p.key}
                      </a>
                    </td>
                    <td className="tabular px-4 py-2.5 text-right font-medium">{fmtNum(p.value)}</td>
                    <td className="tabular px-4 py-2.5 text-right text-muted">{p.sub?.replace(" visitors", "")}</td>
                    <td className="tabular px-4 py-2.5 text-right text-muted">{fmtDuration(p.avgSec)}</td>
                    <td className="tabular px-4 py-2.5 text-right text-muted">{fmtNum(p.entries)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Acquisition." lead="Counted per visit, by the page and referrer the visit started with.">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className={card}>
            <BarList title="Channels" rows={s.channels} />
          </div>
          <div className={card}>
            <BarList title="Sources" rows={s.sources} />
          </div>
          <div className={card}>
            <BarList
              title="AI assistants"
              rows={s.aiSources}
              note="ChatGPT, Perplexity, Copilot, Gemini, Claude…"
              empty="No visits from AI assistants yet. This is the answer-engine signal to watch."
            />
          </div>
          <div className={card}>
            <BarList title="Landing pages" rows={s.landingPages} />
          </div>
          <div className={card}>
            <BarList
              title="Campaigns (UTM)"
              rows={s.campaigns}
              note="source / medium / campaign"
              empty="No tagged campaign visits. Add utm_source to ad and social links."
            />
          </div>
          <div className={card}>
            <BarList title="Leads by source" rows={s.leadSources} empty="No leads in this period." />
          </div>
        </div>
      </Section>

      <Section title="Audience.">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className={card}>
            <BarList title="Countries" rows={s.countries} note="From browser timezone" />
          </div>
          <div className={card}>
            <BarList title="Page language" rows={s.languages} note="Page views by the language of the page" />
          </div>
          <div className={card}>
            <BarList title="Devices" rows={s.devices} />
          </div>
          <div className={card}>
            <BarList title="Actions" rows={s.events} empty="No clicks or audits recorded yet." />
          </div>
        </div>
      </Section>
    </div>
  );
}
