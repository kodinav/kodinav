"use client";

import { useState } from "react";
import Link from "next/link";
import { type LinkCheckResult, type LinkCheckState } from "@/lib/auditTypes";

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

const STATE_META: Record<LinkCheckState, { label: string; cls: string; mark: string }> = {
  broken: { label: "Broken", cls: "text-accent", mark: "✕" },
  "server-error": { label: "Server error", cls: "text-accent", mark: "✕" },
  unreachable: { label: "Unreachable", cls: "text-foreground/70", mark: "!" },
  blocked: { label: "Couldn't verify (blocks robots)", cls: "text-faint", mark: "?" },
  ok: { label: "OK", cls: "text-foreground/50", mark: "✓" },
};

export function BrokenLinkChecker() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<LinkCheckResult | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state === "running") return;
    setState("running");
    setError("");
    try {
      const res = await fetch(`/api/tools/broken-links?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed. Try again.");
      setResult(data as LinkCheckResult);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check failed. Try again.");
      setState("error");
    }
  };

  const broken = result?.checked.filter((l) => l.state === "broken" || l.state === "server-error") ?? [];
  const rest = result?.checked.filter((l) => l.state !== "broken" && l.state !== "server-error" && l.state !== "ok") ?? [];
  const okCount = result?.checked.filter((l) => l.state === "ok").length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          placeholder="yourwebsite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Page to check for broken links"
          className={inputCls}
        />
        <button
          type="submit"
          disabled={state === "running"}
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-accent bg-accent px-7 py-3.5 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "running" ? "Checking links…" : "Find broken links"}
        </button>
      </form>
      {state === "running" && (
        <p className="text-sm text-muted">
          Fetching the page and testing every link on it — up to 40, this can
          take half a minute…
        </p>
      )}
      {state === "error" && <p className="text-sm text-accent">{error}</p>}

      {state === "done" && result && (
        <div className="ink relative p-7 sm:p-8">
          <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
            <p className="font-display text-3xl uppercase sm:text-4xl">
              {broken.length === 0 ? "No broken links found" : `${broken.length} broken link${broken.length > 1 ? "s" : ""}`}
            </p>
            <p className="font-mono text-sm text-foreground/80">
              {result.checked.length} checked · {okCount} OK
            </p>
          </div>

          {broken.length > 0 && (
            <ul className="mt-6 flex flex-col gap-4">
              {broken.map((l) => (
                <li key={l.url} className="flex gap-4">
                  <span aria-hidden className={`font-mono text-lg leading-6 ${STATE_META[l.state].cls}`}>
                    {STATE_META[l.state].mark}
                  </span>
                  <div className="min-w-0">
                    <p className="break-all font-mono text-xs leading-relaxed text-foreground/90">{l.url}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {l.text ? `Linked as "${l.text}" — ` : ""}
                      HTTP {l.status} · {STATE_META[l.state].label}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {rest.length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="annotation mb-3">Could not be verified</p>
              <ul className="flex flex-col gap-2">
                {rest.map((l) => (
                  <li key={l.url} className="flex gap-3">
                    <span aria-hidden className={`font-mono ${STATE_META[l.state].cls}`}>{STATE_META[l.state].mark}</span>
                    <p className="min-w-0 break-all font-mono text-xs leading-relaxed text-muted">
                      {l.url}{" "}
                      <span className="text-faint">— {STATE_META[l.state].label.toLowerCase()}</span>
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-faint">
                Some sites answer robots with 403/429 regardless of whether the
                page exists. Reporting those as &ldquo;broken&rdquo; would be a
                false claim, so they are listed separately — check them by hand.
              </p>
            </div>
          )}

          {result.capped && (
            <p className="mt-5 text-xs text-muted">
              The page has {result.totalFound} unique links; the first 40 were
              checked.
            </p>
          )}

          <div className="mt-6 border-t border-line pt-5">
            <p className="text-sm leading-relaxed text-muted">
              {broken.length > 0
                ? "Broken links lose visitors at the exact moment they were interested, and waste the crawl budget Google gives a site. Fixing them is routine maintenance —"
                : "Links rot over time as pages move and businesses close — worth re-checking every few months. For everything else that quietly breaks,"}{" "}
              <Link href="/services/website-maintenance" className="u-draw text-accent">
                that&apos;s what the maintenance service is for
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
