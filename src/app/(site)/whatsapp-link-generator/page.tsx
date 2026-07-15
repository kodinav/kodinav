import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";
import { WhatsAppLinkGenerator } from "@/components/WhatsAppLinkGenerator";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free WhatsApp Link Generator — wa.me Link & QR Code",
  description:
    "Create a click-to-chat WhatsApp link with a pre-filled message, plus a QR code — free, instant, and generated in your browser. Nothing is stored.",
  keywords: [
    "whatsapp link generator",
    "wa.me link generator",
    "whatsapp link with message",
    "click to chat whatsapp",
    "whatsapp qr code generator",
    "whatsapp business link",
    "create whatsapp link",
  ],
  alternates: { canonical: "/whatsapp-link-generator" },
  openGraph: {
    title: "Free WhatsApp Link Generator — wa.me Link & QR Code",
    description:
      "Create a click-to-chat WhatsApp link with a pre-filled message, plus a downloadable QR code. Free, no signup.",
    url: `${site.url}/whatsapp-link-generator`,
    type: "website",
    images: ogImage("WhatsApp link & QR generator", "Free Tool"),
  },
};

const uses = [
  {
    title: "Website chat button",
    body: "Put the link behind a WhatsApp button on your site, so a visitor with a question becomes a conversation instead of a lost tab.",
  },
  {
    title: "Instagram & social bios",
    body: "One tap from your bio to a chat that already says what the customer wants — no phone number to copy, no contact to save.",
  },
  {
    title: "QR at the counter, on menus, on packaging",
    body: "Print the QR where customers stand and wait. Scanning it opens the chat with your message typed and ready to send.",
  },
  {
    title: "Google Business Profile & ads",
    body: "Use the link in your GBP, email signatures and ad campaigns, so every channel lands in the inbox you actually answer.",
  },
];

const faqs = [
  {
    q: "How does a wa.me link work?",
    a: "wa.me is WhatsApp's official click-to-chat domain. A link like wa.me/971501234567 opens a chat with that number directly — the person tapping it does not need to save the contact first. Adding ?text= pre-fills a message they just press send on.",
  },
  {
    q: "Does it work with WhatsApp Business?",
    a: "Yes. The link format is identical for personal WhatsApp and WhatsApp Business — it simply opens a chat with the number, whichever app answers it.",
  },
  {
    q: "Is this free, and what happens to my number?",
    a: "Free, no signup. The link and QR code are generated entirely in your browser: your number and message are never sent to this server or stored anywhere.",
  },
  {
    q: "What format does the phone number need?",
    a: "Country code plus number, digits only — no plus sign, spaces, dashes or leading zero. The generator handles this for you: pick your country code and type the local number.",
  },
  {
    q: "Can I track how many people use my link?",
    a: "Not with a bare wa.me link. If you need counts, put the link behind a button on your own website and measure clicks with your analytics — which is exactly how we wire it into the sites we build.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WhatsApp Link Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: `${site.url}/whatsapp-link-generator`,
  description:
    "Free click-to-chat WhatsApp link generator with pre-filled message and downloadable QR code. Runs entirely in the browser.",
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

export default function WhatsAppLinkGeneratorPage() {
  const crumbs = breadcrumbSchema([
    { name: "Free Tools", path: "/free-tools" },
    { name: "WhatsApp Link Generator", path: "/whatsapp-link-generator" },
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
            <Eyebrow>Free WhatsApp Tool</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">
              WhatsApp link generator, with{" "}
              <span className="text-gradient">message &amp; QR</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Turn your number into a one-tap chat link. Add the message you
              want customers to open with, download the QR code, and put it
              everywhere your customers already are.
            </p>
          </div>
          <div className="mt-14">
            <WhatsAppLinkGenerator />
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Where to use it"
              title="Every channel, one inbox."
              lead="For businesses in the Gulf, India and beyond, WhatsApp is where deals actually close. The link's job is removing every step between a curious customer and the chat."
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
            {uses.map((u) => (
              <StaggerItem key={u.title} className="bg-background">
                <div className="flex h-full flex-col gap-3 p-7">
                  <h3 className="font-display text-xl leading-none uppercase">{u.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{u.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <p className="text-sm leading-relaxed text-muted">
              Want WhatsApp wired into your website properly — floating button,
              lead tracking, the works? That&apos;s part of{" "}
              <Link href="/services/business-websites" className="u-draw text-accent">
                every website this studio builds
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
