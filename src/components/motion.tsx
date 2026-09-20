"use client";

import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * Scroll reveals are TRANSFORM-ONLY by design: content is never hidden behind
 * opacity. Fast flick-scrolling on phones can outrun IntersectionObserver and
 * leave reveals un-fired — with opacity that meant permanently blank
 * sections; with transform-only the worst case is a 24px offset nobody
 * notices. (Same principle as the CSS hero reveal / LCP fix.)
 *
 * v5: these run on CSS transitions + IntersectionObserver instead of
 * framer-motion. The public API is unchanged, so every page keeps working;
 * the homepage just stops shipping a motion library to do a 28px slide.
 * The transitions live in globals.css under "Motion".
 */

function useInView<T extends HTMLElement>(margin = "-80px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.setAttribute("data-in", "");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.setAttribute("data-in", "");
            io.disconnect();
          }
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return ref;
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li";
}) {
  const ref = useInView<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      "data-reveal": "",
      className,
      style: { "--y": `${y}px`, "--delay": `${delay}s` } as CSSProperties,
    },
    children
  );
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useInView<HTMLDivElement>("-60px");
  // Each item's delay is its index; measured from the DOM so StaggerItem
  // needs no index prop and can sit anywhere inside the wrapper.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>("[data-stagger-item]").forEach((item, i) => {
      item.style.setProperty("--i", String(i));
    });
  }, [ref]);
  return (
    <div ref={ref} data-stagger="" className={className}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-stagger-item="" className={className}>
      {children}
    </div>
  );
}

/** Animated number that counts up when scrolled into view. */
export function Counter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finish = () => {
      el.textContent = `${value}${suffix}`;
    };
    // Reduced motion (or no observer): show the true value at rest, never a
    // stuck "0".
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      finish();
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const duration = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${Math.round(value * eased)}${suffix}`;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "-40px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

/**
 * Magnetic — a subtle pull toward the cursor for a primary CTA. Eases back
 * on leave via a CSS transition (see .magnetic). Disabled under
 * reduced-motion. Renders identically on server and client.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      className={`magnetic inline-flex ${className}`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </span>
  );
}
