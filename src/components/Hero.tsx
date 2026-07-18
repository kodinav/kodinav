"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ButtonLink, PulseDot } from "./ui";
import { Magnetic } from "./motion";
import { HeroVisual } from "./HeroVisual";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * CSS-driven line reveal: the headline is visible at first paint even before
 * JS hydrates — it carries the LCP, so it must not depend on framer-motion.
 */
function RevealLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="reveal-line">
      <span style={{ animationDelay: `${delay}s` }}>{children}</span>
    </span>
  );
}

/* Quiet, verifiable numbers — every one of them literally true. */
const figures = [
  { value: "07", label: "Products shipped and live" },
  { value: "03", label: "Markets served, one desk" },
  { value: "<1s", label: "Load time we build to" },
  { value: "100%", label: "Code ownership, yours" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[94svh] flex-col justify-between overflow-hidden pt-[calc(7rem+env(safe-area-inset-top))] sm:pt-40">
      <div
        aria-hidden
        className="bg-grid absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, black 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, black 30%, transparent 78%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-12 px-5 pb-14 sm:px-8 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
        {/* headline column */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-wrap items-center gap-x-4 gap-y-1.5"
          >
            <span className="annotation flex items-center gap-2 text-foreground/70">
              <PulseDot />
              Taking new projects
            </span>
            <span aria-hidden className="hidden h-3 w-px bg-line-strong sm:block" />
            <span className="annotation hidden sm:inline">
              Independent software studio · Est. 2024
            </span>
          </motion.div>

          <h1 className="mt-7 text-[clamp(2.7rem,6.4vw,5.6rem)]">
            <RevealLine delay={0.05}>We build software</RevealLine>
            <RevealLine delay={0.15}>that helps businesses</RevealLine>
            <RevealLine delay={0.25}>
              <span className="text-gradient">grow</span>.
            </RevealLine>
          </h1>

          <div
            className="rise-soft mt-8 flex max-w-xl flex-col items-start gap-8"
            style={{ animationDelay: "0.35s" }}
          >
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Websites, web applications and mobile apps, engineered for speed,
              search and the next five years. Every project is designed, built
              and supported personally by the founder.
            </p>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <Magnetic>
                <ButtonLink href="/contact" size="lg" className="w-full sm:w-auto">
                  Book discovery call
                </ButtonLink>
              </Magnetic>
              <ButtonLink
                href="/work"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explore work
              </ButtonLink>
            </div>
            <p className="annotation">
              Not ready to talk?{" "}
              <Link href="/free-website-audit" className="u-draw text-accent">
                Run the free 60-second audit →
              </Link>
            </p>
          </div>
        </div>

        {/* signature visual */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="mx-auto w-full max-w-lg lg:mx-0 lg:pl-6"
        >
          <HeroVisual />
        </motion.div>
      </div>

      {/* index / metrics strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.8, ease }}
        className="relative border-t border-line-strong bg-background/40"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 px-5 sm:px-8 lg:grid-cols-4">
          {figures.map((f, i) => (
            <div
              key={f.label}
              className={`flex flex-col gap-1.5 py-6 sm:py-7 ${
                i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""
              }`}
            >
              <span className="tabular font-display text-3xl leading-none text-foreground sm:text-4xl">
                {f.value}
                <span className="text-accent">.</span>
              </span>
              <span className="annotation">{f.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
