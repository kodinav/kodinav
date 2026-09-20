"use client";

import { useEffect } from "react";

/**
 * Buttery, momentum-based scrolling for the marketing site — the quiet polish
 * layer behind the scroll-driven reveals. Renders nothing.
 *
 * Guarded to desktop pointer devices and disabled entirely under
 * prefers-reduced-motion, so touch scrolling and accessibility are untouched.
 * The mobile menu's `overflow:hidden` on <html> still stops the page cold.
 */
export function SmoothScroll() {
  useEffect(() => {
    const okPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!okPointer.matches || reduce.matches) return;

    // Imported lazily: it is polish, not content, so it must never sit in the
    // critical path or in the homepage's first-load JavaScript.
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}
