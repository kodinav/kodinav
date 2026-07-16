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

type Platform = "whatsapp" | "linkedin" | "x" | "google";
const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X" },
  { id: "google", label: "Google" },
];

export function LinkPreviewChecker() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [data, setData] = useState<LinkPreview | null>(null);
  const [platform, setPlatform] = useState<Platform>("whatsapp");

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
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-accent bg-accent px-7 py-3.5 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "running" ? "Checking…" : "Check preview"}
        </button>
      </form>

      {state === "error" && <p className="text-sm text-accent">{error}</p>}

      {state === "done" && data && (
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Per-platform previews */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={platform === p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`border px-3.5 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-colors ${
                    platform === p.id
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {(() => {
              const imgOk = data.ogImage && (!data.image || data.image.status < 400);
              const img = imgOk ? (
                /* eslint-disable-next-line @next/next/no-img-element -- rendering the page's own og:image exactly as platforms do */
                <img
                  src={data.ogImage!}
                  alt="The og:image this link shares with"
                  className="aspect-[1.91/1] w-full border-b border-line object-cover"
                />
              ) : (
                <div className="flex aspect-[1.91/1] w-full items-center justify-center border-b border-line">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">No image</span>
                </div>
              );

              if (platform === "google") {
                return (
                  <div className="max-w-md border border-line p-4">
                    <p className="font-mono text-[0.625rem] tracking-wide text-faint">{data.finalUrl}</p>
                    <p className="mt-1 text-base text-foreground">
                      {data.title ?? <span className="text-faint">(no title tag)</span>}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                      {data.description ?? (
                        <span className="text-faint">(no meta description — Google improvises one from the page)</span>
                      )}
                    </p>
                    {data.title && data.title.length > 60 && (
                      <p className="mt-2 text-xs text-accent">
                        Title is {data.title.length} characters — Google truncates around 60.
                      </p>
                    )}
                    {data.description && data.description.length > 160 && (
                      <p className="mt-1 text-xs text-accent">
                        Description is {data.description.length} characters — truncates around 160.
                      </p>
                    )}
                  </div>
                );
              }

              if (platform === "x") {
                const large = data.twitterCard?.toLowerCase() === "summary_large_image";
                return (
                  <div>
                    <div className="max-w-sm overflow-hidden rounded-2xl border border-line-strong bg-surface-raised">
                      {large || !data.twitterCard ? (
                        <>
                          {img}
                          <div className="p-3">
                            <p className="font-mono text-[0.625rem] text-faint">{host}</p>
                            <p className="truncate text-sm">{cardTitle}</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex">
                          <div className="flex size-24 shrink-0 items-center justify-center border-r border-line">
                            <span className="font-mono text-[0.5rem] uppercase text-faint">img</span>
                          </div>
                          <div className="min-w-0 p-3">
                            <p className="font-mono text-[0.625rem] text-faint">{host}</p>
                            <p className="truncate text-sm">{cardTitle}</p>
                            <p className="line-clamp-1 text-xs text-muted">{cardDesc}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {!large && (
                      <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted">
                        {data.twitterCard
                          ? `twitter:card is "${data.twitterCard}" — X shows the small square card above instead of the full-width image.`
                          : "No twitter:card tag — X defaults to the large card, but declaring summary_large_image makes it explicit."}
                      </p>
                    )}
                  </div>
                );
              }

              if (platform === "linkedin") {
                return (
                  <div className="max-w-sm border border-line-strong bg-surface-raised">
                    {img}
                    <div className="p-4">
                      <p className="truncate text-sm font-semibold">{cardTitle}</p>
                      <p className="mt-1.5 font-mono text-[0.625rem] tracking-wide text-faint">{host}</p>
                    </div>
                    <p className="border-t border-line px-4 py-2 text-[0.625rem] leading-relaxed text-faint">
                      LinkedIn usually shows only image + title + domain — the description is often dropped.
                    </p>
                  </div>
                );
              }

              // WhatsApp
              return (
                <div className="max-w-sm rounded-lg border border-line-strong bg-surface-raised p-1.5">
                  <div className="overflow-hidden rounded-md bg-background/60">
                    {img}
                    <div className="p-3">
                      <p className="truncate text-sm font-medium">{cardTitle}</p>
                      {cardDesc && <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">{cardDesc}</p>}
                      <p className="mt-1 font-mono text-[0.625rem] lowercase text-faint">{host}</p>
                    </div>
                  </div>
                  <p className="break-all px-2 pt-1.5 pb-0.5 text-xs text-[#4a7fb5] underline decoration-[#4a7fb5]/40">
                    {data.finalUrl}
                  </p>
                </div>
              );
            })()}
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
                className="u-draw mt-3 inline-block font-mono text-xs uppercase tracking-[0.14em] text-accent"
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
