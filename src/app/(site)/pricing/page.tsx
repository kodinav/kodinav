import type { Metadata } from "next";
import { Check } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { Price } from "@/components/Price";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Pricing — Custom Software Projects from ₹75,000",
  description: `Kodinav software projects start from ${site.priceFloor}, with a fixed, itemised quote after a free discovery call. No packages, no hidden costs, no mid-project surprises. You own the code.`,
  keywords: [
    "software development cost India",
    "website development price India",
    "custom software pricing",
    "web application cost",
    "how much does a website cost India",
  ],
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | Kodinav",
    description: `Projects from ${site.priceFloor}. Fixed, itemised quotes after a free discovery call.`,
    url: `${site.url}/pricing`,
    type: "website",
    images: ogImage("Honest pricing, fixed quotes", "Pricing"),
  },
};

const included = [
  "Discovery and written scope before any commitment",
  "Fixed, itemised quote priced per project, not per hour",
  "Design, development, testing and deployment",
  "Performance, SEO and security engineering as standard",
  "Post-launch support period included",
  "Full source code and infrastructure ownership",
];

const pricingFaqs = [
  {
    q: "Why don't you show fixed packages?",
    a: "Because packages force your project into a predefined box. You either pay for features you don't need or get squeezed on ones you do. Every Kodinav quote is built from your actual scope: each screen, workflow and integration itemised, so you can see exactly what you're paying for.",
  },
  {
    q: "What does the starting price get?",
    a: "A focused project done properly. Typically a custom business website engineered for speed and search visibility, or a small internal tool. Indian clients start from ₹75,000; international clients from $2,000. Larger platforms like an LMS, CRM, booking system or mobile app scale up from there depending on scope. The discovery call gives you a real, fixed number for your real project, in your currency.",
  },
  {
    q: "Can the price change mid-project?",
    a: "Not for the agreed scope. That's the point of writing it down. If you add scope mid-project, the addition is quoted separately before any work begins, and you decide.",
  },
  {
    q: "How do payments work?",
    a: "Milestone-based: an advance to begin, then payments tied to delivered, working slices of the project. You never pay for months of invisible work.",
  },
  {
    q: "What about ongoing costs after launch?",
    a: "Hosting and infrastructure run at cost, often ₹500 to ₹5,000 a month depending on scale, billed directly to accounts you own. Optional support retainers are quoted separately and cancellable anytime.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="bg-noise relative overflow-hidden pt-40 pb-20 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div
          aria-hidden
          className="orb -top-32 left-1/2 h-96 w-160 -translate-x-1/2"
          style={{ background: "var(--glow-violet)", opacity: 0.35 }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Priced like engineering,
              <br />
              <span className="text-gradient">not like mystery.</span>
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              No packages designed to upsell you. One honest model: your scope,
              written down, quoted fixed.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="glass h-full rounded-md p-8 sm:p-10">
              <p className="text-sm text-faint">Projects start from</p>
              <p className="mt-2 text-6xl font-semibold tracking-tight">
                <Price inr={site.priceFloor} usd={site.priceFloorUsd} />
              </p>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted">
                Typical engagements range from{" "}
                <Price inr={site.priceFloor} usd={site.priceFloorUsd} /> for a
                focused business website to{" "}
                <Price inr={site.priceCeil} usd={site.priceCeilUsd} /> for full
                platforms: LMS, ERP, booking systems and mobile apps.
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span className="text-sm leading-relaxed text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Stagger className="flex flex-col gap-4">
            <StaggerItem>
              <div className="glass rounded-md p-8">
                <h2 className="text-xl font-semibold tracking-tight">
                  1 · Discovery call
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Free, thirty minutes. We map your problem, and I tell you
                  honestly whether custom software is even the right answer.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="glass rounded-md p-8">
                <h2 className="text-xl font-semibold tracking-tight">
                  2 · Written scope
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Every screen, workflow and integration named in a document we
                  both agree on. The foundation that makes a fixed quote
                  possible.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="glass rounded-md p-8">
                <h2 className="text-xl font-semibold tracking-tight">
                  3 · Fixed quote
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  An itemised, custom quote for your exact scope. Milestone
                  payments tied to working software, never to promises.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <ButtonLink href="/contact" size="lg" className="w-full">
                Book Discovery Call
              </ButtonLink>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Questions about pricing." align="center" />
        </Reveal>
        <div className="mt-12">
          <Faq items={pricingFaqs} />
        </div>
      </section>

      <CtaSection
        title="Get a real number for your project."
        lead="Thirty minutes of discovery gets you an honest scope and a fixed quote. Or an honest 'you don't need this yet.'"
      />
    </>
  );
}
