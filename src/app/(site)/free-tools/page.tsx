import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaSection } from "@/components/CtaSection";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { TOOL_COUNT, toolGroups, toolsByGroup, tools } from "@/data/tools";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: `Free Website Tools — ${TOOL_COUNT} Checkers, Generators & Calculators`,
  description:
    "Free tools for business owners: website audit, speed test, cost calculator, QR and link generators, invoice maker and more. No signup, most run in your browser.",
  keywords: [
    "free website tools",
    "free website audit",
    "website cost calculator",
    "free seo tools",
    "free business tools online",
    "free tools for small business",
  ],
  alternates: { canonical: "/free-tools" },
  openGraph: {
    title: `Free Website Tools — ${TOOL_COUNT} Checkers, Generators & Calculators`,
    description:
      "Website audit, speed test, cost calculator, generators and more. Free, no signup, built by an independent software studio.",
    url: `${site.url}/free-tools`,
    type: "website",
    images: ogImage(`${TOOL_COUNT} free tools for business websites`, "No Signup"),
  },
};

const listSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free website tools by Kodinav",
  numberOfItems: tools.length,
  itemListElement: tools.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    url: `${site.url}${t.href}`,
  })),
};

export default function FreeToolsPage() {
  const crumbs = breadcrumbSchema([{ name: "Free Tools", path: "/free-tools" }]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <section className="bg-noise relative overflow-hidden pt-32 pb-10 sm:pt-40">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ name: "Free Tools" }]} />
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Free Tools — {TOOL_COUNT} and counting</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              Useful first. <span className="text-gradient">Free always</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Tools this studio built for its own work, opened up for everyone. No signup,
              no email gates — most run entirely in your browser and store nothing. Other
              platforms charge for these, or harvest your data to pay for them. We&apos;d
              rather earn your trust and, one day, build your software.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/free-website-audit"
                className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3.5 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5"
              >
                Start with a free audit →
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-line-strong px-6 py-3.5 font-mono text-xs tracking-[0.18em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent"
              >
                What we build
              </Link>
            </div>
          </div>
        </div>
      </section>

      {toolGroups.map((g) => (
        <section key={g.id} className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <Reveal>
              <SectionHeading eyebrow={g.eyebrow} title={g.title} lead={g.blurb} />
            </Reveal>
            <Stagger className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {toolsByGroup(g.id).map((t) => (
                <StaggerItem key={t.href} className="bg-background">
                  <Link
                    href={t.href}
                    className="group flex h-full flex-col gap-4 p-7 transition-colors duration-300 hover:bg-surface-raised"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                        {t.featured ? "Popular" : "Free"}
                      </span>
                      <span
                        aria-hidden
                        className="font-mono text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                      >
                        ↗
                      </span>
                    </div>
                    <h2 className="font-display text-2xl leading-none uppercase transition-colors duration-300 group-hover:text-accent">
                      {t.name}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted">{t.blurb}</p>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ))}

      {/* The point of the whole suite: route serious visitors to the product */}
      <section className="ink bg-noise relative overflow-hidden border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <Reveal>
              <Eyebrow>Behind the tools</Eyebrow>
              <h2 className="mt-6 text-4xl sm:text-5xl">
                The same engineering, <span className="text-gradient">pointed at your business</span>.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                Every tool here runs on the craft the studio sells: fast, honest software that
                earns its keep. When a free check shows a problem worth fixing, or you need a
                website, web app or mobile app built properly, that&apos;s the work we do — for
                businesses in the US, the UAE, India and worldwide.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col gap-3">
              <Link
                href="/services"
                className="card-hover flex items-center justify-between border border-line-strong p-5 transition-colors hover:border-accent"
              >
                <span className="font-display text-xl uppercase">Our services</span>
                <span aria-hidden className="text-accent">→</span>
              </Link>
              <Link
                href="/work"
                className="card-hover flex items-center justify-between border border-line-strong p-5 transition-colors hover:border-accent"
              >
                <span className="font-display text-xl uppercase">Real projects</span>
                <span aria-hidden className="text-accent">→</span>
              </Link>
              <Link
                href="/contact"
                className="card-hover flex items-center justify-between border border-accent bg-accent p-5 text-[#efeae0]"
              >
                <span className="font-display text-xl uppercase">Book a free call</span>
                <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
