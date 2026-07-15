import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { LinkPreviewChecker } from "@/components/LinkPreviewChecker";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Link Preview Checker — WhatsApp, Google & Social Cards",
  description:
    "See exactly how your link looks when shared on WhatsApp, LinkedIn and social — and on Google. Finds the missing og:image and tags, with plain fixes. Free.",
  keywords: [
    "link preview checker",
    "whatsapp link preview",
    "og image checker",
    "open graph checker",
    "why does my link have no image",
    "social share preview",
    "meta tag checker",
  ],
  alternates: { canonical: "/link-preview-checker" },
  openGraph: {
    title: "Link Preview Checker — WhatsApp, Google & Social Cards",
    description:
      "See how your link shares on WhatsApp and social, and how it looks on Google — with the exact tags to fix. Free.",
    url: `${site.url}/link-preview-checker`,
    type: "website",
    images: ogImage("How does your link look when shared?", "Free Checker"),
  },
};

const facts = [
  {
    title: "The preview is the first impression",
    body: "Most people meet your business as a shared link in a chat. A card with a picture and a clear title gets tapped; a bare grey URL gets scrolled past.",
  },
  {
    title: "One set of tags rules them all",
    body: "WhatsApp, iMessage, LinkedIn, Facebook, Slack and Telegram all read the same Open Graph tags. Fix og:title, og:description and og:image once and every platform follows.",
  },
  {
    title: "The image is where links break",
    body: "The usual failures: no og:image at all, a relative path platforms won't resolve, or an image URL that quietly 404s. This checker tests the image itself, not just the tag.",
  },
  {
    title: "Platforms cache aggressively",
    body: "Fix the tags and WhatsApp may still show the old card for days — it cached the link. Share it with a changed query string (like ?v=2) to force a fresh preview.",
  },
];

const faqs = [
  {
    q: "Why does my link show no image on WhatsApp?",
    a: "Almost always one of four causes: the page has no og:image tag; the image URL is relative instead of absolute; the image itself fails to load; or WhatsApp cached the link before the image existed. This checker identifies which one it is and how to fix it.",
  },
  {
    q: "What size should the og:image be?",
    a: "1200×630 pixels is the safe standard — the 1.91:1 shape every major platform crops to. Keep the file under about 5 MB (WhatsApp is stricter than most) and use an absolute https:// URL.",
  },
  {
    q: "I fixed my tags but the old preview still shows. Why?",
    a: "Caching. Platforms store a link's preview the first time anyone shares it. Appending a query string (yoursite.com/page?v=2) makes it a new URL in their eyes and forces a fresh scrape. For Facebook and LinkedIn, their official debugger tools also offer a re-scrape button.",
  },
  {
    q: "Does this check Google's result too?",
    a: "Yes — the checker also renders your title tag and meta description the way a search result shows them, including whether the title is long enough to be truncated.",
  },
  {
    q: "Is this free, and do you store my URL?",
    a: "Free, no email. The page is fetched once to read its tags, shown to you, and not stored. The check is read-only — nothing on your site is touched.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Link Preview Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/link-preview-checker`,
  description:
    "Free checker showing how a link renders when shared on WhatsApp and social platforms and in Google results, with fixes for missing Open Graph tags.",
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

export default function LinkPreviewCheckerPage() {
  const crumbs = breadcrumbSchema([
    { name: "Free Tools", path: "/free-tools" },
    { name: "Link Preview Checker", path: "/link-preview-checker" },
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
            <Eyebrow>Free Preview Checker</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              How does your link look when{" "}
              <span className="text-gradient">shared</span>?
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Paste a link and see the exact card WhatsApp, LinkedIn and
              iMessage will show — and your Google snippet — with the missing
              tags named and the fixes spelled out.
            </p>
          </div>
          <div className="mt-12">
            <LinkPreviewChecker />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Why it matters"
              title="Shared links are your quietest salesman."
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            {facts.map((f) => (
              <StaggerItem key={f.title} className="bg-background">
                <div className="flex h-full flex-col gap-3 p-7">
                  <h3 className="font-display text-xl leading-none uppercase">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <p className="text-sm leading-relaxed text-muted">
              Want the tags done properly, with a branded share image on every
              page? That is standard on{" "}
              <Link href="/services/business-websites" className="u-draw text-accent">
                every site this studio builds
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
