import type { Metadata } from "next";
import Link from "next/link";
import { Gauge, Search, Smartphone, ShieldCheck, MessageSquare } from "lucide-react";
import { AuditScanner } from "@/components/AuditScanner";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Website Audit Tool — Instant SEO & Speed Check",
  description:
    "Audit your website free in 60 seconds. Speed, SEO, mobile and trust checked instantly, with a plain-language fix list. No email needed to see your results.",
  keywords: [
    "free website audit",
    "website audit tool",
    "audit my website",
    "free website checker",
    "website speed test",
    "free SEO audit",
    "website analyzer",
    "check my website",
    "website health check",
    "mobile friendly test",
  ],
  alternates: { canonical: "/free-website-audit" },
  openGraph: {
    title: "Free Website Audit Tool — Instant SEO & Speed Check",
    description:
      "Audit your website in 60 seconds. An honest scan of what is costing you customers — free, no email required to see the result.",
    url: `${site.url}/free-website-audit`,
    type: "website",
    images: ogImage("Audit your website in 60 seconds", "Free Website Audit Tool"),
  },
};

const checks = [
  {
    icon: Gauge,
    title: "Speed",
    body: "How long your server takes to answer, how heavy the page is, and what is blocking it from painting. Plus Google's own mobile speed score.",
  },
  {
    icon: Smartphone,
    title: "Mobile",
    body: "Whether the page adapts to a phone at all, whether it blocks zooming, and whether it jumps around while loading.",
  },
  {
    icon: Search,
    title: "Findability",
    body: "Title, search description, headings, canonical, structured data, robots and sitemap. The things that decide whether Google can rank you.",
  },
  {
    icon: MessageSquare,
    title: "Enquiries",
    body: "Whether a ready-to-buy visitor can actually reach you from the page, whether your number is tappable, and whether you measure any of it.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    body: "HTTPS, blocked insecure resources, favicon, and whether your links look broken when someone shares them on WhatsApp.",
  },
];

const faqs = [
  {
    q: "Is this really free?",
    a: "Yes, and you do not need to give an email to see the result. The scan runs and shows you everything it found. If you want me to go through the site by hand and write it up properly, that is also free, and it is where you would give me an email. I would rather earn the conversation than trap it.",
  },
  {
    q: "How is this different from PageSpeed Insights?",
    a: "PageSpeed tells you a page is slow. It does not tell you that a visitor on a phone has no way to call you, that your link shares as a blank grey box, or that Google has no sitemap to read. This checks the things that actually decide whether a website earns its keep, and says them in plain language rather than in metrics.",
  },
  {
    q: "What does the score mean?",
    a: "Every category starts at 100. A critical issue costs 30 points, a smaller one costs 12. That is the whole formula, and it is written on the results page. It is a rough signal, not science, and I would rather show you the arithmetic than pretend it is more precise than it is.",
  },
  {
    q: "Will you try to sell me a rebuild?",
    a: "No. Most sites that come through here need three or four specific fixes, not a rebuild, and the honest answer is usually cheaper than you expect. If the fixes are worth doing and you want them done, I will quote them. If your site is basically fine, I will tell you that instead.",
  },
  {
    q: "Does the scan change my website?",
    a: "No. It fetches your page exactly the way a visitor's browser or Google's crawler would, reads the HTML, and checks a handful of public files like robots.txt. It is read-only. Nothing is submitted, stored on your server, or altered.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Website Audit",
  alternateName: "Kodinav Website Audit Tool",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/free-website-audit`,
  description:
    "An instant, free website audit covering speed, mobile, SEO, conversion and trust, with a prioritised list of what to fix first.",
  provider: { "@id": `${site.url}/#studio` },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
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

export default function FreeWebsiteAuditPage() {
  const crumbs = breadcrumbSchema([
    { name: "Free Website Audit", path: "/free-website-audit" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      {/* The tool is the hero. Everything else on this page is downstream of it. */}
      <section className="bg-noise relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <Eyebrow>Free Instant Website Audit</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              Audit your website. See what it&apos;s{" "}
              <span className="text-gradient">costing you</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Paste your address. In about ten seconds you will see how fast it
              really is, whether it works on a phone, whether Google can read it,
              and whether a customer who wants to pay you can actually reach you.
            </p>
          </div>

          <div className="mt-12">
            <AuditScanner />
          </div>
        </div>
      </section>

      {/* What it checks */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="What it checks"
              title="Five things that decide whether a website earns its keep."
              lead="Not a fifty-page dump of metrics nobody reads. The scan reports only what it can actually measure, and says what each finding costs you."
            />
          </Reveal>
          <Stagger className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {checks.map((c) => (
              <StaggerItem key={c.title} className="bg-background">
                <div className="flex h-full flex-col gap-3 p-7">
                  <c.icon className="size-5 text-accent" />
                  <h3 className="font-display text-xl leading-none uppercase">{c.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{c.body}</p>
                </div>
              </StaggerItem>
            ))}
            <StaggerItem className="bg-background">
              <div className="flex h-full flex-col justify-center gap-3 p-7">
                <p className="annotation">And then</p>
                <p className="font-serif text-xl italic leading-snug">
                  I read it myself and tell you which of those actually matter for
                  your business.
                </p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* The honest limits of an automated scan */}
      <section className="ink bg-noise relative overflow-hidden border-t border-line-strong">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
          <Reveal>
            <Eyebrow>Where a scanner stops</Eyebrow>
            <p className="mt-6 font-serif text-2xl leading-snug text-pretty italic sm:text-3xl">
              A machine can tell you a page is slow. It cannot tell you that your
              headline does not say what you sell, that your best work is buried
              three clicks down, or that the form asks for nine things when it needs
              two. That part still takes a person, which is why the written
              breakdown is done by hand.
            </p>
            <p className="mt-8 text-muted">
              <Link href="/website-audit" className="u-draw text-foreground">
                The paid audit
              </Link>{" "}
              is that, in depth, with a walkthrough call.
            </p>
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
