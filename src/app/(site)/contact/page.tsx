import type { Metadata } from "next";
import { CalendarClock, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Contact — Book a Free Discovery Call",
  description:
    "Book a free discovery call with Kodinav, or reach out by email or WhatsApp. Every enquiry is answered personally by founder Abhinav Saxena within one business day.",
  keywords: [
    "contact software developer India",
    "book discovery call",
    "hire software studio",
    "custom software enquiry",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Kodinav",
    description:
      "Book a free discovery call, or reach out by email or WhatsApp. Personal reply within one business day.",
    url: `${site.url}/contact`,
    type: "website",
    images: ogImage("Book a free discovery call", "Contact"),
  },
};

const channels = [
  {
    icon: CalendarClock,
    title: "Book a discovery call",
    body: "Thirty minutes, free, no obligation. The fastest way to get an honest scope and a real quote.",
    // Falls back to the enquiry form until a real booking link exists
    href: site.calendly || "#project-enquiry",
    label: site.calendly ? "Pick a time" : "Request a call",
    external: Boolean(site.calendly),
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    body: `Prefer chat? Message ${site.phone} directly. Useful for quick questions before committing to a call.`,
    href: site.whatsapp,
    label: "Open WhatsApp",
    external: true,
  },
  {
    icon: Mail,
    title: "Email",
    body: `Write in detail whenever suits you. Replies within one business day: ${site.email}`,
    href: `mailto:${site.email}`,
    label: "Send an email",
    external: true,
  },
];

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${site.name}`,
  url: `${site.url}/contact`,
  mainEntity: {
    "@id": `${site.url}/#studio`,
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <section className="bg-noise relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div
          aria-hidden
          className="orb -top-32 left-1/2 h-96 w-160 -translate-x-1/2"
          style={{ background: "var(--glow-blue)", opacity: 0.4 }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Talk to the person who&apos;ll{" "}
              <span className="text-gradient">build it</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              No sales team, no gatekeeping. Every message below lands directly
              with {site.founder} and gets a personal reply within one business
              day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 lg:grid-cols-3">
          {channels.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <a
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="card-hover glass group flex h-full flex-col gap-3 rounded-2xl p-7"
              >
                <c.icon className="size-6 text-accent-soft" />
                <h2 className="text-lg font-semibold tracking-tight">{c.title}</h2>
                <p className="text-sm leading-relaxed text-muted">{c.body}</p>
                <span className="mt-auto pt-2 text-sm font-medium text-accent-soft transition-colors group-hover:text-foreground">
                  {c.label} →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div
            id="project-enquiry"
            className="grid scroll-mt-28 gap-12 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <Reveal>
              <div className="flex flex-col gap-6">
                <SectionHeading
                  eyebrow="Project Enquiry"
                  title="Tell me about your project."
                  lead="A few honest answers help me come to our first conversation already prepared, often with a rough approach in hand."
                />
                <div className="glass flex items-start gap-4 rounded-2xl p-6">
                  <MapPin className="mt-1 size-5 shrink-0 text-accent-soft" />
                  <div>
                    <h3 className="font-medium">Based in {site.location}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      Working with clients in Delhi, Noida, Gurgaon, Ghaziabad
                      and across India, and worldwide. Calls scheduled in your
                      timezone.
                    </p>
                  </div>
                </div>
                {/* TODO: replace with a real Google Maps embed once an office address is public:
                    <iframe src="https://www.google.com/maps/embed?pb=..." /> */}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="glass rounded-3xl p-7 sm:p-9">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Calendly inline embed — hidden until a real booking URL is configured */}
      {site.calendly && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <SectionHeading
                eyebrow="Schedule Directly"
                title="Pick a time that works."
                align="center"
              />
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <div className="glass overflow-hidden rounded-3xl">
                <iframe
                  src={`${site.calendly}?hide_gdpr_banner=1&background_color=efeae0&text_color=16140f&primary_color=ff4400`}
                  title="Book a discovery call — Calendly"
                  loading="lazy"
                  className="h-175 w-full"
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
