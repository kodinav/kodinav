import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";
import { ReviewLinkGenerator } from "@/components/ReviewLinkGenerator";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Google Review Link Generator — One-Tap Review Link & QR",
  description:
    "A one-tap Google review link plus a printable counter sign with your QR and ready-to-send ask messages for WhatsApp, SMS and email. Free, nothing stored.",
  keywords: [
    "google review link generator",
    "google review link",
    "get google reviews link",
    "google review QR code",
    "how to get google review link",
    "review link for customers",
  ],
  alternates: { canonical: "/google-review-link-generator" },
  openGraph: {
    title: "Free Google Review Link Generator — One-Tap Review Link & QR",
    description:
      "Turn your Google Business Profile into a one-tap review link and printable QR code. Free, no signup.",
    url: `${site.url}/google-review-link-generator`,
    type: "website",
    images: ogImage("Google review link & QR generator", "Free Tool"),
  },
};

const whys = [
  {
    title: "Reviews are local SEO",
    body: "For searches like \"dentist near me\" or \"coaching institute in Noida\", the review count and rating largely decide who shows in the map pack — above every normal result.",
  },
  {
    title: "The ask has to be effortless",
    body: "\"Search for us on Google and leave a review\" loses almost everyone. A link that opens the form with five stars on screen converts a happy customer in the moment they are happy.",
  },
  {
    title: "The QR closes the loop offline",
    body: "At the counter, on the bill, on the box: the customer scans while the experience is fresh, instead of being asked to remember later.",
  },
  {
    title: "Steady beats sudden",
    body: "A few honest reviews every week signal a living business. A burst of twenty in one day looks bought — to Google and to customers.",
  },
];

const faqs = [
  {
    q: "Does the customer need a Google account?",
    a: "Yes — Google reviews require being signed into a Google account, which nearly everyone with an Android phone or Gmail already is. The link takes them straight to the review form for your business.",
  },
  {
    q: "Where do I find my Place ID?",
    a: "Google publishes a free Place ID Finder (linked in the tool above). Search your business name on its map, click your listing, and copy the ID that appears. It usually starts with \"ChIJ\".",
  },
  {
    q: "Can I offer a discount for reviews?",
    a: "No — Google's policy prohibits incentivised reviews, and platforms do remove them. Ask honestly at the right moment instead: right after a good visit, a delivery, a result. The link and QR exist to make that honest ask effortless.",
  },
  {
    q: "Is this free, and what do you store?",
    a: "Free, no signup. The link and QR are generated in your browser — your Place ID is never sent to this server or stored anywhere.",
  },
  {
    q: "My business doesn't show on Google Maps yet. What do I do?",
    a: "You need a Google Business Profile first — it is free at google.com/business. Once it is verified, your business appears on Maps, gets a Place ID, and can receive reviews.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Google Review Link Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/google-review-link-generator`,
  description:
    "Free generator for direct Google review links and printable QR codes, using the official writereview format. Runs entirely in the browser.",
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

export default function GoogleReviewLinkGeneratorPage() {
  const crumbs = breadcrumbSchema([
    { name: "Free Tools", path: "/free-tools" },
    { name: "Google Review Link Generator", path: "/google-review-link-generator" },
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
            <Eyebrow>Free Review Tool</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              Get more Google reviews with{" "}
              <span className="text-gradient">one tap</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              A direct link that opens your review form with the stars ready
              to tap — plus a print-ready counter sign with your QR, and
              polite ask-messages ready to send on WhatsApp, SMS or email.
            </p>
          </div>
          <div className="mt-14">
            <ReviewLinkGenerator />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Why it matters"
              title="Reviews decide who gets found."
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            {whys.map((w) => (
              <StaggerItem key={w.title} className="bg-background">
                <div className="flex h-full flex-col gap-3 p-7">
 <h3 className="font-display text-xl leading-none">{w.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{w.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <p className="text-sm leading-relaxed text-muted">
              Reviews bring them to your profile; the website converts them
              into customers. If yours doesn&apos;t,{" "}
              <Link href="/free-website-audit" className="u-draw text-accent">
                the free audit will show you why
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
