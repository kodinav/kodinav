"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type AuditResult,
  type Finding,
  type Severity,
} from "@/lib/auditTypes";

/**
 * Mobile-friendliness checker. Thin client over the existing audit engine —
 * it runs the same SSRF-guarded scan and presents only the mobile category,
 * with the full audit as the natural next step.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

const SEV: Record<Severity, { mark: string; cls: string; label: string }> = {
  critical: { mark: "✕", cls: "text-accent", label: "Fail" },
  warning: { mark: "!", cls: "text-foreground/70", label: "Warning" },
  pass: { mark: "✓", cls: "text-foreground/50", label: "Pass" },
};

export function MobileFriendlyChecker() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state === "running") return;
    setState("running");
    setError("");
    try {
      const res = await fetch("/api/audit/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed. Try again.");
      setResult(data as AuditResult);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed. Try again.");
      setState("error");
    }
  };

  const mobile: Finding[] = result
    ? result.findings.filter((f) => f.category === "mobile")
    : [];
  const fails = mobile.filter((f) => f.severity !== "pass");
  const score = result?.scores.mobile ?? 0;
  const verdict =
    score >= 90
      ? "Mobile-friendly"
      : score >= 60
        ? "Partly mobile-friendly"
        : "Not mobile-friendly";

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
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-accent bg-accent px-7 py-3.5 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "running" ? "Testing…" : "Test my website"}
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
              <p className="font-display text-4xl uppercase sm:text-5xl">
                {verdict}
              </p>
            </div>
            <p className="font-mono text-sm text-foreground/80">
              Mobile score: <span className="text-accent">{score}/100</span>
            </p>
          </div>

          <ul className="mt-6 flex flex-col gap-4">
            {mobile.map((f) => (
              <li key={f.id} className="flex gap-4">
                <span
                  aria-hidden
                  className={`font-mono text-lg leading-6 ${SEV[f.severity].cls}`}
                >
                  {SEV[f.severity].mark}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {f.title}{" "}
                    <span className="ml-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                      {SEV[f.severity].label}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{f.detail}</p>
                  {f.fix && (
                    <p className="mt-1 text-sm leading-relaxed text-faint">Fix: {f.fix}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-line pt-6">
            <p className="text-sm leading-relaxed text-muted">
              {fails.length > 0
                ? "Mobile is one of five things that decide whether a website earns enquiries. See the rest — speed, SEO, conversion and trust — in the full report."
                : "Mobile looks solid. The full audit checks the other four things that decide whether a website earns enquiries: speed, SEO, conversion and trust."}
            </p>
            <Link
              href="/free-website-audit"
              className="u-draw mt-3 inline-block font-mono text-xs uppercase tracking-[0.18em] text-accent"
            >
              Run the full free website audit →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
