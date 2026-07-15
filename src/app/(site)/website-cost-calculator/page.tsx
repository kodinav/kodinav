import type { Metadata } from "next";
import { CostCalculator } from "@/components/CostCalculator";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Website Cost Calculator — Estimate Your Project in 60 Seconds",
  description:
    "How much does a website cost? Answer a few questions and get an honest estimate for your business website, e-commerce store or web app — in USD, AED or INR.",
  keywords: [
    "website cost calculator",
    "how much does a website cost",
    "website development cost",
    "website price calculator",
    "e-commerce website cost",
    "web app development cost",
    "website development cost USA",
    "website development cost Dubai",
    "website development cost India",
  ],
  alternates: { canonical: "/website-cost-calculator" },
  openGraph: {
    title: "Website Cost Calculator — Estimate Your Project in 60 Seconds",
    description:
      "Answer a few questions, get an honest price range for your website, store or web app. Real studio numbers, no email required.",
    url: `${site.url}/website-cost-calculator`,
    type: "website",
    images: ogImage("How much does a website cost?", "Free Cost Calculator"),
  },
};

const drivers = [
  {
    title: "Scope, not hours",
    body: "Price follows what the site must do: five pages that present a business cost less than a store with checkout, accounts and shipping rules. Every page and feature is named in the quote.",
  },
  {
    title: "Custom vs. template",
    body: "Templates are cheap to start and expensive to live with: slow, generic and hard to rank. Custom engineering costs more upfront and keeps earning after launch.",
  },
  {
    title: "Content readiness",
    body: "If text and photos exist, projects move fast. If they need to be written and produced, that is real work and it is priced honestly rather than smuggled in later.",
  },
  {
    title: "Who does the work",
    body: "An agency invoice pays for offices and account managers. A marketplace freelancer competes on price and cuts corners. Here the quote pays for one senior engineer, end to end.",
  },
];

const faqs = [
  {
    q: "How much does a website cost in the USA?",
    a: "From a US agency, a custom business website typically runs $15,000 to $60,000. Working directly with this studio, the same scope starts at $2,000 with a fixed, itemised quote, because you pay for senior engineering rather than agency overhead. E-commerce and web applications are scoped and quoted individually.",
  },
  {
    q: "How much does a website cost in Dubai and the UAE?",
    a: "Dubai agencies commonly quote AED 20,000 to 50,000 for a business website. This studio delivers the same scope from about AED 7,500 ($2,000), quoted fixed in writing, with a workday that overlaps Gulf business hours almost entirely.",
  },
  {
    q: "How much does a website cost in India?",
    a: "Serious custom business websites in India start around ₹75,000 at this studio, e-commerce from about ₹1,50,000, and full web applications from ₹3,00,000. Cheaper template work exists, but it is usually slow, generic and invisible on Google — which costs more than it saves.",
  },
  {
    q: "How accurate is this calculator?",
    a: "It uses the studio's real pricing bands — the same numbers on the pricing page — so the range is honest. But an estimate is not a quote. The fixed quote comes after a free discovery call, once every page and feature has a name, and that written number does not move mid-project.",
  },
  {
    q: "What is included in the price?",
    a: "Design, engineering, deployment, analytics, SEO structure and schema markup, training so your team can update content, and a support period after launch. You own everything: code, domain, hosting and data.",
  },
  {
    q: "Are there ongoing costs after launch?",
    a: "Hosting and a domain, typically $5–30 a month depending on the project, registered in your name. Optional maintenance plans exist for businesses that want updates handled, but nothing about the build locks you into one.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Website Cost Calculator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/website-cost-calculator`,
  description:
    "Free interactive calculator estimating the cost of a business website, e-commerce store or web application, in USD, AED and INR.",
  provider: { "@id": `${site.url}/#studio` },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function WebsiteCostCalculatorPage() {
  const crumbs = breadcrumbSchema([
    { name: "Free Tools", path: "/free-tools" },
    { name: "Website Cost Calculator", path: "/website-cost-calculator" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <section className="bg-noise relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <Eyebrow>Free Cost Calculator</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              How much does a website{" "}
              <span className="text-gradient">actually cost</span>?
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Answer a few questions and get an honest range, built from this
              studio&apos;s real pricing — not a teaser number that doubles
              after the first call. No email required.
            </p>
          </div>
          <div className="mt-14">
            <CostCalculator />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="What moves the number"
              title="Four things decide what a website costs."
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            {drivers.map((d) => (
              <StaggerItem key={d.title} className="bg-background">
                <div className="flex h-full flex-col gap-3 p-7">
                  <h3 className="font-display text-xl leading-none uppercase">{d.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{d.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Fair questions about cost." align="center" />
          </Reveal>
          <div className="mt-10">
            <Faq items={faqs} />
          </div>
          <div className="mt-12 text-center">
            <ArrowLink href="/free-tools">Explore all free tools</ArrowLink>
          </div>
        </div>
      </section>

      <CtaSection
        title="Want the real number?"
        lead="A discovery call costs nothing. You describe the project, I ask the questions that matter, and you get a fixed, itemised quote in writing."
      />
    </>
  );
}
