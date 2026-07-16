"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ButtonLink } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * CSS-driven line reveal: unlike a framer-motion initial state, the headline
 * is visible at first paint even before JS hydrates — critical for LCP.
 */
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
    <span className={`reveal-line ${className}`}>
      <span style={{ animationDelay: `${delay}s` }}>{children}</span>
    </span>
  );
}

/* The ledger row: quiet, verifiable numbers instead of a wall of claims. */
const figures = [
  { value: "07", label: "Products shipped and live" },
  { value: "03", label: "Markets served, one desk" },
  { value: "<1s", label: "Load time we build to" },
  { value: "100%", label: "Code ownership, yours" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] flex-col justify-between overflow-hidden pt-[calc(6.5rem+env(safe-area-inset-top))] sm:pt-36">
      <div aria-hidden className="bg-grid absolute inset-0" />

      <div className="relative mx-auto w-full max-w-7xl flex-1 px-5 sm:px-8">
        {/* topline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-b border-line pb-4"
        >
          <p className="annotation">Independent software studio</p>
          <p className="annotation hidden sm:block">Est. 2024</p>
          <p className="annotation flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            Taking new projects
          </p>
        </motion.div>

        {/* headline */}
        <h1 className="mt-14 max-w-5xl text-[clamp(2.75rem,7vw,6.25rem)] sm:mt-20">
          <RevealLine delay={0.05}>We build software that</RevealLine>
          <RevealLine delay={0.16}>
            helps businesses <span className="text-gradient">grow</span>.
          </RevealLine>
        </h1>

        {/* sub + actions */}
        <div
          className="rise-soft mt-10 flex max-w-2xl flex-col items-start gap-8 pb-20 sm:mt-12"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
            Websites, web applications and mobile apps, engineered for speed,
            search and the next five years. Every project is designed, built
            and supported personally by the founder.
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
          <p className="annotation">
            Not ready to talk?{" "}
            <Link href="/free-website-audit" className="u-draw text-accent">
              Run the free 60-second website audit →
            </Link>
          </p>
        </div>
      </div>

      {/* ledger figures */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.7, ease }}
        className="relative border-t border-line-strong"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 px-5 sm:px-8 lg:grid-cols-4">
          {figures.map((f, i) => (
            <div
              key={f.label}
              className={`flex flex-col gap-1.5 py-6 sm:py-8 ${
                i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""
              }`}
            >
              <span className="font-mono text-3xl text-foreground sm:text-4xl">
                {f.value}
                <span className="text-brass">.</span>
              </span>
              <span className="annotation">{f.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
