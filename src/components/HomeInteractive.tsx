"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** The stacked, coloured service rows: one open at a time, the rest folded to a title. */
export function ServiceStack({
  items,
}: {
  items: { slug: string; name: string; short: string; color: string; n: number }[];
}) {
  const [open, setOpen] = useState(-1);
  return (
    <ul className="stack">
      {items.map((s, i) => (
        <li key={s.slug} className={i === open ? "is-open" : ""} style={{ background: s.color }}>
          <button type="button" aria-expanded={i === open} aria-controls={`svc-${s.slug}`} onClick={() => setOpen(i === open ? -1 : i)}>
            <span className="stack-n">{String(s.n).padStart(2, "0")}</span>
            <span className="stack-t">{s.name}</span>
            <span className="stack-plus" aria-hidden />
          </button>
          <div id={`svc-${s.slug}`} className="stack-body">
            <div>
              <p>{s.short}</p>
              <Link href={`/services/${s.slug}`} className="stack-link" prefetch={false}>
                Learn more <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The questions, one at a time in large serif, with arrows. Every answer is in the HTML. */
export function QuoteCarousel({ items, badges = [] }: { items: { q: string; a: string }[]; badges?: string[] }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);
  return (
    <div className="quotes">
      <div className="quotes-badges" aria-hidden>
        {badges.slice(0, 3).map((b) => (
          <span key={b} className="quotes-badge" title={b}>
            {b
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </span>
        ))}
      </div>
      <div className="quotes-view">
      <ol className="quotes-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {items.map((it, k) => (
          <li key={it.q} aria-hidden={k !== i} inert={k !== i}>
            <p className="quotes-q">{it.q}</p>
            <p className="quotes-a">{it.a}</p>
          </li>
        ))}
      </ol>
      </div>
      <div className="quotes-nav">
        <button type="button" onClick={() => go(-1)} aria-label="Previous question">
          ↑
        </button>
        <span className="annotation">
          {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button type="button" onClick={() => go(1)} aria-label="Next question">
          ↓
        </button>
      </div>
    </div>
  );
}

/** A figure that is already right in the HTML, and counts up from nothing when it comes into view. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / 1600);
          el.textContent = `${Math.round(value * (1 - Math.pow(1 - k, 3)))}${suffix}`;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, suffix]);
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
