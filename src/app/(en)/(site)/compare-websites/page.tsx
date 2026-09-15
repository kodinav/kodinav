import type { Metadata } from "next";
import Link from "next/link";
import { CompareWebsites } from "@/components/CompareWebsites";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Compare Two Websites — Free Side-by-Side Audit",
  description:
    "Put your website against a competitor's: speed, mobile, SEO, conversion and trust scored side by side, with each site's biggest issue named. Free.",
  keywords: [
    "compare two websites",
    "website comparison tool",
    "compare my website to competitor",
    "competitor website analysis",
    "website vs website",
  ],
  alternates: { canonical: "/compare-websites" },
  openGraph: {
    title: "Compare Two Websites — Free Side-by-Side Audit",
    description:
      "Your website vs. theirs: five categories scored side by side, biggest issues named. Free, no email.",
    url: `${site.url}/compare-websites`,
    type: "website",
    images: ogImage("Your website vs. theirs", "Free Comparison"),
  },
};

const points = [
  {
    title: "Customers compare — constantly",
    body: "Before they call anyone, buyers open two or three tabs and judge. Whoever loads faster, reads clearer and looks more credible gets the enquiry. This tool shows that contest's scoreboard.",
  },
  {
    title: "Beating them on Google starts here",
    body: "If a competitor outranks you, part of the answer is usually technical: faster pages, cleaner structure, better mobile behaviour. The rows they win are your to-do list.",
  },
  {
    title: "Losing rows are fixable rows",
    body: "Every category here — speed, mobile, SEO, conversion, trust — is engineering, not luck. A losing scoreboard today is a before-screenshot after the fixes ship.",
  },
  {
    title: "Same test, no thumb on the scale",
    body: "Both sites run through exactly the same checks, fetched the same way. When the scoreboard says you're behind, it's because the measurements are.",
  },
];

const faqs = [
  {
    q: "What exactly gets compared?",
    a: "Both sites run through the same audit engine: speed (server response, page weight), mobile behaviour, SEO structure, conversion basics and trust signals — about twenty measurable checks per site, scored per category, plus each site's single most damaging issue in plain words.",
  },
  {
    q: "Is this a full SEO competitor analysis?",
    a: "No — it compares what is technically measurable from the pages themselves. It does not see backlinks, rankings or traffic. It answers a sharper question: when a customer opens both websites, whose is better built? For the technical half of competitor analysis, that is the half you can fix this month.",
  },
  {
    q: "Can I compare against a much bigger company?",
    a: "Yes, and it is often encouraging. Big companies frequently ship slow, bloated websites — plenty of small businesses with well-engineered sites beat household names on every technical row that Google's crawler actually measures.",
  },
  {
    q: "Will the other site know I compared it?",
    a: "The scan fetches their public homepage once, exactly like any browser or search crawler visiting the page. Nothing is stored on either site and nothing identifies you.",
  },
  {
    q: "I'm losing. What now?",
    a: "The losing rows are a work order. Run the full free audit on your own site to see every underlying finding with its fix, or book a call and the studio will quote fixing them — fixed price, in writing.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Website Comparison Tool",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/compare-websites`,
  description:
    "Free side-by-side technical audit of two websites: speed, mobile, SEO, conversion and trust scored against each other.",
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

export default function CompareWebsitesPage() {
  const crumbs = breadcrumbSchema([
    { name: "Free Tools", path: "/free-tools" },
    { name: "Compare Websites", path: "/compare-websites" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <section className="bg-noise relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <Eyebrow>Free Comparison</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              Your website <span className="text-gradient">vs. theirs</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Put your site against the competitor your customers keep
              mentioning. Five categories, same test for both, winner marked
              on every row.
            </p>
          </div>
          <div className="mt-12">
            <CompareWebsites />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Why compare"
              title="Business is comparative. So is Google."
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            {points.map((p) => (
              <StaggerItem key={p.title} className="bg-background">
                <div className="flex h-full flex-col gap-3 p-7">
 <h3 className="font-display text-xl leading-none">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <p className="text-sm leading-relaxed text-muted">
              Behind on the scoreboard?{" "}
              <Link href="/free-website-audit" className="u-draw text-accent">
                The full audit
              </Link>{" "}
              lists every fix, and{" "}
              <Link href="/contact" className="u-draw text-accent">
                the studio quotes them fixed
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Fair questions." align="center" />
          </Reveal>
          <div className="mt-10">
            <Faq items={faqs} />
          </div>
          <div className="mt-12 text-center">
            <ArrowLink href="/free-tools">Explore all free tools</ArrowLink>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
