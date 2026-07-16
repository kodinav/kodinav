"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type AuditResult,
  type Finding,
  type Severity,
  type SpeedResult,
} from "@/lib/auditTypes";

/**
 * Speed test — the audit engine's speed lens plus Google's own lab data.
 * The PSI panel renders only when Google answers; a missing lab run is a
 * quiet absence, never an error the visitor has to care about.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

const SEV: Record<Severity, { mark: string; cls: string }> = {
  critical: { mark: "✕", cls: "text-accent" },
  warning: { mark: "!", cls: "text-foreground/70" },
  pass: { mark: "✓", cls: "text-foreground/50" },
};

function ttfbWord(ms: number) {
  if (ms < 200) return "excellent";
  if (ms < 500) return "good";
  if (ms < 1000) return "slow";
  return "very slow";
}

export function SpeedTest() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [speed, setSpeed] = useState<SpeedResult | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state === "running") return;
    setState("running");
    setError("");
    setSpeed(null);
    try {
      const target = url.trim();
      // Google's lab run takes up to ~30s — fire it alongside the scan and
      // let whichever finishes first land; the panel appears when it arrives.
      const speedPromise = fetch(
        `/api/audit/speed?url=${encodeURIComponent(target)}`
      )
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      const res = await fetch("/api/audit/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Test failed. Try again.");
      setResult(data as AuditResult);
      setState("done");
      const sp = (await speedPromise) as SpeedResult | null;
      if (sp && sp.performance !== null) setSpeed(sp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Test failed. Try again.");
      setState("error");
    }
  };

  const findings: Finding[] = result
    ? result.findings.filter((f) => f.category === "speed")
    : [];
  const score = result?.scores.speed ?? 0;
  const verdict = score >= 80 ? "Fast" : score >= 50 ? "Needs work" : "Slow";

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          placeholder="yourwebsite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Website address to test"
          className={inputCls}
        />
        <button
          type="submit"
          disabled={state === "running"}
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-accent bg-accent px-7 py-3.5 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "running" ? "Testing…" : "Test speed"}
        </button>
      </form>

      {state === "error" && <p className="text-sm text-accent">{error}</p>}

      {state === "done" && result && (
        <div className="ink relative p-7 sm:p-8">
          <div
            aria-hidden
            className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="annotation mb-2">{result.finalUrl}</p>
 <p className="font-display text-4xl sm:text-5xl">{verdict}</p>
            </div>
            <p className="font-mono text-sm text-foreground/80">
              Speed score: <span className="text-accent">{score}/100</span>
            </p>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="border border-line p-4">
              <dt className="annotation">Server response</dt>
 <dd className="mt-2 font-display text-2xl">
                {result.ttfbMs} ms
              </dd>
              <dd className="mt-1 text-xs text-muted">
                Time to first byte — {ttfbWord(result.ttfbMs)}.
              </dd>
            </div>
            <div className="border border-line p-4">
              <dt className="annotation">Page HTML</dt>
 <dd className="mt-2 font-display text-2xl">
                {Math.round(result.htmlBytes / 1024)} KB
              </dd>
              <dd className="mt-1 text-xs text-muted">
                What the browser downloads before anything renders.
              </dd>
            </div>
            <div className="border border-line p-4">
              <dt className="annotation">Page complexity</dt>
 <dd className="mt-2 font-display text-2xl">
                {result.domElements.toLocaleString("en-US")}
              </dd>
              <dd className="mt-1 text-xs text-muted">
                HTML elements the phone has to lay out.
              </dd>
            </div>
          </dl>

          {speed && speed.performance !== null && (
            <div className="mt-6 border-t border-line pt-6">
              <p className="annotation mb-4">
                Google&apos;s own lab data (mobile)
              </p>
              <dl className="grid gap-4 sm:grid-cols-4">
                <div>
                  <dt className="annotation text-faint">Performance</dt>
 <dd className="mt-1 font-display text-3xl text-accent">
                    {speed.performance}/100
                  </dd>
                </div>
                {speed.lcpMs !== null && (
                  <div>
                    <dt className="annotation text-faint">Largest paint</dt>
 <dd className="mt-1 font-display text-3xl">
                      {(speed.lcpMs / 1000).toFixed(1)}s
                    </dd>
                    <dd className="text-xs text-muted">Google&apos;s bar: under 2.5s</dd>
                  </div>
                )}
                {speed.tbtMs !== null && (
                  <div>
                    <dt className="annotation text-faint">Blocking time</dt>
 <dd className="mt-1 font-display text-3xl">
                      {Math.round(speed.tbtMs)} ms
                    </dd>
                    <dd className="text-xs text-muted">Bar: under 200 ms</dd>
                  </div>
                )}
                {speed.cls !== null && (
                  <div>
                    <dt className="annotation text-faint">Layout shift</dt>
 <dd className="mt-1 font-display text-3xl">
                      {speed.cls.toFixed(2)}
                    </dd>
                    <dd className="text-xs text-muted">Bar: under 0.1</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {findings.length > 0 && (
            <ul className="mt-6 flex flex-col gap-4 border-t border-line pt-6">
              {findings.map((f) => (
                <li key={f.id} className="flex gap-4">
                  <span aria-hidden className={`font-mono text-lg leading-6 ${SEV[f.severity].cls}`}>
                    {SEV[f.severity].mark}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{f.detail}</p>
                    {f.fix && (
                      <p className="mt-1 text-sm leading-relaxed text-faint">Fix: {f.fix}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 border-t border-line pt-6">
            <p className="text-sm leading-relaxed text-muted">
              Speed is one of five things that decide whether a website earns
              enquiries. The full report also grades mobile, SEO, conversion
              and trust.
            </p>
            <Link
              href="/free-website-audit"
              className="u-draw mt-3 inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent"
            >
              Run the full free website audit →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
