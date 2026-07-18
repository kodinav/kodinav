"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { getProject } from "@/data/projects";
import { PulseDot } from "./ui";

/**
 * The hero "instrument" — a real, shipped product screen in an engineered
 * frame that tilts gently toward the cursor, dressed with registration marks
 * and a live tag. Real work, presented like precision hardware. Tilt is
 * disabled under reduced-motion.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const primary = getProject("flaming-logistics") ?? getProject("lighthouse-classes");
  const phone = getProject("philosophy-machine") ?? getProject("kosmo-dental-clinic");

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), {
    stiffness: 150,
    damping: 18,
  });

  if (!primary) return null;

  return (
    <div
      className="relative w-full"
      style={{ perspective: 1200 }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {/* corner register marks */}
      <span aria-hidden className="crosshair absolute -top-3 -left-3 z-20" />
      <span aria-hidden className="crosshair absolute -right-3 -bottom-3 z-20" />

      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* primary desktop frame */}
        <figure
          className="relative overflow-hidden rounded-md border border-line-strong bg-surface-raised shadow-[0_50px_100px_-50px_rgba(22,23,27,0.55)]"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="size-2.5 rounded-full border border-line-strong" />
            <span className="size-2.5 rounded-full border border-line-strong" />
            <span className="size-2.5 rounded-full bg-foreground/20" />
            <span className="mx-auto flex h-5 w-1/2 items-center justify-center rounded-[3px] border border-line font-mono text-[0.5rem] tracking-[0.2em] text-faint uppercase">
              {primary.name}
            </span>
          </div>
          <div className="relative aspect-16/10 w-full">
            <Image
              src={primary.images.cover.src}
              alt={primary.images.cover.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 620px"
              className="object-cover object-top"
            />
          </div>
        </figure>

        {/* secondary phone, overlapping */}
        {phone && (
          <figure
            className="absolute -bottom-8 -left-6 hidden w-28 overflow-hidden rounded-lg border border-line-strong bg-surface-raised p-1.5 shadow-[0_30px_60px_-30px_rgba(22,23,27,0.6)] sm:block sm:w-32"
            style={{ transform: "translateZ(80px)" }}
          >
            <div className="relative aspect-9/19 w-full overflow-hidden rounded-md">
              <Image
                src={phone.images.mobile[0].src}
                alt={phone.images.mobile[0].alt}
                fill
                sizes="140px"
                className="object-cover object-top"
              />
            </div>
          </figure>
        )}

        {/* floating live tag */}
        <div
          className="absolute -top-5 -right-4 flex items-center gap-2 rounded-full border border-line-strong bg-surface-raised px-3.5 py-2 shadow-[0_20px_40px_-24px_rgba(22,23,27,0.5)]"
          style={{ transform: "translateZ(100px)" }}
        >
          <PulseDot />
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-foreground/80">
            Shipped &amp; live
          </span>
        </div>
      </motion.div>
    </div>
  );
}
