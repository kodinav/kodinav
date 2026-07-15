import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Website Tools — Audit, Cost Calculator & Generators",
  description:
    "Free tools for business owners: instant website audit, cost calculator, mobile-friendly test, WhatsApp link generator and Google review link generator. No signup.",
  keywords: [
    "free website tools",
    "free website audit",
    "website cost calculator",
    "mobile friendly test",
    "whatsapp link generator",
    "google review link generator",
  ],
  alternates: { canonical: "/free-tools" },
  openGraph: {
    title: "Free Website Tools — Audit, Cost Calculator & Generators",
    description:
      "Instant website audit, cost calculator, mobile test and link generators. Free, no signup, built by an independent software studio.",
    url: `${site.url}/free-tools`,
    type: "website",
    images: ogImage("Free tools for business websites", "No Signup"),
  },
};

const tools = [
  {
    href: "/free-website-audit",
    name: "Free Website Audit",
    blurb:
      "Paste your address, see in seconds what your website is costing you: speed, mobile, SEO, conversion and trust, in plain language.",
    tag: "Most popular",
  },
  {
    href: "/website-cost-calculator",
    name: "Website Cost Calculator",
    blurb:
      "Answer a few questions and get an honest price range for your website, store or web application — the studio's real numbers.",
    tag: "Estimate",
  },
  {
    href: "/mobile-friendly-test",
    name: "Mobile-Friendly Test",
    blurb:
      "Google retired its mobile test; this one carries on the job. Check viewport, zoom, stability and tap-to-call in seconds.",
    tag: "Test",
  },
  {
    href: "/whatsapp-link-generator",
    name: "WhatsApp Link Generator",
    blurb:
      "Turn your number into a one-tap wa.me chat link with a pre-filled message, plus a downloadable QR code.",
    tag: "Generator",
  },
  {
    href: "/google-review-link-generator",
    name: "Google Review Link Generator",
    blurb:
      "A direct link that opens your Google review form with the stars ready to tap — plus a printable QR for the counter.",
    tag: "Generator",
  },
];

const listSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free website tools by Kodinav",
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

      <section className="bg-noise relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Free Tools</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              Useful first. <span className="text-gradient">Free always</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Tools this studio built for its own work, opened up for everyone.
              No signup, no email gates, nothing stored — the results are the
              marketing.
            </p>
          </div>

          <Stagger className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <StaggerItem key={t.href} className="bg-background">
                <Link
                  href={t.href}
                  className="group flex h-full flex-col gap-4 p-7 transition-colors duration-300 hover:bg-surface-raised"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                      {t.tag}
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
            <StaggerItem className="bg-background">
              <div className="flex h-full flex-col justify-center gap-3 p-7">
                <p className="annotation">More on the bench</p>
                <p className="font-serif text-xl italic leading-snug">
                  New tools ship when they can be genuinely useful — not to
                  chase a keyword.
                </p>
              </div>
            </StaggerItem>
          </Stagger>

          <Reveal className="mt-10">
            <p className="text-sm leading-relaxed text-muted">
              Every tool runs on the same engineering the studio sells:{" "}
              <Link href="/services" className="u-draw text-accent">
                fast, honest software for businesses
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
