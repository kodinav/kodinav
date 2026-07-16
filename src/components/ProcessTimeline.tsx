"use client";

import { motion } from "framer-motion";

export const processSteps = [
  {
    step: "01",
    title: "Discovery",
    body: "A structured conversation about your business, your customers and what success looks like. No jargon, no pressure. By the end we both know whether this project should exist.",
  },
  {
    step: "02",
    title: "Research",
    body: "I study how your business actually operates: your workflows, your competitors, and what your customers need to believe before they buy.",
  },
  {
    step: "03",
    title: "Planning",
    body: "A written scope naming every screen, workflow and integration. Both of us can point at the same document and see the same product. This is what makes fixed quotes possible.",
  },
  {
    step: "04",
    title: "UI Design",
    body: "Interfaces designed for your real users on their real devices. You review actual screens, not abstract descriptions, before development begins.",
  },
  {
    step: "05",
    title: "Architecture",
    body: "Data models, infrastructure and integration decisions made deliberately, so the system scales with your growth instead of being rebuilt in two years.",
  },
  {
    step: "06",
    title: "Development",
    body: "Built in usable slices, not a big-bang reveal. You see working software within weeks and can course-correct while changes are still cheap.",
  },
  {
    step: "07",
    title: "Testing",
    body: "Automated tests, real-device checks and load testing where it matters. Like the day 2,000 students press 'Start Test' at once.",
  },
  {
    step: "08",
    title: "Deployment",
    body: "Launch handled end to end: hosting, domains, SSL, monitoring and backups. Launch day should be boring. That's the goal.",
  },
  {
    step: "09",
    title: "Support",
    body: "Every project includes a support period, and most clients stay on a monthly retainer. Full code ownership and documentation mean you're never locked in.",
  },
];

export function ProcessTimeline({ compact = false }: { compact?: boolean }) {
  const steps = compact ? processSteps.filter((_, i) => i % 2 === 0) : processSteps;

  return (
    <ol className="mx-auto max-w-4xl border-t border-line-strong">
      {steps.map((s) => (
        <motion.li
          key={s.step}
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="group border-b border-line"
        >
          <div className="grid gap-4 py-8 sm:grid-cols-[7rem_1fr] sm:gap-10 sm:py-10">
            <span
              aria-hidden
 className="font-display text-6xl leading-none text-foreground/15 transition-colors duration-300 group-hover:text-accent sm:text-7xl"
            >
              {s.step}
            </span>
            <div>
 <h3 className="font-display text-2xl tracking-wide sm:text-3xl">
                {s.title}
              </h3>
              <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted">
                {s.body}
              </p>
            </div>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
