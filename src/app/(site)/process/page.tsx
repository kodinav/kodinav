import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Development Process — Discovery to Deployment",
  description:
    "How Kodinav takes a software project from discovery to deployment and support — a nine-step process built on written scopes, fixed quotes, usable slices and honest communication. No surprises.",
  keywords: [
    "software development process",
    "web development process",
    "how software projects work",
    "discovery to deployment",
  ],
  alternates: { canonical: "/process" },
  openGraph: {
    title: "Development Process | Kodinav",
    description:
      "A nine-step process from discovery to launch — written scopes, usable slices, no surprises.",
    url: `${site.url}/process`,
    type: "website",
  },
};

export default function ProcessPage() {
  return (
    <>
      <section className="bg-noise relative overflow-hidden pt-40 pb-20 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div
          aria-hidden
          className="orb -top-32 left-1/2 h-96 w-160 -translate-x-1/2"
          style={{ background: "var(--glow-blue)", opacity: 0.4 }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Development Process</Eyebrow>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              No surprises.
              <br />
              <span className="text-gradient">That&apos;s the process.</span>
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Software projects fail through vagueness — vague scopes, vague
              timelines, vague ownership. Every step below exists to remove a
              specific kind of surprise.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <ProcessTimeline />
      </section>

      <CtaSection
        title="Start with step one."
        lead="Discovery is a conversation, not a commitment. Thirty minutes, no pressure, and you'll leave knowing exactly what your project involves."
      />
    </>
  );
}
