import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Chip, Eyebrow } from "@/components/ui";
import { Price } from "@/components/Price";
import { services } from "@/data/services";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Services — Web, App, LMS, CRM, ERP & AI Development",
  description:
    "Business websites, custom web applications, mobile apps, learning management systems (LMS), CRM, ERP, admin dashboards, AI integrations and e-commerce. Engineered end to end by Kodinav, from ₹75,000.",
  keywords: [
    "software development services India",
    "custom web application development",
    "LMS development India",
    "CRM development",
    "ERP development",
    "mobile app development",
    "AI integration services",
    "e-commerce development India",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Kodinav — Independent Software Studio",
    description:
      "From a business website to a full ERP. Designed, engineered, deployed and supported under one roof.",
    url: `${site.url}/services`,
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-noise relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div
          aria-hidden
          className="orb -top-32 right-1/4 h-96 w-160"
          style={{ background: "var(--glow-blue)", opacity: 0.35 }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Services</Eyebrow>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Everything a business needs to{" "}
              <span className="text-gradient">run on software</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Websites, platforms, apps and internal systems. Scoped honestly,
              engineered properly, and supported after launch. Projects start
              from <Price inr={site.priceFloor} usd={site.priceFloorUsd} />.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Front-door offer: paid audit */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <Reveal>
          <Link
            href="/website-audit"
            className="card-hover ink group flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10"
          >
            <div className="flex flex-col gap-3">
              <p className="annotation flex items-center gap-3">
                <span className="crosshair text-accent" aria-hidden />
                Start here — <Price inr={site.audit.priceInr} usd={site.audit.priceUsd} />
              </p>
              <h2 className="font-display text-3xl uppercase sm:text-4xl">
                Not sure what you need? Get a{" "}
                <span className="text-gradient">website audit</span>.
              </h2>
              <p className="max-w-xl leading-relaxed text-muted">
                A real engineer tells you exactly why your site is slow,
                invisible on Google, or losing enquiries, with a prioritised fix
                list. Delivered in {site.audit.turnaround}.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 border border-accent bg-accent px-6 py-3.5 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform group-hover:translate-x-1">
              Order audit →
            </span>
          </Link>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <StaggerItem key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="card-hover glass group flex h-full flex-col gap-4 rounded-3xl p-8"
              >
                <h2 className="flex items-start justify-between gap-4 text-2xl font-semibold tracking-tight">
                  {s.name}
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-soft" />
                </h2>
                <p className="leading-relaxed text-muted">{s.short}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {s.stack.slice(0, 4).map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaSection
        title="Not sure which service fits?"
        lead="That's what the discovery call is for. Describe the problem and I'll tell you what's worth building, what isn't, and what it would cost."
      />
    </>
  );
}
