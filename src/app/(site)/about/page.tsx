import type { Metadata } from "next";
import Image from "next/image";
import { CtaSection } from "@/components/CtaSection";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: `About — Independent Software Studio by ${site.founder}`,
  description: `Kodinav is an independent software studio in India founded by ${site.founder}. Every website, web app and mobile app is personally designed, architected and built by the founder. Direct communication, full ownership, no agency overhead.`,
  keywords: [
    "about Kodinav",
    "Abhinav Saxena software engineer",
    "independent software developer India",
    "hire freelance software engineer India",
    "software studio founder",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About Kodinav — Founded by ${site.founder}`,
    description: `An independent software studio in India. Every project personally led by ${site.founder}.`,
    url: `${site.url}/about`,
    type: "profile",
    images: ogImage("Every project is personal", "About the Studio"),
  },
};

const principles = [
  {
    title: "Personal ownership",
    body: "My name is on every project. There is no one to pass blame to and no incentive to cut corners. The work is the reputation.",
  },
  {
    title: "Quality over quantity",
    body: "The studio takes on a small number of projects at a time. Yours gets genuine attention, not a slot in a production line.",
  },
  {
    title: "Long-term relationships",
    body: "The goal of every project is the next five years, not the invoice. Most clients stay for years, because the software keeps earning its keep.",
  },
  {
    title: "Honesty as strategy",
    body: "If something shouldn't be built, or a ₹2,000/month tool solves your problem, I'll say so in the first call. Trust compounds better than any upsell.",
  },
];

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${site.name}`,
  url: `${site.url}/about`,
  mainEntity: { "@id": `${site.url}/#founder` },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <section className="bg-noise relative overflow-hidden pt-40 pb-20 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div
          aria-hidden
          className="orb -top-32 left-1/2 h-96 w-160 -translate-x-1/2"
          style={{ background: "var(--glow-blue)", opacity: 0.4 }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>About the Studio</Eyebrow>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              One engineer.
              <br />
              <span className="text-gradient">Full accountability.</span>
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Kodinav is an independent software studio founded by{" "}
              {site.founder}. Not a company pretending to be big. Not a
              freelancer squeezing projects between gigs. A studio built on a
              simple idea: businesses deserve software crafted by someone who
              stakes their name on it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div className="flex flex-col gap-6">
              <SectionHeading eyebrow="The Founder" title={site.founder} />
              <figure className="relative w-full max-w-70 border border-line-strong bg-surface-raised p-2.5">
                <div className="relative aspect-square w-full overflow-hidden border border-line-strong">
                  <Image
                    src="/founder.jpg"
                    alt={`${site.founder}, founder of Kodinav — independent software engineer`}
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="annotation pt-2.5 text-faint">
                  Est. 2024 — {site.location}
                </figcaption>
              </figure>
              <p className="prose-justify leading-relaxed text-muted">
                I&apos;m a full stack developer based in Delhi NCR who has
                spent years designing and building web platforms, mobile apps
                and business systems with React, Next.js, Node.js and Flutter.
                The range runs from education platforms serving thousands of students to
                e-commerce and booking systems processing real revenue. Kodinav
                is where that experience is applied with full ownership: I lead
                every website development project personally, from the first
                discovery conversation to deployment and support, for clients
                in Delhi, Noida, Gurgaon and across India.
              </p>
              <p className="prose-justify leading-relaxed text-muted">
                Why independent? Because the traditional models are broken in
                opposite ways. Agencies sell you their best people in the
                pitch, then staff your project with juniors. Marketplace
                freelancers compete on price, which means competing on
                shortcuts. An independent studio inverts both incentives: the
                person who wins your trust is the person who does the work, and
                the work has to be good enough to carry the studio&apos;s entire
                reputation.
              </p>
              <p className="prose-justify leading-relaxed text-muted">
                When additional expertise is required, say specialised design,
                illustration or a second pair of engineering hands, I collaborate
                with a trusted network of designers and developers I&apos;ve
                worked with for years. But architecture, quality and
                accountability always stay with me.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6">
              <SectionHeading eyebrow="Why It Works" title="The independent advantage." />
              <ul className="flex flex-col gap-5">
                <li className="glass rounded-md p-6">
                  <h3 className="mb-1.5 font-semibold">Direct communication</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    You talk to the engineer, not an account manager relaying
                    messages. Questions get answered the same day, in plain
                    language, by the person who actually knows.
                  </p>
                </li>
                <li className="glass rounded-md p-6">
                  <h3 className="mb-1.5 font-semibold">No overhead in your invoice</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Agency pricing pays for office space, sales teams and
                    management layers. Studio pricing pays for engineering.
                    Same budget, more software.
                  </p>
                </li>
                <li className="glass rounded-md p-6">
                  <h3 className="mb-1.5 font-semibold">Decisions made by a builder</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    Every scope, estimate and architectural choice is made by
                    someone who will personally implement it. That is why
                    estimates hold and promises get kept.
                  </p>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Principles"
              title="How the studio operates."
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <StaggerItem key={p.title}>
                <div className="card-hover glass h-full rounded-md p-7">
                  <h3 className="mb-2 text-lg font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaSection
        title="Let's talk about your project."
        lead="A discovery call is a conversation, not a pitch. Bring your problem. You'll leave with an honest assessment either way."
      />
    </>
  );
}
