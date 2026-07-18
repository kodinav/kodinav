"use client";

import { useEffect } from "react";
import Lenis from "lenis";

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

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
