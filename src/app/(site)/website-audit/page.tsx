import type { Metadata } from "next";
import Link from "next/link";
import { Check, Gauge, Search, Smartphone, ShieldCheck, TrendingDown } from "lucide-react";
import { AuditForm } from "@/components/AuditForm";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { Price } from "@/components/Price";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Website Audit — Find What's Costing You Customers | From $49",
  description:
    "A paid website audit that shows exactly why your site is slow, invisible on Google, or losing enquiries — with a prioritised fix list and a walkthrough call. Delivered in 3 business days, from $49.",
  keywords: [
    "website audit",
    "website audit service",
    "website speed audit",
    "SEO audit",
    "website performance audit",
    "Core Web Vitals audit",
    "website review service",
  ],
  alternates: { canonical: "/website-audit" },
  openGraph: {
    title: "Website Audit — Find What's Costing You Customers",
    description:
      "Know exactly why your website underperforms, with a prioritised fix list. Delivered in 3 business days, from $49.",
    url: `${site.url}/website-audit`,
    type: "website",
    images: ogImage("Find what's costing you customers", "Website Audit — from $49"),
  },
};

const deliverables = [
  {
    icon: Gauge,
    title: "Speed & Core Web Vitals",
    body: "Exactly how fast your site loads on a real phone, which of Google's ranking metrics you fail, and what is dragging each one down.",
  },
  {
    icon: Search,
    title: "SEO & findability",
    body: "Why Google can or can't rank you: structure, metadata, schema, indexing, and the specific technical gaps holding you back.",
  },
  {
    icon: Smartphone,
    title: "Mobile experience",
    body: "How your site actually behaves on the mid-range phones most visitors use, where it breaks, and where it loses them.",
  },
  {
    icon: TrendingDown,
    title: "Conversion leaks",
    body: "The specific points where visitors give up instead of enquiring: friction, unclear calls to action, and trust gaps.",
  },
  {
    icon: ShieldCheck,
    title: "Security & health basics",
    body: "Outdated software, missing SSL, broken forms and other quiet risks that undermine trust and rankings.",
  },
  {
    icon: Check,
    title: "A prioritised fix list",
    body: "Not a 50-page automated dump. A short, ranked list of what to fix first for the biggest impact, in plain language.",
  },
];

const steps = [
  {
    title: "Order the audit",
    body: "Tell me your website and your biggest concern. You get a secure payment link by email before any work begins.",
  },
  {
    title: "I audit it by hand",
    body: "Not a tool spitting out a generic report. A real engineer goes through your site the way Google and your customers do.",
  },
  {
    title: "You get the report and a call",
    body: "Within 3 business days: a clear written report, a prioritised fix list, and a short walkthrough call to answer your questions.",
  },
];

const faqs = [
  {
    q: "Is this just an automated tool report?",
    a: "No. Automated tools produce noise. This is a real engineer reviewing your site by hand, the way Google's ranking systems and your actual customers experience it, then telling you in plain language what matters and what to ignore.",
  },
  {
    q: "What if the audit says my site is fine?",
    a: "Then you have paid a small amount for genuine peace of mind and a short list of small wins, which is a good outcome. I would rather tell you the truth than invent problems. That honesty is the point.",
  },
  {
    q: "Do I have to hire you to fix the issues?",
    a: "Not at all. The report is yours to act on however you like, including handing it to your current developer. If you do want the fixes done, I will quote them separately, and the audit fee is credited toward that work.",
  },
  {
    q: "How much does it cost, and in what currency?",
    a: `The audit is ${site.audit.priceUsd} (${site.audit.priceInr} for clients in India). Payment is by a secure link sent after you order. It is deliberately low, because the point is to start with real value, not to profit from the audit itself.`,
  },
  {
    q: "How long does it take?",
    a: `You receive the full report and walkthrough within ${site.audit.turnaround} of payment. If you are on a deadline, mention it and I will do my best to move faster.`,
  },
];

const auditSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Audit",
  serviceType: "Website performance and SEO audit",
  description:
    "A hand-done website audit covering speed, Core Web Vitals, SEO, mobile experience, conversion and security, with a prioritised fix list and a walkthrough call.",
  provider: { "@id": `${site.url}/#studio` },
  areaServed: "Worldwide",
  offers: {
    "@type": "Offer",
    price: "49",
    priceCurrency: "USD",
    url: `${site.url}/website-audit`,
    availability: "https://schema.org/InStock",
  },
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

export default function WebsiteAuditPage() {
  const crumbs = breadcrumbSchema([
    { name: "Website Audit", path: "/website-audit" },
  ]);
  const ctaHref = site.audit.paymentUrl || "#order-form";
  const ctaExternal = Boolean(site.audit.paymentUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(auditSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      {/* Hero */}
      <section className="bg-noise relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal className="flex flex-col items-center gap-6">
            <Eyebrow>Website Audit — Fixed Price</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              Find out what your website is{" "}
              <span className="text-gradient">costing you</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Slow, invisible on Google, or quietly losing enquiries? Get a
              real engineer to tell you exactly what is wrong and what to fix
              first. Delivered in {site.audit.turnaround}.
            </p>
            <div className="flex flex-wrap items-baseline justify-center gap-3">
              <span className="font-display text-5xl">
                <Price inr={site.audit.priceInr} usd={site.audit.priceUsd} />
              </span>
              <span className="annotation text-faint">one-time, fixed</span>
            </div>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={ctaHref}
                {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex min-h-13 items-center justify-center gap-3 border border-accent bg-accent px-8 py-4 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground hover:bg-foreground hover:text-background active:scale-[0.98]"
              >
                Order My Audit →
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-13 items-center justify-center gap-3 border border-line-strong px-8 py-4 font-mono text-xs tracking-[0.18em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                Prefer a call first?
              </Link>
            </div>
            <p className="annotation text-faint">
              Money credited toward the fixes if you go ahead
            </p>
          </Reveal>
        </div>
      </section>

      {/* Deliverables */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="What you get"
              title="Six things, checked by hand."
              lead="Not an automated 50-page dump nobody reads. A real review of the things that actually decide whether your website works."
            />
          </Reveal>
          <Stagger className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((d) => (
              <StaggerItem key={d.title} className="bg-background">
                <div className="flex h-full flex-col gap-3 p-7">
                  <d.icon className="size-5 text-accent" />
                  <h3 className="font-display text-xl leading-none uppercase">
                    {d.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{d.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="How it works" title="Three steps, three days." />
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div className="glass h-full p-7">
                  <span className="font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 mb-2 font-display text-xl uppercase leading-none">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why it's worth it */}
      <section className="ink bg-noise relative overflow-hidden border-t border-line-strong">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
          <Reveal>
            <Eyebrow>Why bother</Eyebrow>
            <p className="mt-6 font-serif text-2xl leading-snug text-pretty italic sm:text-3xl">
              A website losing even a few enquiries a month is costing you far
              more than the audit fee. It tells you whether that is happening,
              and exactly what to do about it, before you spend real money on a
              rebuild you might not need.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Order form */}
      <section id="order-form" className="scroll-mt-24 border-t border-line-strong">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Order your audit"
              title="Ready when you are."
              lead="Tell me your website and your biggest worry. You get a secure payment link by email, then your report and walkthrough within 3 business days."
              align="center"
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <div className="glass p-6 sm:p-9">
              <AuditForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Fair questions." align="center" />
          </Reveal>
          <div className="mt-10">
            <Faq items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
