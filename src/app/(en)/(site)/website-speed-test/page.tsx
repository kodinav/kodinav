import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";
import { SpeedTest } from "@/components/SpeedTest";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Website Speed Test — Free Check in Plain English",
  description:
    "Test your website speed free: server response, page weight and Google's own mobile score — explained in business terms, not waterfall charts. No email.",
  keywords: [
    "website speed test",
    "page speed test",
    "check website speed",
    "why is my website slow",
    "website load time test",
    "core web vitals test",
    "mobile speed test",
  ],
  alternates: { canonical: "/website-speed-test" },
  openGraph: {
    title: "Website Speed Test — Free Check in Plain English",
    description:
      "Server response, page weight and Google's own mobile score — in business terms, not waterfall charts. Free, no email.",
    url: `${site.url}/website-speed-test`,
    type: "website",
    images: ogImage("How fast is your website, really?", "Free Speed Test"),
  },
};

const costs = [
  {
    title: "Speed is a ranking factor",
    body: "Google uses page experience — speed included — as a ranking signal, and it crawls your mobile site. A slow site starts every search behind the fast ones.",
  },
  {
    title: "Visitors don't wait",
    body: "The longer the first screen takes, the more people leave before seeing it. On mobile data the effect is brutal — and mobile is most of your traffic.",
  },
  {
    title: "Slow pages waste ad money",
    body: "If you run Google or Meta ads, you pay for the click before the page loads. Every abandoned load is spend with no chance of becoming a lead.",
  },
  {
    title: "Speed is trust",
    body: "A site that answers instantly feels like a business that answers instantly. A spinner feels like a queue. Customers read speed as competence.",
  },
];

const faqs = [
  {
    q: "What is a good website loading speed?",
    a: "Aim for the first meaningful content within 2.5 seconds on a mid-range phone — that is Google's own bar for Largest Contentful Paint. Server response (TTFB) under 500 ms is healthy; under 200 ms is excellent. The sites this studio ships are engineered to load in under a second.",
  },
  {
    q: "What does TTFB mean?",
    a: "Time To First Byte: how long your server thinks before it starts answering — DNS, connection and server processing combined. Nothing can render before it. A slow TTFB usually means cheap shared hosting or a heavy, uncached backend, and no image compression will fix it.",
  },
  {
    q: "Why does Google's score matter more than how fast it feels to me?",
    a: "You visit your own site on a warm cache, good Wi-Fi and a phone that has seen it before. Google's lab data simulates a mid-range phone on mobile network speeds — much closer to what a first-time visitor experiences. Judge the score, not your own impression.",
  },
  {
    q: "What actually makes websites slow?",
    a: "The same causes appear in almost every slow site this studio audits: page builders shipping megabytes of JavaScript, uncompressed images straight from a camera, a dozen tracking scripts nobody remembers adding, and hosting that takes a second before the first byte. None are exotic; all are fixable.",
  },
  {
    q: "Is this test free? What happens to the URL I enter?",
    a: "Free, no email. The scan fetches your page the way a browser would, reads it, and shows you the result. Google's lab data is requested from Google's public PageSpeed API. Nothing is stored on your site or changed.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Website Speed Test",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/website-speed-test`,
  description:
    "Free website speed test: server response time, page weight and Google mobile performance score, explained in plain language.",
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

export default function WebsiteSpeedTestPage() {
  const crumbs = breadcrumbSchema([
    { name: "Free Tools", path: "/free-tools" },
    { name: "Website Speed Test", path: "/website-speed-test" },
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
            <Eyebrow>Free Speed Test</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              How fast is your website, <span className="text-gradient">really</span>?
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Test your website speed the way a first-time visitor experiences
              it — including Google&apos;s own mobile score — with results in
              business language, not waterfall charts.
            </p>
          </div>
          <div className="mt-12">
            <SpeedTest />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="What slow costs"
              title="Every second has a price."
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            {costs.map((c) => (
              <StaggerItem key={c.title} className="bg-background">
                <div className="flex h-full flex-col gap-3 p-7">
 <h3 className="font-display text-xl leading-none">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{c.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <p className="text-sm leading-relaxed text-muted">
              Failing the test? That is exactly what the{" "}
              <Link href="/services/website-performance" className="u-draw text-accent">
                performance service
              </Link>{" "}
              fixes — or read{" "}
              <Link href="/blog/how-website-speed-affects-rankings" className="u-draw text-accent">
                how speed affects your Google rankings
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Fair questions about speed." align="center" />
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
