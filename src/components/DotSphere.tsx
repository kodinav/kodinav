"use client";

import { useEffect, useRef } from "react";

/**
 * A sphere of points, turning slowly and leaning toward the pointer: the one
 * piece of motion in the hero. Plain 2D canvas, a few hundred points, no
 * library; it stops when off screen and under reduced motion draws once.
 */
export function DotSphere({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = 900;
    const pts: [number, number, number][] = [];
    for (let i = 0; i < N; i++) {
      // a Fibonacci sphere: evenly spread, no clumps at the poles
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = i * 2.399963;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }
    let w = 0, h = 0, dpr = 1, raf = 0, on = true;
    let ax = 0.4, ay = 0, tx = 0.4, ty = 0;
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    };
    const ink = () => getComputedStyle(c).color;
    const draw = (t: number) => {
      ax += (tx - ax) * 0.04;
      ay += (ty + t * 0.00012 - ay) * 0.04;
      const R = Math.min(w, h) * 0.47;
      const cx = w / 2, cy = h / 2;
      const ca = Math.cos(ax), sa = Math.sin(ax), cb = Math.cos(ay), sb = Math.sin(ay);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ink();
      for (const [x0, y0, z0] of pts) {
        const x1 = x0 * cb + z0 * sb, z1 = -x0 * sb + z0 * cb;
        const y1 = y0 * ca - z1 * sa, z2 = y0 * sa + z1 * ca;
        const p = 1 / (1.9 - z2 * 0.7);
        const s = (0.7 + (z2 + 1) * 1.15) * p;
        ctx.globalAlpha = 0.22 + (z2 + 1) * 0.39;
        ctx.beginPath();
        ctx.arc(cx + x1 * R * p, cy + y1 * R * p, s, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => {
      if (on) draw(t);
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      tx = 0.4 - ((e.clientY / window.innerHeight) * 2 - 1) * 0.35;
      ty = ((e.clientX / window.innerWidth) * 2 - 1) * 0.5;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting));
    io.observe(c);
    if (reduce) draw(0);
    else {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
