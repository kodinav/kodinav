"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * A condensed, signature view of the nine-step process as an engineering
 * pipeline: five phases on a connector line with a slow cobalt pulse
 * travelling along it. The full nine steps live on /process.
 */

const phases = [
  {
    no: "01",
    title: "Discover",
    body: "Understand the business and define what success actually looks like.",
  },
  {
    no: "02",
    title: "Design",
    body: "Real screens for your real users, reviewed before a line is built.",
  },
  {
    no: "03",
    title: "Architect",
    body: "Data, infrastructure and scale decided deliberately, not by accident.",
  },
  {
    no: "04",
    title: "Build",
    body: "Shipped in usable slices, so value arrives in weeks, not months.",
  },
  {
    no: "05",
    title: "Support",
    body: "Launch, monitoring and a support period. You own every line of it.",
  },
];

export function ProcessDiagram() {
  return (
    <div className="relative">
      {/* connector — horizontal on desktop */}
      <svg
        aria-hidden
        className="absolute top-[7px] right-0 left-0 hidden h-1 w-full lg:block"
        viewBox="0 0 1000 2"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="1" x2="1000" y2="1" stroke="var(--border-strong)" strokeWidth="1" />
        <line
          x1="0"
          y1="1"
          x2="1000"
          y2="1"
          stroke="var(--accent)"
          strokeWidth="1.5"
          className="diagram-flow"
        />
      </svg>

      <ol className="grid gap-y-10 lg:grid-cols-5 lg:gap-x-6">
        {phases.map((p, i) => (
          <motion.li
            key={p.no}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex gap-4 lg:flex-col lg:gap-0"
          >
            {/* node marker */}
            <div className="relative flex flex-col items-center lg:mb-6 lg:items-start">
              <span className="relative z-10 block size-3.5 rotate-45 border border-accent bg-background transition-colors duration-300 group-hover:bg-accent" />
              {/* vertical connector on mobile */}
              {i < phases.length - 1 && (
                <span
                  aria-hidden
                  className="mt-1 w-px flex-1 bg-line-strong lg:hidden"
                />
              )}
            </div>
            <div className="pb-2 lg:pr-4">
              <span className="annotation">Phase {p.no}</span>
              <h3 className="mt-2 font-display text-xl tracking-tight text-foreground sm:text-2xl">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="mt-12 flex items-center gap-4 border-t border-line pt-6">
        <Link
          href="/process"
          className="u-draw group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-foreground"
        >
          See the full nine-step process
          <span aria-hidden className="text-accent transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
        <span className="annotation hidden sm:inline">Written scopes · Fixed quotes · No surprises</span>
      </div>
    </div>
  );
}
