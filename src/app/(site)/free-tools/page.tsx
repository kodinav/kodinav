import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Website Tools — 21 Checkers, Generators & Calculators",
  description:
    "21 free tools for business owners: website audit, speed test, cost calculator, QR and link generators, invoice maker and more. No signup, nothing stored.",
  keywords: [
    "free website tools",
    "free website audit",
    "website cost calculator",
    "free seo tools",
    "free business tools online",
  ],
  alternates: { canonical: "/free-tools" },
  openGraph: {
    title: "Free Website Tools — 21 Checkers, Generators & Calculators",
    description:
      "Website audit, speed test, cost calculator, generators and more. Free, no signup, built by an independent software studio.",
    url: `${site.url}/free-tools`,
    type: "website",
    images: ogImage("21 free tools for business websites", "No Signup"),
  },
};

type Tool = { href: string; name: string; blurb: string };

const groups: { title: string; eyebrow: string; tools: Tool[] }[] = [
  {
    title: "Check & test",
    eyebrow: "Fig. 01 — Diagnostics",
    tools: [
      {
        href: "/free-website-audit",
        name: "Free Website Audit",
        blurb: "The full picture in one scan: speed, mobile, SEO, conversion and trust, in plain language.",
      },
      {
        href: "/website-speed-test",
        name: "Website Speed Test",
        blurb: "Server response, page weight and Google's own mobile score — in business terms.",
      },
      {
        href: "/mobile-friendly-test",
        name: "Mobile-Friendly Test",
        blurb: "Google retired its mobile test; this one carries on the job.",
      },
      {
        href: "/compare-websites",
        name: "Compare Two Websites",
        blurb: "Your site against a competitor's, winner marked on every row.",
      },
      {
        href: "/link-preview-checker",
        name: "Link Preview Checker",
        blurb: "The exact card WhatsApp and LinkedIn show for your link — and your Google snippet.",
      },
      {
        href: "/broken-link-checker",
        name: "Broken Link Checker",
        blurb: "Every link on a page tested; the dead ones named with their anchor text.",
      },
      {
        href: "/redirect-checker",
        name: "Redirect Checker",
        blurb: "Every hop between the click and the page: status codes, 301 vs 302, total time.",
      },
      {
        href: "/ssl-checker",
        name: "SSL Checker",
        blurb: "Certificate expiry, days remaining, and whether browsers trust the chain.",
      },
      {
        href: "/is-my-website-down",
        name: "Is My Website Down?",
        blurb: "Down for everyone or just you — answered by a live check from our server.",
      },
    ],
  },
  {
    title: "Generate",
    eyebrow: "Fig. 02 — Generators",
    tools: [
      {
        href: "/whatsapp-link-generator",
        name: "WhatsApp Link Generator",
        blurb: "One-tap wa.me chat link with a pre-filled message, plus a QR code.",
      },
      {
        href: "/google-review-link-generator",
        name: "Google Review Link",
        blurb: "A link that opens your review form with the stars ready to tap — plus a printable QR.",
      },
      {
        href: "/qr-code-generator",
        name: "QR Code Generator",
        blurb: "Static codes that never expire. PNG and print-quality SVG, no watermark.",
      },
      {
        href: "/og-image-generator",
        name: "OG Image Generator",
        blurb: "A clean 1200×630 share card from a headline and your colours.",
      },
      {
        href: "/schema-markup-generator",
        name: "Schema Markup Generator",
        blurb: "LocalBusiness, FAQ, Service and Organization JSON-LD from a simple form.",
      },
      {
        href: "/privacy-policy-generator",
        name: "Privacy Policy Generator",
        blurb: "A plain-language policy built from what your website actually does.",
      },
      {
        href: "/email-signature-generator",
        name: "Email Signature Generator",
        blurb: "A clean signature that renders correctly in Gmail and Outlook.",
      },
      {
        href: "/utm-builder",
        name: "UTM Link Builder",
        blurb: "Tagged campaign links that report cleanly in Google Analytics.",
      },
    ],
  },
  {
    title: "Calculate & paperwork",
    eyebrow: "Fig. 03 — Business",
    tools: [
      {
        href: "/website-cost-calculator",
        name: "Website Cost Calculator",
        blurb: "An honest price range for your website, store or web app — the studio's real numbers.",
      },
      {
        href: "/invoice-generator",
        name: "Invoice Generator",
        blurb: "A clean GST/VAT-ready invoice, straight to PDF, nothing stored.",
      },
      {
        href: "/vat-calculator-uae",
        name: "UAE VAT Calculator",
        blurb: "Add 5% VAT or split it out of an inclusive AED price.",
      },
      {
        href: "/gst-calculator-india",
        name: "GST Calculator (India)",
        blurb: "All slabs, both directions, with the CGST/SGST split.",
      },
      {
        href: "/compress-images",
        name: "Image Compressor",
        blurb: "Photos resized and WebP-encoded on your own device — no upload.",
      },
    ],
  },
];

const listSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free website tools by Kodinav",
  itemListElement: groups
    .flatMap((g) => g.tools)
    .map((t, i) => ({
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

      <section className="bg-noise relative overflow-hidden pt-36 pb-10 sm:pt-44">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Free Tools — {groups.reduce((n, g) => n + g.tools.length, 0)} and counting</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              Useful first. <span className="text-gradient">Free always</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Tools this studio built for its own work, opened up for everyone.
              No signup, no email gates — most run entirely in your browser and
              store nothing. The results are the marketing.
            </p>
          </div>
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.title} className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <Reveal>
              <SectionHeading eyebrow={g.eyebrow} title={g.title} />
            </Reveal>
            <Stagger className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {g.tools.map((t) => (
                <StaggerItem key={t.href} className="bg-background">
                  <Link
                    href={t.href}
                    className="group flex h-full flex-col gap-4 p-7 transition-colors duration-300 hover:bg-surface-raised"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">Free</span>
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

      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <Reveal>
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              Every tool runs on the same engineering the studio sells:{" "}
              <Link href="/services" className="u-draw text-accent">
                fast, honest software for businesses
              </Link>
              . New tools ship when they can be genuinely useful — not to chase
              a keyword.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
