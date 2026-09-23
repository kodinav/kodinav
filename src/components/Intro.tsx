"use client";

import { useEffect, useState } from "react";

/**
 * The opening: on a dark field, a cloud of coloured particles gathers into the
 * K of the mark, holds for a moment, and the page comes through it. Plays once
 * per visit, never under reduced motion, and only after the page itself has
 * rendered (so crawlers, no-JS readers and the first paint are untouched).
 * When it finishes it tells the hero to begin (see HeroMotion).
 */
export function Intro() {
  const [on, setOn] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // decided after the first paint, so the server HTML is never held back
    const id = window.setTimeout(() => {
      let seen = false;
      try {
        seen = sessionStorage.getItem("kd-intro") === "1";
      } catch {}
      if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      document.documentElement.classList.add("intro-on");
      setOn(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!on) return;
    const c = document.getElementById("intro-canvas") as HTMLCanvasElement | null;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = (c.width = Math.round(innerWidth * dpr));
    const h = (c.height = Math.round(innerHeight * dpr));
    // the letter, sampled from an offscreen drawing in the site's own serif
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const o = off.getContext("2d")!;
    const fam = getComputedStyle(document.querySelector("h1") ?? document.body).fontFamily;
    const size = Math.min(w, h) * 0.62;
    o.font = `400 ${size}px ${fam}`;
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillStyle = "#fff";
    o.fillText("K", w / 2, h / 2 + size * 0.04);
    const img = o.getImageData(0, 0, w, h).data;
    const step = Math.max(3, Math.round(4 * dpr));
    const targets: [number, number][] = [];
    for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (img[(y * w + x) * 4 + 3] > 128) targets.push([x, y]);
    const N = Math.min(window.innerWidth < 768 ? 700 : 1500, targets.length);
    const pick = targets.sort(() => Math.random() - 0.5).slice(0, N);
    const R = Math.max(w, h) * 0.7;
    const P = pick.map(([tx, ty]) => {
      const a = Math.random() * Math.PI * 2, r = R * (0.5 + Math.random() * 0.6);
      const hue = ((Math.atan2(ty - h / 2, tx - w / 2) / Math.PI) * 180 + 360 + 200) % 360;
      return { sx: w / 2 + Math.cos(a) * r, sy: h / 2 + Math.sin(a) * r, tx, ty, d: Math.random() * 0.5, hue, s: (1 + Math.random() * 1.6) * dpr };
    });
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const t0 = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "rgba(8,8,8,0.35)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of P) {
        const k = ease(Math.min(1, Math.max(0, (t - 0.25 - p.d) / 1.5)));
        const x = p.sx + (p.tx - p.sx) * k + Math.sin(now * 0.004 + p.hue) * (1 - k) * 12;
        const y = p.sy + (p.ty - p.sy) * k + Math.cos(now * 0.003 + p.hue) * (1 - k) * 12;
        const glow = 0.35 + 0.65 * k;
        ctx.fillStyle = `hsla(${(p.hue + t * 40) % 360}, 90%, ${55 + 15 * k}%, ${glow})`;
        ctx.beginPath();
        ctx.arc(x, y, p.s, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      // the letter itself resolves out of the cloud
      const kk = Math.min(1, Math.max(0, (t - 1.9) / 0.6));
      if (kk > 0) {
        const g = ctx.createLinearGradient(w * 0.3, h * 0.2, w * 0.7, h * 0.8);
        ["#ff3fb0", "#8a3fe0", "#3b7bff", "#2fd1c0", "#ffd23c", "#ff7a2f"].forEach((col, i, arr) => g.addColorStop(i / (arr.length - 1), col));
        ctx.globalAlpha = kk;
        ctx.font = o.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = g;
        ctx.fillText("K", w / 2, h / 2 + size * 0.04);
        ctx.globalAlpha = 1;
      }
      if (t < 3.0) raf = requestAnimationFrame(draw);
      else {
        setFade(true);
        try {
          sessionStorage.setItem("kd-intro", "1");
        } catch {}
        // the hero's own choreography starts as the field begins to lift
        document.documentElement.classList.remove("intro-on");
        window.dispatchEvent(new Event("kd:intro-done"));
        window.setTimeout(() => setOn(false), 750);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  if (!on) return null;
  return (
    <div className={`opening ${fade ? "is-out" : ""}`} aria-hidden>
      <canvas id="intro-canvas" />
    </div>
  );
}
