"use client";

import { useEffect } from "react";

/**
 * Brings the hero to life once JavaScript is running — and only then, so the
 * server HTML is complete and still for crawlers and no-JS readers:
 *
 *   · marks the hero `is-live`, which starts the load choreography in CSS
 *     (lines rising, the rule drawing, the cards drifting in);
 *   · follows the pointer, feeding --mx/--my to the hero and the backdrop so
 *     the floating cards, the spotlight and the colour ribbon lean with it;
 *   · follows the scroll, feeding --sy so the hero recedes as the page moves.
 *
 * Under reduced motion it does nothing beyond the class.
 */
export function HeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const aurora = document.querySelector<HTMLElement>(".aurora");
    if (!hero) return;
    const live = () => hero.classList.add("is-live");
    const t = window.setTimeout(() => {
      if (document.documentElement.classList.contains("intro-on")) window.addEventListener("kd:intro-done", live, { once: true });
      else live();
    }, 30);
    // the page turns light as the services band comes up, and back after
    const band = document.querySelector(".band");
    const io = band
      ? new IntersectionObserver(([e]) => document.documentElement.classList.toggle("is-light", e.isIntersecting), { rootMargin: "-30% 0px -30% 0px" })
      : null;
    if (band && io) io.observe(band);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return () => {
        clearTimeout(t);
        io?.disconnect();
      };
    let mx = 0, my = 0, tx = 0, ty = 0, sy = 0, raf = 0;
    const tick = () => {
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      const set = (el: HTMLElement | null) => {
        if (!el) return;
        el.style.setProperty("--mx", mx.toFixed(3));
        el.style.setProperty("--my", my.toFixed(3));
      };
      set(hero);
      set(aurora);
      hero.style.setProperty("--sy", String(sy));
      raf = Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    };
    const onScroll = () => {
      sy = Math.min(900, window.scrollY);
      hero.style.setProperty("--sy", String(sy));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      clearTimeout(t);
      io?.disconnect();
      window.removeEventListener("kd:intro-done", live);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}
