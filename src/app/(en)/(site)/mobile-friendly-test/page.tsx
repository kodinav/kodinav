import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { MobileFriendlyChecker } from "@/components/MobileFriendlyChecker";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mobile-Friendly Test — Check Your Website on Phones, Free",
  description:
    "Test if your website is mobile-friendly in seconds: viewport, zoom blocking, layout stability and more — with plain-language fixes. Free, no email.",
  keywords: [
    "mobile friendly test",
    "mobile friendly checker",
    "is my website mobile friendly",
    "mobile website test",
    "responsive design checker",
    "google mobile friendly test alternative",
  ],
  alternates: { canonical: "/mobile-friendly-test" },
  openGraph: {
    title: "Mobile-Friendly Test — Check Your Website on Phones, Free",
    description:
      "Google retired its mobile-friendly test. This one carries on the job: instant check, plain-language fixes, free.",
    url: `${site.url}/mobile-friendly-test`,
    type: "website",
    images: ogImage("Is your website mobile-friendly?", "Free Test"),
  },
};

const facts = [
  {
    title: "Google indexes mobile first",
    body: "Google predominantly crawls and ranks the mobile version of your site. If it breaks on a phone, it is broken where rankings are decided.",
  },
  {
    title: "Most of your visitors hold a phone",
    body: "For local businesses in India, the Gulf and the US alike, the majority of traffic is mobile — often two-thirds or more. The desktop version is the minority experience.",
  },
  {
    title: "Google retired its own test",
    body: "The official Mobile-Friendly Test was shut down in 2023. The need didn't retire with it — this test carries on the job with the same core checks.",
  },
  {
    title: "Mobile-friendly is more than \"it fits\"",
    body: "A page can shrink to fit and still fail: text too small to read, zoom disabled, buttons too close to tap, content jumping while it loads. Those are the checks that matter.",
  },
];

const faqs = [
  {
    q: "What does this test actually check?",
    a: "The mobile fundamentals Google's own documentation names: whether a viewport is set so the page adapts to the screen, whether zooming is blocked (an accessibility failure), whether the layout stays stable while loading, and whether the basics that mobile visitors depend on — like a tappable phone number — are in place.",
  },
  {
    q: "What happened to Google's Mobile-Friendly Test?",
    a: "Google retired the standalone Mobile-Friendly Test tool and its API in December 2023. Mobile-friendliness still matters for rankings — Google indexes mobile-first — there is simply no official standalone tool anymore, which is why this one exists.",
  },
  {
    q: "My site \"looks fine\" on my phone. Why test it?",
    a: "You know your site, so you scroll past its problems. New visitors don't. Blocked zoom, tiny tap targets and layout jumps lose people quietly — and you never see it happen because they simply leave.",
  },
  {
    q: "Is a responsive template automatically mobile-friendly?",
    a: "Usually it fits the screen, yes. But templates routinely fail the parts that convert: slow loads on real phone networks, oversized images, cluttered menus, and forms that are painful to fill on a keyboard the size of a thumb.",
  },
  {
    q: "What does it cost?",
    a: "Nothing, and no email is required. It runs the same engine as the full free website audit, which also grades speed, SEO, conversion and trust whenever you want the complete picture.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mobile-Friendly Test",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/mobile-friendly-test`,
  description:
    "Free mobile-friendliness test: viewport, zoom blocking, layout stability and tap-to-call checks with plain-language fixes.",
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

export default function MobileFriendlyTestPage() {
  const crumbs = breadcrumbSchema([
    { name: "Free Tools", path: "/free-tools" },
    { name: "Mobile-Friendly Test", path: "/mobile-friendly-test" },
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
            <Eyebrow>Free Mobile Test</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              Is your website{" "}
              <span className="text-gradient">mobile-friendly</span>?
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Most of your visitors are on a phone, and Google ranks the mobile
              version of your site. Test yours in seconds — results in plain
              language, not jargon.
            </p>
          </div>
          <div className="mt-12">
            <MobileFriendlyChecker />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Why it matters"
              title="Mobile is where rankings are decided."
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            {facts.map((f) => (
              <StaggerItem key={f.title} className="bg-background">
                <div className="flex h-full flex-col gap-3 p-7">
 <h3 className="font-display text-xl leading-none">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <p className="text-sm leading-relaxed text-muted">
              Failing the test? Read{" "}
              <Link href="/blog/core-web-vitals-explained" className="u-draw text-accent">
                Core Web Vitals, explained for business owners
              </Link>{" "}
              — or let the studio fix it properly.
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
