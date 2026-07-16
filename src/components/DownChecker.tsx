"use client";

import { useState } from "react";
import Link from "next/link";

/** "Down for everyone, or just me?" — answered by a fetch from this server. */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

type DownResult = {
  up: boolean;
  status: number | null;
  finalUrl: string | null;
  ms: number | null;
  reason?: string;
};

export function DownChecker() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<DownResult | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state === "running") return;
    setState("running");
    setError("");
    try {
      const res = await fetch(`/api/tools/down?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check failed. Try again.");
      setResult(data as DownResult);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check failed. Try again.");
      setState("error");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          placeholder="yourwebsite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Website to check"
          className={inputCls}
        />
        <button
          type="submit"
          disabled={state === "running"}
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-accent bg-accent px-7 py-3.5 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "running" ? "Checking…" : "Check it"}
        </button>
      </form>

      {state === "error" && <p className="text-sm text-accent">{error}</p>}

      {state === "done" && result && (
        <div className="ink relative p-7 sm:p-8">
          <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
 <p className="font-display text-4xl sm:text-5xl">
            {result.up ? (
              <>It&apos;s up — it&apos;s probably just you</>
            ) : result.status ? (
              <>Reachable, but answering HTTP {result.status}</>
            ) : (
              <>It&apos;s down for us too</>
            )}
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm leading-relaxed text-muted">
            {result.up && (
              <>
                <p>
                  Our server reached{" "}
                  <span className="break-all font-mono text-xs text-foreground/90">{result.finalUrl}</span>{" "}
                  and got HTTP {result.status} in {result.ms} ms.
                </p>
                <p>
                  If it fails on your device: try another network (switch off
                  Wi-Fi), clear the browser cache, or flush your DNS. If it
                  fails only on your office network, the block is local.
                </p>
              </>
            )}
            {!result.up && result.status !== null && (
              <p>
                The server is alive but returning an error — usually a crashed
                application, an expired certificate, or a misconfigured deploy.
                That is a fix-it-now problem: every visitor is seeing it.
              </p>
            )}
            {!result.up && result.status === null && (
              <>
                {result.reason && <p>{result.reason}</p>}
                <p>
                  Common causes, in order of likelihood: hosting outage,
                  expired domain, DNS misconfiguration, or an expired SSL
                  certificate. Your hosting provider&apos;s status page is the
                  first place to look.
                </p>
              </>
            )}
          </div>
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-sm leading-relaxed text-muted">
              {result.up
                ? "While you're here — up is not the same as healthy:"
                : "When it's back, find out what else needs attention:"}{" "}
              <Link href="/free-website-audit" className="u-draw text-accent">
                run the full free audit
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
