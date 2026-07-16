"use client";

import { useState } from "react";
import Link from "next/link";
import { type RedirectTrace } from "@/lib/auditTypes";

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

function statusWord(s: number) {
  if (s === 301 || s === 308) return "permanent redirect";
  if (s === 302 || s === 303 || s === 307) return "temporary redirect";
  if (s >= 200 && s < 300) return "final page";
  return `HTTP ${s}`;
}

type Variant = { label: string; trace: RedirectTrace | null; error: string };

export function RedirectChecker() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [trace, setTrace] = useState<RedirectTrace | null>(null);
  const [variants, setVariants] = useState<Variant[] | null>(null);
  const [variantsBusy, setVariantsBusy] = useState(false);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state === "running") return;
    setState("running");
    setError("");
    setVariants(null);
    try {
      const res = await fetch(`/api/tools/redirects?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Trace failed. Try again.");
      setTrace(data as RedirectTrace);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trace failed. Try again.");
      setState("error");
    }
  };

  /** The check most people actually need: do all four faces of the domain
      land on one canonical address? */
  const runVariants = async () => {
    if (!trace || variantsBusy) return;
    setVariantsBusy(true);
    const host = new URL(trace.finalUrl).hostname.replace(/^www\./, "");
    const targets = [
      { label: `http://${host}`, u: `http://${host}` },
      { label: `https://${host}`, u: `https://${host}` },
      { label: `http://www.${host}`, u: `http://www.${host}` },
      { label: `https://www.${host}`, u: `https://www.${host}` },
    ];
    const results: Variant[] = [];
    for (const t of targets) {
      try {
        const res = await fetch(`/api/tools/redirects?url=${encodeURIComponent(t.u)}`);
        const data = await res.json();
        if (!res.ok) results.push({ label: t.label, trace: null, error: data.error || "failed" });
        else results.push({ label: t.label, trace: data as RedirectTrace, error: "" });
      } catch {
        results.push({ label: t.label, trace: null, error: "failed" });
      }
    }
    setVariants(results);
    setVariantsBusy(false);
  };

  const redirects = trace ? trace.hops.length - 1 : 0;
  const hasTemp = trace?.hops.some((h) => h.status === 302 || h.status === 303 || h.status === 307);

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          placeholder="yourwebsite.com — or an old page URL you redirected"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Address to trace"
          className={inputCls}
        />
        <button
          type="submit"
          disabled={state === "running"}
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-accent bg-accent px-7 py-3.5 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "running" ? "Tracing…" : "Trace redirects"}
        </button>
      </form>

      {state === "error" && <p className="text-sm text-accent">{error}</p>}

      {state === "done" && trace && (
        <div className="ink relative p-7 sm:p-8">
          <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
 <p className="font-display text-3xl sm:text-4xl">
              {redirects === 0
                ? "No redirects"
                : `${redirects} redirect${redirects > 1 ? "s" : ""}`}
            </p>
            <p className="font-mono text-sm text-foreground/80">
              Total: <span className="text-accent">{trace.totalMs} ms</span>
            </p>
          </div>

          <ol className="mt-6 flex flex-col gap-3">
            {trace.hops.map((h, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-0.5 font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="break-all font-mono text-xs leading-relaxed text-foreground/90">{h.url}</p>
                  <p className={`mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] ${h.status >= 400 ? "text-accent" : "text-faint"}`}>
                    HTTP {h.status} — {statusWord(h.status)}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-sm leading-relaxed text-muted">
            {redirects === 0 && (
              <p>Clean: the address answers directly. Nothing to fix here.</p>
            )}
            {redirects === 1 && (
              <p>One hop is normal — typically http→https or www normalisation.</p>
            )}
            {redirects >= 2 && (
              <p>
                Each hop adds a round-trip before your page even starts loading,
                and dilutes SEO signals along the chain. Aim for a single hop:
                every old URL should redirect straight to its final destination.
              </p>
            )}
            {hasTemp && (
              <p>
                A hop uses a <span className="text-foreground">temporary</span>{" "}
                (302/307) redirect. If the move is permanent, use 301/308 —
                temporary redirects tell Google to keep the old URL indexed.
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <button
              type="button"
              onClick={runVariants}
              disabled={variantsBusy}
              className="border border-line-strong px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
            >
              {variantsBusy
                ? "Checking all four…"
                : `Check all 4 versions of ${new URL(trace.finalUrl).hostname.replace(/^www\./, "")}`}
            </button>
            <p className="mt-2 text-xs text-faint">
              http / https × www / bare — all four should land on one address
              in a single hop, or Google sees duplicate sites.
            </p>
          </div>

          {variants && (
            <div className="mt-5 border-t border-line pt-5">
              <ul className="flex flex-col gap-2.5">
                {variants.map((v) => {
                  const finals = variants.filter((x) => x.trace).map((x) => x.trace!.finalUrl);
                  const consistent = new Set(finals).size === 1;
                  const hops = v.trace ? v.trace.hops.length - 1 : 0;
                  const ok = v.trace && hops <= 1 && consistent;
                  return (
                    <li key={v.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span aria-hidden className={`font-mono ${v.trace ? (ok ? "text-foreground/50" : "text-accent") : "text-accent"}`}>
                        {v.trace ? (ok ? "✓" : "!") : "✕"}
                      </span>
                      <span className="font-mono text-xs text-foreground/90">{v.label}</span>
                      <span className="text-xs text-muted">
                        {v.trace
                          ? `→ ${new URL(v.trace.finalUrl).hostname}${new URL(v.trace.finalUrl).pathname} (${hops} hop${hops === 1 ? "" : "s"})`
                          : v.error}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {(() => {
                const finals = variants.filter((x) => x.trace).map((x) => x.trace!.finalUrl);
                const consistent = new Set(finals).size === 1 && finals.length === 4;
                return (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {consistent
                      ? "All four versions resolve to one canonical address — exactly right."
                      : "The four versions don't all end at one address in one hop. Fix the odd ones out at your host or DNS so search engines see a single site."}
                  </p>
                );
              })()}
            </div>
          )}

          <div className="mt-6 border-t border-line pt-5">
            <Link
              href="/free-website-audit"
              className="u-draw font-mono text-xs uppercase tracking-[0.14em] text-accent"
            >
              Check the rest of the site — run the full free audit →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
