"use client";

import { useEffect } from "react";

/**
 * Anything marked `data-reveal` rises into view once, when it first scrolls
 * onto the screen (see globals.css). Nothing is hidden from crawlers or from
 * people without JavaScript: the attribute only ever adds motion.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add("in"); // already on screen: no wait
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
