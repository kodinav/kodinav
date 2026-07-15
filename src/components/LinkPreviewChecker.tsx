"use client";

import { useState } from "react";
import Link from "next/link";
import { type LinkPreview } from "@/lib/auditTypes";

/**
 * Link preview checker — renders the shared-card and search-snippet a link
 * actually produces, from the same tags the platforms read.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

export function LinkPreviewChecker() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [data, setData] = useState<LinkPreview | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || state === "running") return;
    setState("running");
    setError("");
    try {
      const res = await fetch(`/api/tools/link-preview?url=${encodeURIComponent(url.trim())}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Check failed. Try again.");
      setData(body as LinkPreview);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check failed. Try again.");
      setState("error");
    }
  };

  const cardTitle = data?.ogTitle ?? data?.title ?? data?.finalUrl ?? "";
  const cardDesc = data?.ogDescription ?? data?.description ?? "";
  const host = data ? new URL(data.finalUrl).hostname : "";
  const criticals = data?.issues.filter((i) => i.severity === "critical") ?? [];

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          placeholder="yourwebsite.com/page-you-share"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Link to check"
          className={inputCls}
        />
        <button
          type="submit"
          disabled={state === "running"}
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-accent bg-accent px-7 py-3.5 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "running" ? "Checking…" : "Check preview"}
        </button>
      </form>

      {state === "error" && <p className="text-sm text-accent">{error}</p>}

      {state === "done" && data && (
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* How the share card renders */}
          <div>
            <p className="annotation mb-4">How it shares — WhatsApp, LinkedIn, iMessage</p>
            <div className="max-w-sm border border-line-strong bg-surface-raised">
              {data.ogImage && (!data.image || data.image.status < 400) ? (
                /* eslint-disable-next-line @next/next/no-img-element -- rendering the page's own og:image exactly as platforms do */
                <img
                  src={data.ogImage}
                  alt="The og:image this link shares with"
                  className="aspect-[1.91/1] w-full border-b border-line object-cover"
                />
              ) : (
                <div className="flex aspect-[1.91/1] w-full items-center justify-center border-b border-line">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                    No image
                  </span>
                </div>
              )}
              <div className="p-4">
                <p className="truncate text-sm font-medium">{cardTitle}</p>
                {cardDesc && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{cardDesc}</p>
                )}
                <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                  {host}
                </p>
              </div>
            </div>

            <p className="annotation mt-8 mb-4">How it looks on Google</p>
            <div className="max-w-md border border-line p-4">
              <p className="font-mono text-[0.625rem] tracking-wide text-faint">{data.finalUrl}</p>
              <p className="mt-1 text-base text-foreground">
                {data.title ?? <span className="text-faint">(no title tag)</span>}
              </p>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                {data.description ?? (
                  <span className="text-faint">
                    (no meta description — Google improvises one from the page)
                  </span>
                )}
              </p>
              {data.title && data.title.length > 60 && (
                <p className="mt-2 text-xs text-muted">
                  Title is {data.title.length} characters — Google truncates around 60.
                </p>
              )}
            </div>
          </div>

          {/* Findings */}
          <div className="ink relative h-fit p-7 sm:p-8">
            <div
              aria-hidden
              className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background"
            />
            <p className="annotation mb-5">
              {data.issues.length === 0
                ? "Verdict: shares cleanly"
                : `${data.issues.length} thing${data.issues.length > 1 ? "s" : ""} to fix`}
            </p>
            {data.issues.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted">
                Title, description, image and card tags are all in place. If a
                platform still shows an old preview, it cached the link —
                share it with <span className="font-mono text-xs">?v=2</span>{" "}
                appended to force a fresh look.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {data.issues.map((iss, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      aria-hidden
                      className={`font-mono text-lg leading-6 ${
                        iss.severity === "critical" ? "text-accent" : "text-foreground/70"
                      }`}
                    >
                      {iss.severity === "critical" ? "✕" : "!"}
                    </span>
                    <div>
                      <p className="text-sm leading-relaxed">{iss.text}</p>
                      <p className="mt-1 text-sm leading-relaxed text-faint">Fix: {iss.fix}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 border-t border-line pt-6">
              <p className="text-sm leading-relaxed text-muted">
                {criticals.length > 0
                  ? "Every share with a broken preview is a first impression lost. These fixes are small, and they are part of any site this studio builds or repairs."
                  : "Previews are one detail of many. See how the whole site holds up:"}
              </p>
              <Link
                href="/free-website-audit"
                className="u-draw mt-3 inline-block font-mono text-xs uppercase tracking-[0.18em] text-accent"
              >
                Run the full free website audit →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
