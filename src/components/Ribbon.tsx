"use client";

import { useEffect, useRef } from "react";

/**
 * The turning ribbon behind every page: a thick ring with a gap — a letter's
 * worth of arc — drawn as a tube in space, shaded by depth, lit along its
 * crown, coloured through the spectrum along its length, and turning slowly
 * on two axes. Plain 2D canvas at half resolution; the blur is CSS. Stops
 * when hidden; under reduced motion it draws one frame.
 */
export function Ribbon({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, on = true;
    const size = () => {
      w = Math.max(2, Math.round(c.clientWidth * 0.5));
      h = Math.max(2, Math.round(c.clientHeight * 0.5));
      c.width = w;
      c.height = h;
    };
    const N = 170;
    const SWEEP = Math.PI * 1.62; // the gap is the rest
    const draw = (t: number) => {
      const R = Math.min(w, h) * 0.44;
      const tube = R * 0.46;
      const f = R * 4.2;
      const ry = t * 0.00031, rx = 0.42 + Math.sin(t * 0.00019) * 0.22, rz = Math.sin(t * 0.00013) * 0.25;
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx), cz = Math.cos(rz), sz = Math.sin(rz);
      const pts: { x: number; y: number; z: number; s: number; a: number }[] = [];
      for (let i = 0; i <= N; i++) {
        const a = -SWEEP / 2 + (i / N) * SWEEP + Math.PI * 0.15;
        let x = R * Math.cos(a), y = R * Math.sin(a), z = 0;
        // rotate: around y, then x, then z
        const x1 = x * cy + z * sy;
        let z1 = -x * sy + z * cy;
        const y1 = y * cx - z1 * sx;
        z1 = y * sx + z1 * cx;
        x = x1 * cz - y1 * sz; y = x1 * sz + y1 * cz; z = z1;
        const s = f / (f + z);
        pts.push({ x: w / 2 + x * s, y: h / 2 + y * s, z, s, a });
      }
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // back to front, so the near part of the ring covers the far part
      const order = pts.slice(0, -1).map((_, i) => i).sort((i, j) => pts[j].z - pts[i].z);
      for (const i of order) {
        const p = pts[i], q = pts[i + 1];
        const depth = (p.z / R + 1) / 2; // 0 far … 1 near
        const hue = ((p.a / (Math.PI * 2)) * 360 + t * 0.012 + 200) % 360;
        const light = 38 + depth * 24;
        ctx.strokeStyle = `hsl(${hue} 95% ${light}%)`;
        ctx.lineWidth = tube * p.s;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
        // the crown highlight: a thinner, paler stroke set a little above the centre line
        ctx.strokeStyle = `hsla(${hue} 100% ${72 + depth * 16}% / ${0.28 + depth * 0.3})`;
        ctx.lineWidth = tube * p.s * 0.34;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - tube * p.s * 0.22);
        ctx.lineTo(q.x, q.y - tube * q.s * 0.22);
        ctx.stroke();
      }
    };
    const loop = (t: number) => {
      if (on) draw(t);
      raf = requestAnimationFrame(loop);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting));
    io.observe(c);
    const vis = () => (on = !document.hidden);
    document.addEventListener("visibilitychange", vis);
    if (reduce) draw(4000);
    else raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
