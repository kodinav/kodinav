"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, CATEGORY_META, type AuditResult } from "@/lib/auditTypes";

/**
 * Side-by-side audit of two websites — typically yours against the
 * competitor whose name keeps coming up. Two runs of the same engine,
 * one honest scoreboard.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

async function scan(url: string): Promise<AuditResult> {
  const res = await fetch("/api/audit/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Could not scan ${url}.`);
  return data as AuditResult;
}

export function CompareWebsites() {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [a, setA] = useState<AuditResult | null>(null);
  const [b, setB] = useState<AuditResult | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlA.trim() || !urlB.trim() || state === "running") return;
    setState("running");
    setError("");
    try {
      const [ra, rb] = await Promise.all([scan(urlA.trim()), scan(urlB.trim())]);
      setA(ra);
      setB(rb);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed. Try again.");
      setState("error");
    }
  };

  const rows = a && b
    ? [
        { label: "Overall", a: a.overall, b: b.overall },
        ...CATEGORIES.map((c) => ({
          label: CATEGORY_META[c].label,
          a: a.scores[c],
          b: b.scores[c],
        })),
      ]
    : [];
  const winsA = rows.filter((r) => r.a > r.b).length;
  const winsB = rows.filter((r) => r.b > r.a).length;
  const hostA = a ? new URL(a.finalUrl).hostname : "";
  const hostB = b ? new URL(b.finalUrl).hostname : "";

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={run} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div>
          <label htmlFor="cmp-a" className="annotation mb-2 block">
            Your website
          </label>
          <input
            id="cmp-a"
            type="text"
            inputMode="url"
            placeholder="yourwebsite.com"
            value={urlA}
            onChange={(e) => setUrlA(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="cmp-b" className="annotation mb-2 block">
            Their website
          </label>
          <input
            id="cmp-b"
            type="text"
            inputMode="url"
            placeholder="competitor.com"
            value={urlB}
            onChange={(e) => setUrlB(e.target.value)}
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          disabled={state === "running"}
          className="inline-flex items-center justify-center gap-2 self-end border border-accent bg-accent px-7 py-3.5 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "running" ? "Comparing…" : "Compare"}
        </button>
      </form>

      {state === "error" && <p className="text-sm text-accent">{error}</p>}

      {state === "done" && a && b && (
        <div className="ink relative p-7 sm:p-8">
          <div
            aria-hidden
            className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background"
          />
          <p className="annotation mb-2">The scoreboard</p>
          <p className="font-display text-3xl uppercase sm:text-4xl">
            {winsA > winsB
              ? `${hostA} leads ${winsA}–${winsB}`
              : winsB > winsA
                ? `${hostB} leads ${winsB}–${winsA}`
                : "Dead heat"}
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-105 border-collapse text-sm">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  <th className="py-2 pr-4 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                    Category
                  </th>
                  <th className="py-2 pr-4 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                    {hostA}
                  </th>
                  <th className="py-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                    {hostB}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-line">
                    <td className="py-2.5 pr-4 text-muted">{r.label}</td>
                    <td className={`py-2.5 pr-4 font-mono ${r.a >= r.b ? "text-accent" : "text-foreground/70"}`}>
                      {r.a}
                      {r.a > r.b && <span aria-hidden> ◄</span>}
                    </td>
                    <td className={`py-2.5 font-mono ${r.b >= r.a ? "text-accent" : "text-foreground/70"}`}>
                      {r.b}
                      {r.b > r.a && <span aria-hidden> ◄</span>}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-line">
                  <td className="py-2.5 pr-4 text-muted">Server response</td>
                  <td className={`py-2.5 pr-4 font-mono ${a.ttfbMs <= b.ttfbMs ? "text-accent" : "text-foreground/70"}`}>
                    {a.ttfbMs} ms
                  </td>
                  <td className={`py-2.5 font-mono ${b.ttfbMs <= a.ttfbMs ? "text-accent" : "text-foreground/70"}`}>
                    {b.ttfbMs} ms
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            <div>
              <p className="annotation mb-2">{hostA} — biggest issue</p>
              <p className="text-sm leading-relaxed text-muted">{a.headline}</p>
            </div>
            <div>
              <p className="annotation mb-2">{hostB} — biggest issue</p>
              <p className="text-sm leading-relaxed text-muted">{b.headline}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <p className="text-sm leading-relaxed text-muted">
              A scoreboard shows who is ahead; it doesn&apos;t close the gap.
              The full audit lists every fix behind these numbers —{" "}
              <Link href="/free-website-audit" className="u-draw text-accent">
                run it on your site free
              </Link>
              , or{" "}
              <Link href="/contact" className="u-draw text-accent">
                have the studio fix the losing rows
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
