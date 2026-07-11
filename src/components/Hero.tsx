"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "./ui";
import { Stamp } from "./Stamp";

const ease = [0.22, 1, 0.36, 1] as const;

function RevealLine({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const specRows = [
  ["Client", "Your business"],
  ["Stack", "Next.js · Flutter · Postgres"],
  ["Performance", "95+ Lighthouse"],
  ["Ownership", "100% yours"],
  ["Lead", "Abhinav Saxena — Founder"],
];

const marqueeItems = [
  "Websites",
  "Web Apps",
  "Mobile Apps",
  "LMS",
  "CRM",
  "ERP",
  "Dashboards",
  "E-Commerce",
  "AI Integrations",
];

export function Hero() {
  return (
    <section className="bg-noise relative flex min-h-dvh flex-col justify-between overflow-hidden pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-24">
      <div aria-hidden className="bg-grid absolute inset-0" />

      <div className="relative mx-auto w-full max-w-7xl flex-1 px-5 sm:px-8">
        {/* annotations row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-b border-line py-4"
        >
          <p className="annotation">Est. 2024 — India</p>
          <p className="annotation hidden sm:block">Independent Software Studio</p>
          <p className="annotation flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-60" />
              <span className="relative inline-flex size-1.5 bg-accent" />
            </span>
            Taking new projects
          </p>
        </motion.div>

        {/* poster headline */}
        <h1 className="relative mt-8 text-[clamp(2.9rem,8.2vw,7.75rem)] leading-[0.94] sm:mt-12">
          <RevealLine delay={0.15}>We build software</RevealLine>
          <RevealLine delay={0.25}>
            that helps businesses{" "}
            <span className="text-gradient">grow.</span>
          </RevealLine>
        </h1>

        {/* stamp — overlaps the headline block on desktop */}
        <motion.div
          initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.9, ease }}
          className="absolute top-20 right-6 hidden text-foreground lg:block"
        >
          <Stamp size={130} />
        </motion.div>

        {/* dimension line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.7, ease }}
          className="mt-10 hidden origin-left items-center gap-3 sm:flex"
          aria-hidden
        >
          <span className="h-3 w-px bg-line-strong" />
          <span className="h-px flex-1 bg-line-strong" />
          <span className="annotation shrink-0 text-foreground/60">
            from discovery — to deployment — to support
          </span>
          <span className="h-px flex-1 bg-line-strong" />
          <span className="h-3 w-px bg-line-strong" />
        </motion.div>

        {/* sub row: copy + CTAs | spec sheet */}
        <div className="mt-10 grid gap-10 pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="flex max-w-xl flex-col items-start gap-8"
          >
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Custom websites, web applications and mobile apps — engineered
              with performance, scalability and long-term business growth in
              mind. Every project personally led by the founder.
            </p>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <ButtonLink href="/contact" size="lg" className="w-full sm:w-auto">
                Book Discovery Call
              </ButtonLink>
              <ButtonLink
                href="/work"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explore Projects
              </ButtonLink>
            </div>
          </motion.div>

          {/* spec sheet card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease }}
            className="ink relative self-start p-5 max-sm:w-full sm:p-6"
          >
            <div
              aria-hidden
              className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background"
            />
            <div className="mb-4 flex items-center justify-between gap-8 border-b border-line pb-3">
              <p className="annotation text-foreground/80">Spec Sheet</p>
              <p className="annotation">No. 001</p>
            </div>
            <dl className="flex flex-col gap-2.5">
              {specRows.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6">
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                    {k}
                  </dt>
                  <dd className="text-right font-mono text-xs text-foreground/90">
                    {v}
                  </dd>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between gap-6 border-t border-line pt-3">
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                  Status
                </dt>
                <dd className="flex items-center gap-2 font-mono text-xs text-accent">
                  Accepting briefs
                  <span className="animate-blink inline-block h-3.5 w-1.5 bg-accent" />
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </div>

      {/* orange marquee band */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.15 }}
        className="relative border-y border-foreground/20 bg-accent py-3 text-[#16140f]"
        aria-label="Services"
      >
        <div className="overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-8 pr-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                aria-hidden={i >= marqueeItems.length}
                className="flex items-center gap-8 font-display text-xl uppercase tracking-wide whitespace-nowrap sm:text-2xl"
              >
                {item}
                <span aria-hidden className="inline-block size-2 rotate-45 border border-current" />
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
