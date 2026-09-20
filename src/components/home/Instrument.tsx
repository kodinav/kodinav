"use client";

import { useEffect, useState } from "react";
import { PulseDot } from "../ui";

/**
 * The hero instrument: this page, measured in the visitor's own browser via
 * the Navigation Timing, Resource Timing and PerformanceObserver APIs, plus
 * Google PageSpeed's lab score for the site with the time it was taken.
 *
 * Every row is always rendered at a fixed height and filled in as data
 * arrives, so the panel that reports layout shift never causes any. Where a
 * browser does not expose a metric (Safari has no LCP or layout-shift
 * entries), the row says so instead of inventing a number. Nothing here is
 * sent anywhere.
 */

type Transfer = {
  ttfb: number;
  html: number;
  /** Scripts this page needed to render — everything requested before it hydrated. */
  js: number;
  /** Scripts fetched afterwards: Next.js warming up the pages you might open next. */
  prefetch: number;
  prefetchFiles: number;
  fonts: number;
  images: number;
  total: number;
  thirdParty: number;
  /** Cross-origin requests; their sizes are hidden unless the origin allows timing. */
  thirdPartyCount: number;
  requests: number;
};

type Speed =
  | { ok: true; performance: number; lcpMs: number | null; cls: number | null; measuredAt: number }
  | { ok: false };

function kb(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1048576).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} kB`;
}

function seconds(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`;
}

