"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type WorkItem = {
  slug: string;
  name: string;
  industry: string;
  year: string;
  summary: string;
  cover: { src: string; alt: string };
  url?: string;
};

/**
 * The work as a list of rows — name, sector, year — with the project's cover
 * floating beside the pointer as each row is hovered. On a touch screen the
 * cover sits inside the row instead. Every row is a real link, in the HTML.
 */
export function WorkList({ items }: { items: WorkItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.setProperty("--px", `${x.toFixed(1)}px`);
      el.style.setProperty("--py", `${y.toFixed(1)}px`);
      if (Math.abs(tx - x) > 0.2 || Math.abs(ty - y) > 0.2) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className="worklist" onPointerLeave={() => setActive(-1)}>
      <ol>
        {items.map((it, i) => (
          <li key={it.slug} className={i === active ? "is-active" : ""}>
            <Link href={`/work/${it.slug}`} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="name">
                <span className="thumb" aria-hidden>
                  <Image src={it.cover.src} alt="" width={640} height={400} sizes="40vw" />
                </span>
                <h3>{it.name}</h3>
                <span className="sum">{it.summary}</span>
              </span>
              <span className="meta">
                {it.industry}
                <span className="year">{it.year}</span>
              </span>
              <span className="go" aria-hidden>
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="preview" aria-hidden>
        {items.map((it, i) => (
          <Image
            key={it.slug}
            src={it.cover.src}
            alt=""
            width={800}
            height={500}
            sizes="26vw"
            className={i === active ? "is-on" : ""}
            priority={i < 2}
          />
        ))}
      </div>
    </div>
  );
}
