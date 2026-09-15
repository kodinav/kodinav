"use client";

import { useEffect, useRef, useState } from "react";
import { fmtDuration, fmtNum } from "./format";

/*
 * Admin charts. Hand-built SVG, no chart library. Validated palette:
 * slot 1 cobalt #1b3ad6 (the site accent), slot 2 orange #eb6834 — both pass
 * lightness, chroma, CVD separation and ≥3:1 on white. De-emphasis gray for
 * context marks. Text never wears a series colour. Every chart has a table
 * view; tooltips enhance, never gate.
 */

export const SERIES = ["#1b3ad6", "#eb6834"] as const;
const MUTED_MARK = "#c4c2ba";
const GRID = "#e7e5de";
const AXIS_TEXT = "#6c6e77";


const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function niceMax(value: number) {
  if (value <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (step * pow >= value) return step * pow;
  }
  return 10 * pow;
}

function useWidth<T extends HTMLElement>(fallback = 640) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/* ------------------------------------------------------------------ */
/* Stat tile                                                           */
/* ------------------------------------------------------------------ */

export function StatTile({
  label,
  value,
  display,
  previous,
  lowerIsBetter = false,
  periodLabel,
}: {
  label: string;
  value: number;
  display?: string;
  previous?: number;
  lowerIsBetter?: boolean;
  periodLabel?: string;
}) {
  let delta: { text: string; tone: "good" | "bad" | "flat" } | null = null;
  if (previous !== undefined) {
    if (previous === 0 && value === 0) delta = { text: "No change", tone: "flat" };
    else if (previous === 0) delta = { text: "New", tone: lowerIsBetter ? "bad" : "good" };
    else {
      const pct = Math.round(((value - previous) / previous) * 100);
      const up = pct > 0;
      delta = {
        text: `${up ? "▲" : pct < 0 ? "▼" : ""} ${Math.abs(pct)}%`,
        tone: pct === 0 ? "flat" : up !== lowerIsBetter ? "good" : "bad",
      };
    }
  }
  return (
    <div className="flex flex-col gap-1.5 bg-surface-raised p-5">
      <p className="annotation">{label}</p>
      <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-[2.1rem]">{display ?? fmtNum(value)}</p>
      {delta && (
        <p className="text-xs text-muted">
          <span
            className={
              delta.tone === "good" ? "font-medium text-[#006300]" : delta.tone === "bad" ? "font-medium text-[#b42318]" : ""
            }
          >
            {delta.text}
          </span>{" "}
          {periodLabel}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Column chart (single or stacked), with tooltip + table view          */
/* ------------------------------------------------------------------ */

export type ColumnDatum = { key: string; values: number[]; detail?: [string, string][] };

export function ColumnChart({
  title,
  data,
  series,
  height = 200,
  empty = "No data for this period yet.",
}: {
  title: string;
  data: ColumnDatum[];
  series: string[]; // names, in palette order
  height?: number;
  empty?: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const stacked = series.length > 1;

  const totals = data.map((d) => d.values.reduce((a, b) => a + b, 0));
  const hasData = totals.some((t) => t > 0);
  const max = niceMax(Math.max(0, ...totals));

  const pad = { top: 12, right: 8, bottom: 28, left: 36 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const band = plotW / Math.max(1, data.length);
  const barW = Math.max(2, Math.min(24, band * 0.62));
  const y = (v: number) => pad.top + plotH - (v / max) * plotH;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(plotW / 64))));

  // Rounded 4px data-end on the topmost segment only; square at the baseline.
  const columnPath = (x: number, top: number, bottom: number, rounded: boolean) => {
    const h = bottom - top;
    if (h <= 0) return "";
    const r = rounded ? Math.min(4, barW / 2, h) : 0;
    return `M${x},${bottom} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${bottom} Z`;
  };

  const tip = active !== null ? data[active] : null;
  const tipX = active !== null ? pad.left + active * band + band / 2 : 0;

  return (
    <figure className="flex min-w-0 flex-col gap-3">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {stacked && (
          <span className="flex flex-wrap gap-4">
            {series.map((name, i) => (
              <span key={name} className="flex items-center gap-1.5 text-xs text-muted">
                <span aria-hidden className="size-2.5 rounded-[2px]" style={{ background: SERIES[i] }} />
                {name}
              </span>
            ))}
          </span>
        )}
      </figcaption>

      <div ref={ref} className="relative w-full min-w-0 overflow-hidden">
        {!hasData ? (
          <div
            className="flex items-center justify-center border border-dashed border-line text-sm text-faint"
            style={{ height }}
          >
            {empty}
          </div>
        ) : (
          <>
            <svg width={width} height={height} role="img" aria-label={`${title} chart`} className="block">
              {[0, 0.5, 1].map((f) => (
                <g key={f}>
                  <line x1={pad.left} x2={width - pad.right} y1={y(max * f)} y2={y(max * f)} stroke={GRID} strokeWidth={1} />
                  <text x={pad.left - 8} y={y(max * f) + 4} textAnchor="end" fontSize={11} fill={AXIS_TEXT} className="tabular">
                    {fmtNum(Math.round(max * f))}
                  </text>
                </g>
              ))}
              {data.map((d, i) => {
                const x = pad.left + i * band + (band - barW) / 2;
                let base = 0;
                const topIndex = d.values.reduce((last, v, k) => (v > 0 ? k : last), -1);
                return (
                  <g key={d.key} opacity={active === null || active === i ? 1 : 0.55}>
                    {d.values.map((v, k) => {
                      if (v <= 0) return null;
                      const bottom = y(base) - (base > 0 ? 2 : 0); // 2px surface gap between stacked segments
                      base += v;
                      return (
                        <path key={k} d={columnPath(x, y(base), bottom, k === topIndex)} fill={SERIES[k] ?? MUTED_MARK} />
                      );
                    })}
                    {i % labelEvery === 0 && (
                      <text x={pad.left + i * band + band / 2} y={height - 8} textAnchor="middle" fontSize={11} fill={AXIS_TEXT}>
                        {/^\d{4}-\d{2}-\d{2}$/.test(d.key) ? shortDate(d.key) : d.key}
                      </text>
                    )}
                    <rect
                      x={pad.left + i * band}
                      y={pad.top}
                      width={band}
                      height={plotH}
                      fill="transparent"
                      tabIndex={0}
                      aria-label={`${d.key}: ${d.values.map((v, k) => `${series[k]} ${v}`).join(", ")}`}
                      onPointerEnter={() => setActive(i)}
                      onPointerLeave={() => setActive(null)}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      className="outline-none"
                    />
                  </g>
                );
              })}
              <line x1={pad.left} x2={width - pad.right} y1={y(0)} y2={y(0)} stroke="#cfcdc5" strokeWidth={1} />
            </svg>
            {tip && (
              <div
                role="status"
                className="pointer-events-none absolute top-0 z-10 min-w-36 -translate-x-1/2 border border-line-strong bg-surface-raised px-3 py-2 shadow-[0_8px_24px_-12px_rgba(22,23,27,0.35)]"
                style={{ left: Math.min(Math.max(tipX, 80), width - 80) }}
              >
                <p className="mb-1 text-xs text-muted">
                  {/^\d{4}-\d{2}-\d{2}$/.test(tip.key) ? shortDate(tip.key) : tip.key}
                </p>
                {tip.values.map((v, k) => (
                  <p key={k} className="flex items-center gap-2 text-sm">
                    {stacked && <span aria-hidden className="h-0.5 w-3" style={{ background: SERIES[k] }} />}
                    <span className="font-semibold text-foreground">{fmtNum(v)}</span>
                    <span className="text-muted">{series[k]}</span>
                  </p>
                ))}
                {tip.detail?.map(([k, v]) => (
                  <p key={k} className="text-xs text-muted">
                    <span className="font-medium text-foreground">{v}</span> {k}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {hasData && (
        <details className="text-sm">
          <summary className="cursor-pointer text-xs text-faint hover:text-foreground">Table view</summary>
          <div className="mt-2 max-h-64 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-1.5 pr-3 font-medium text-muted">Date</th>
                  {series.map((s) => (
                    <th key={s} className="py-1.5 pr-3 text-right font-medium text-muted">
                      {s}
                    </th>
                  ))}
                  {data[0]?.detail?.map(([k]) => (
                    <th key={k} className="py-1.5 pr-3 text-right font-medium text-muted">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.key} className="border-b border-line/60">
                    <td className="py-1.5 pr-3 text-muted">{d.key}</td>
                    {d.values.map((v, k) => (
                      <td key={k} className="tabular py-1.5 pr-3 text-right">
                        {v}
                      </td>
                    ))}
                    {d.detail?.map(([k, v]) => (
                      <td key={k} className="tabular py-1.5 pr-3 text-right">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Bar list — ranked categories, every value labelled                  */
/* ------------------------------------------------------------------ */

export function BarList({
  title,
  rows,
  empty = "Nothing recorded yet.",
  note,
  unit = "count",
}: {
  title: string;
  rows: { key: string; label: string; value: number; sub?: string; emphasis?: boolean }[];
  empty?: string;
  note?: string;
  /** Plain values only: server components can't pass formatter functions to a client component. */
  unit?: "count" | "duration";
}) {
  const format = unit === "duration" ? fmtDuration : fmtNum;
  const max = Math.max(1, ...rows.map((r) => r.value));
  const emphasisMode = rows.some((r) => r.emphasis);
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {note && <p className="mt-0.5 text-xs text-faint">{note}</p>}
      </div>
      {rows.length === 0 ? (
        <p className="border border-dashed border-line px-4 py-6 text-center text-sm text-faint">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {rows.map((r) => (
            <li key={r.key} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-foreground" title={r.label}>
                  {r.label}
                  {r.sub && <span className="ml-2 text-xs text-faint">{r.sub}</span>}
                </span>
                <span className="tabular shrink-0 font-medium text-foreground">{format(r.value)}</span>
              </div>
              <div className="h-1.5 w-full" aria-hidden>
                <div
                  className="h-full rounded-r-[4px]"
                  style={{
                    width: `${Math.max(1.5, (r.value / max) * 100)}%`,
                    background: !emphasisMode || r.emphasis ? SERIES[0] : MUTED_MARK,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