function ago(ts: number): string {
  const min = Math.round((Date.now() - ts) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

function supports(type: string): boolean {
  return (
    typeof PerformanceObserver !== "undefined" &&
    (PerformanceObserver.supportedEntryTypes ?? []).includes(type)
  );
}

export function Instrument() {
  const [t, setT] = useState<Transfer | null>(null);
  const [lcp, setLcp] = useState<number | null>(null);
  const [cls, setCls] = useState<number | null>(null);
  const [lcpSupported, setLcpSupported] = useState(true);
  const [clsSupported, setClsSupported] = useState(true);
  const [speed, setSpeed] = useState<Speed | null>(null);

  useEffect(() => {
    // Every chunk this page needs is on the wire before React can hydrate it,
    // so scripts that start after this point are route prefetches (Next.js
    // warming up /contact, /work…), not this page's own JavaScript.
    const hydrated = performance.now();

    /* ---- transfer + server timing, once the page has finished loading ---- */
    const read = () => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      if (!nav) return;
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const sum = (f: (r: PerformanceResourceTiming) => boolean) =>
        res.filter(f).reduce((a, r) => a + (r.transferSize || 0), 0);
      const isScript = (r: PerformanceResourceTiming) =>
        r.initiatorType === "script" || /\.js(\?|$)/.test(r.name);
      const js = sum((r) => isScript(r) && r.startTime < hydrated);
      const prefetchList = res.filter((r) => isScript(r) && r.startTime >= hydrated);
      const prefetch = prefetchList.reduce((a, r) => a + (r.transferSize || 0), 0);
      const fonts = sum((r) => /\.(woff2?|ttf|otf)(\?|$)/.test(r.name));
      const images = sum(
        (r) => r.initiatorType === "img" || /\/_next\/image|\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/.test(r.name)
      );
      const isThirdParty = (r: PerformanceResourceTiming) => !r.name.startsWith(location.origin);
      const thirdParty = sum(isThirdParty);
      const thirdPartyCount = res.filter(isThirdParty).length;
      const html = nav.transferSize || 0;
      setT({
        ttfb: Math.max(0, Math.round(nav.responseStart - nav.requestStart)),
        html,
        js,
        prefetch,
        prefetchFiles: prefetchList.length,
        fonts,
        images,
        total: html + res.reduce((a, r) => a + (r.transferSize || 0), 0),
        thirdParty,
        thirdPartyCount,
        requests: res.length + 1,
      });
    };
    let loadTimer = 0;
    const onLoad = () => {
      loadTimer = window.setTimeout(read, 250);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    /* ---- LCP + CLS, buffered so paints before hydration still count ---- */
    const observers: PerformanceObserver[] = [];
    let lcpOk = supports("largest-contentful-paint");
    if (lcpOk) {
      try {
        const o = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) setLcp(Math.round(last.startTime));
        });
        o.observe({ type: "largest-contentful-paint", buffered: true });
        observers.push(o);
      } catch {
        lcpOk = false;
      }
    }

    let shift = 0;
    let clsOk = supports("layout-shift");
    if (clsOk) {
      try {
        const o = new PerformanceObserver((list) => {
          for (const e of list.getEntries() as (PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          })[]) {
            if (!e.hadRecentInput) shift += e.value ?? 0;
          }
          setCls(shift);
        });
        o.observe({ type: "layout-shift", buffered: true });
        observers.push(o);
      } catch {
        clsOk = false;
      }
    }
    // Support is reported from a callback, not the effect body, so the server
    // markup ("measuring…") and the first client render always match.
    const supportTimer = window.setTimeout(() => {
      if (!lcpOk) setLcpSupported(false);
      if (!clsOk) setClsSupported(false);
    }, 0);
    // No shift entries by now means the true reading is 0, not "unknown".
    const clsTimer = window.setTimeout(() => setCls((c) => c ?? 0), 2500);

    /* ---- Google's lab score for this site (cached server-side) ---- */
    fetch("/api/self-speed")
      .then((r) => (r.ok ? r.json() : null))
      .then((s: Speed | null) => setSpeed(s ?? { ok: false }))
      .catch(() => setSpeed({ ok: false }));

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(loadTimer);
      window.clearTimeout(supportTimer);
      window.clearTimeout(clsTimer);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const pending = <span className="text-faint">measuring…</span>;

  const tiles: { label: string; unit: string; value: React.ReactNode }[] = [
    {
      label: "Server response",
      unit: "TTFB",
      value: t ? seconds(t.ttfb) : pending,
    },
    {
      label: "Largest paint",
      unit: "LCP",
      value: !lcpSupported ? (
        <span className="text-faint" title="This browser does not expose LCP">
          n/a here
        </span>
      ) : lcp !== null ? (
        seconds(lcp)
      ) : (
        pending
      ),
    },
    {
      label: "Layout shift",
      unit: "CLS",
      value: !clsSupported ? (
        <span className="text-faint" title="This browser does not expose layout-shift entries">
          n/a here
        </span>
      ) : cls !== null ? (
        cls.toFixed(2)
      ) : (
        pending
      ),
    },
  ];

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "HTML", value: t ? kb(t.html) : pending },
    { label: "JavaScript · this page", value: t ? kb(t.js) : pending },
    {
      label: "Prefetched · next pages",
      value: t ? (t.prefetchFiles ? `${kb(t.prefetch)} · ${t.prefetchFiles} files` : "none yet") : pending,
    },
    { label: "Fonts", value: t ? kb(t.fonts) : pending },
    { label: "Images", value: t ? kb(t.images) : pending },
    {
      // A cross-origin script reports 0 bytes unless its server sends
      // Timing-Allow-Origin, so a count is the honest figure when size is hidden.
      label: "Third-party",
      value: t
        ? t.thirdPartyCount === 0
          ? "none"
          : t.thirdParty > 0
            ? `${kb(t.thirdParty)} · ${t.thirdPartyCount} req`
            : `${t.thirdPartyCount} req · size withheld`
        : pending,
    },
    {
      label: "Total · requests",
      value: t ? `${kb(t.total)} · ${t.requests}` : pending,
    },
  ];

  return (
    <aside
      id="instrument"
      aria-label="Live measurements of this page"
      className="rounded-[2px] border border-line-strong bg-surface-raised text-foreground"
    >
      <header className="flex items-center justify-between gap-4 border-b border-line-strong px-4 py-2.5">
        <p className="spec flex items-center gap-2 text-foreground/80">
          <PulseDot />
          This page, measured in your browser
        </p>
        <p className="spec">Live</p>
      </header>

      <div className="grid grid-cols-3 divide-x divide-line border-b border-line-strong">
        {tiles.map((tile) => (
          <div key={tile.label} className="flex h-[5.75rem] flex-col justify-between px-4 py-3">
            <p className="spec">{tile.label}</p>
            <p className="readout tabular text-[1.35rem] leading-none sm:text-2xl">{tile.value}</p>
            <p className="spec text-faint">{tile.unit}</p>
          </div>
        ))}
      </div>

      <dl className="grid grid-cols-1 gap-y-1.5 px-4 py-3">
        {rows.map((row) => (
          <div key={row.label} className="flex h-5 items-baseline justify-between gap-4">
            <dt className="spec">{row.label}</dt>
            <dd className="readout tabular text-[0.8rem]">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex min-h-11 items-center justify-between gap-4 border-t border-line px-4 py-2">
        <p className="spec">Google PageSpeed · mobile</p>
        <p className="readout tabular text-[0.8rem]">
          {speed === null ? (
            pending
          ) : speed.ok ? (
            <>
              <span className="text-foreground">{speed.performance}</span>
              <span className="text-faint">/100</span>
              {speed.lcpMs !== null && (
                <span className="text-muted"> · LCP {(speed.lcpMs / 1000).toFixed(1)} s</span>
              )}
              <span className="text-faint"> · {ago(speed.measuredAt)}</span>
            </>
          ) : (
            <span className="text-faint" title="Google's lab has no reading right now">
              no reading yet
            </span>
          )}
        </p>
      </div>

      <footer className="border-t border-line px-4 py-2">
        <p className="spec text-faint">
          Navigation & Resource Timing APIs · read once, stored nowhere
        </p>
      </footer>
    </aside>
  );
}
