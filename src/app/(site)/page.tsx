import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { CtaSection } from "@/components/CtaSection";
import { ProcessDiagram } from "@/components/ProcessDiagram";
import { ProjectShot } from "@/components/ProjectVisual";
import { Price } from "@/components/Price";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem, Counter } from "@/components/motion";
import {
  ArrowLink,
  ButtonLink,
  Eyebrow,
  SectionHeading,
} from "@/components/ui";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { featuredTools, TOOL_COUNT } from "@/data/tools";

const byslug = Object.fromEntries(services.map((s) => [s.slug, s]));

const serviceGroups = [
  {
    no: "01",
    title: "Websites & stores",
    note: "Marketing sites, landing pages and commerce, built to convert.",
    slugs: [
      "business-websites",
      "landing-page-development",
      "portfolio-websites",
      "ecommerce",
      "website-redesign",
    ],
  },
  {
    no: "02",
    title: "Applications & platforms",
    note: "Custom software shaped around how your business actually works.",
    slugs: [
      "web-applications",
      "learning-management-systems",
      "admin-dashboards",
      "crm",
      "erp",
      "mobile-apps",
      "ai-integrations",
    ],
  },
  {
    no: "03",
    title: "Performance & care",
    note: "Make an existing site fast, findable and looked-after.",
    slugs: ["website-performance", "website-maintenance"],
  },
];

const advantages = [
  {
    title: "You work with the founder",
    body: "No account managers, no handoffs, no telephone game. The person you brief is the person engineering your software.",
  },
  {
    title: "Performance is the default",
    body: "Sub-second loads and 95+ Lighthouse scores as standard, not an upsell. Speed is a ranking factor and a trust signal.",
  },
  {
    title: "Built to be found",
    body: "Semantic HTML, schema markup and structures designed for search, engineered in from day one rather than retrofitted.",
  },
  {
    title: "Yours to keep",
    body: "Clean architecture, documented handover and a support period on every project. You own the code completely.",
  },
];

const metrics = [
  { value: 7, suffix: "", label: "Products designed, built and shipped" },
  { value: 120, suffix: "+", label: "Countries reached — Flaming Logistiks" },
  { value: 450, suffix: "", label: "Destinations shipped — Triplipi" },
  { value: 100, suffix: "%", label: "Code and IP ownership, always yours" },
];

const homeFaqs = [
  {
    q: "Who actually builds my project?",
    a: "The founder, Abhinav Saxena, personally. Kodinav is an independent studio, not an agency that hands your work to juniors. You talk to, and are built for by, the same engineer throughout.",
  },
  {
    q: "How much does a project cost?",
    a: "Projects start from ₹75,000 (about $2,000) and scale with scope. After a short discovery call you receive a fixed, itemised quote naming every screen and workflow. Nothing vague, nothing added mid-project.",
  },
  {
    q: "How long does it take?",
    a: "A typical business website runs 3 to 6 weeks from discovery to launch. Web applications and platforms are sliced so you see working software in weeks, and are scoped individually with a fixed quote.",
  },
  {
    q: "Do I own the code?",
    a: "Completely. Full source code, documentation and infrastructure access are handed over at launch. Every project includes a support period, and you are never locked in.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. The studio is based in India and works with businesses in the US, the UAE and worldwide — one engineer accountable across every timezone.",
  },
];

export default function Home() {
  const feature = projects.slice(0, 2);
  const rest = projects.slice(2);

  return (
    <>
      <Hero />

      {/* ---- Clients marquee: honest, real, shipped ---- */}
      <section className="border-y border-line-strong bg-surface/40 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 sm:px-8">
          <p className="annotation text-center">
            Real, shipped software for real businesses — across three continents
          </p>
          <div className="marquee-mask relative overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
              {[...projects, ...projects].map((p, i) => (
                <span key={i} className="flex items-center gap-8">
                  <span className="flex items-baseline gap-2.5">
                    <span className="font-display text-lg tracking-tight text-foreground/85">
                      {p.name}
                    </span>
                    <span className="annotation">{p.category}</span>
                  </span>
                  <span aria-hidden className="crosshair opacity-60" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Selected work ---- */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="No. 01 · Selected work"
              title="Real projects, real outcomes."
              lead="Every project below is live software you can open, not a mockup. Screenshots are the real thing."
            />
            <ArrowLink href="/work" className="mb-2">
              All case files
            </ArrowLink>
          </div>
        </Reveal>

        {/* two featured, with real screenshots */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {feature.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                href={`/work/${p.slug}`}
                className="card-hover group flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface-raised"
              >
                <ProjectShot
                  image={p.images.cover}
                  caption={p.name}
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 620px"
                />
                <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="annotation">{p.industry}</span>
                    <span
                      aria-hidden
                      className="font-mono text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                    >
                      ↗
                    </span>
                  </div>
                  <h3 className="font-display text-2xl tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent sm:text-3xl">
                    {p.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{p.summary}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    {p.stack.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-[3px] border border-line px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-faint"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* index of the rest */}
        <div className="mt-8 border-t border-line-strong">
          {rest.map((p, i) => (
            <Reveal key={p.slug} y={16}>
              <Link
                href={`/work/${p.slug}`}
                className="group grid items-center gap-x-6 gap-y-2 border-b border-line py-6 transition-colors duration-300 hover:bg-surface/50 active:opacity-70 lg:grid-cols-[3rem_1fr_16rem_2rem]"
              >
                <span className="font-mono text-xs text-faint">
                  {String(i + 3).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl leading-tight tracking-tight transition-colors duration-300 group-hover:text-accent sm:text-3xl">
                  {p.name}
                </h3>
                <div className="hidden flex-col gap-1 lg:flex">
                  <span className="annotation">{p.industry}</span>
                  <span className="annotation text-foreground/50">
                    {p.stack.slice(0, 3).join(" · ")} · {p.year}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="hidden font-mono text-xl text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent lg:block"
                >
                  ↗
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Services ---- */}
      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="No. 02 · Capabilities"
                title={
                  <>
                    One studio. The <span className="text-gradient">full</span>{" "}
                    stack.
                  </>
                }
                lead="From a five-page business website to a full ERP. Designed, engineered, deployed and supported under one roof."
              />
              <ArrowLink href="/services" className="mb-2">
                All {services.length} services
              </ArrowLink>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-3">
            {serviceGroups.map((g) => (
              <StaggerItem key={g.no} className="flex flex-col bg-background p-7 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[0.625rem] text-accent">
                    {g.no}
                  </span>
                  <span className="annotation">{g.slugs.length} services</span>
                </div>
                <h3 className="mt-4 font-display text-xl tracking-tight text-foreground sm:text-2xl">
                  {g.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{g.note}</p>
                <ul className="mt-6 flex flex-col border-t border-line">
                  {g.slugs.map((slug) => {
                    const s = byslug[slug];
                    if (!s) return null;
                    return (
                      <li key={slug} className="border-b border-line">
                        <Link
                          href={`/services/${slug}`}
                          className="group flex items-center justify-between gap-3 py-2.5 text-sm text-muted transition-colors hover:text-accent"
                        >
                          {s.name}
                          <span
                            aria-hidden
                            className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- Process ---- */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal className="mb-14 max-w-3xl">
            <SectionHeading
              eyebrow="No. 03 · How the work happens"
              title="A deliberate process, not a black box."
              lead="You always know what is happening and why. Written scopes make fixed quotes possible and surprises impossible."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ProcessDiagram />
          </Reveal>
        </div>
      </section>

      {/* ---- Why independent — DARK emphasis band ---- */}
      <section className="ink bg-noise relative overflow-hidden border-t border-line-strong">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <div>
              <Reveal>
                <SectionHeading
                  eyebrow="No. 04 · The difference"
                  title={
                    <>
                      Independent{" "}
                      <span className="text-gradient">by design</span>.
                    </>
                  }
                  lead="Not a freelancer juggling twenty gigs. Not an agency where juniors do the work. An independent studio has a different incentive: every project carries the founder's name."
                />
              </Reveal>
              <Stagger className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
                {advantages.map((a, i) => (
                  <StaggerItem key={a.title}>
                    <div className="flex flex-col gap-2.5 border-t border-line-strong pt-5">
                      <span className="font-mono text-[0.625rem] text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-medium tracking-tight text-foreground">
                        {a.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">{a.body}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* terminal / code-inspired accent */}
            <Reveal delay={0.1} className="lg:pt-4">
              <div className="overflow-hidden rounded-md border border-line-strong bg-[#0d0e12] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                  <span className="size-2.5 rounded-full border border-line-strong" />
                  <span className="size-2.5 rounded-full border border-line-strong" />
                  <span className="size-2.5 rounded-full bg-foreground/20" />
                  <span className="mx-auto font-mono text-[0.55rem] tracking-[0.2em] text-faint uppercase">
                    build.log
                  </span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-relaxed text-muted">
                  <code>
                    <span className="text-accent">$</span> kodinav ship
                    --project client{"\n"}
                    <span className="text-accent">✓</span> 47 pages statically
                    rendered{"\n"}
                    <span className="text-accent">✓</span> Lighthouse
                    <span className="text-foreground">
                      {"  "}98 · 100 · 100 · 100
                    </span>
                    {"\n"}
                    <span className="text-accent">✓</span> First-load JS
                    <span className="text-foreground">{"  "}84 kB</span>
                    {"\n"}
                    <span className="text-accent">✓</span> Core Web Vitals
                    <span className="text-foreground">{"  "}all green</span>
                    {"\n"}
                    <span className="text-accent">✓</span> Deployed to production
                    in <span className="text-foreground">42s</span>
                    <span className="animate-blink text-accent">▋</span>
                  </code>
                </pre>
                <div className="border-t border-line px-5 py-3">
                  <p className="annotation">Illustrative build output</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Metrics — real, cited numbers ---- */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal className="mb-12">
            <Eyebrow>No. 05 · By the numbers</Eyebrow>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="flex flex-col gap-3">
                  <span className="tabular font-display text-[clamp(3rem,7vw,4.5rem)] leading-[0.9] text-foreground">
                    <Counter value={m.value} suffix={m.suffix} />
                    <span className="text-accent">.</span>
                  </span>
                  <span className="text-sm leading-snug text-muted">{m.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Founder note ---- */}
      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <figure className="relative mx-auto w-full max-w-xs">
                <span aria-hidden className="crosshair absolute -top-3 -left-3 z-10" />
                <span aria-hidden className="crosshair absolute -right-3 -bottom-3 z-10" />
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-md border border-line-strong bg-surface-raised">
                  <Image
                    src="/founder.jpg"
                    alt={`${site.founder} — founder and software engineer, Kodinav`}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 flex items-center justify-between">
                  <span className="annotation">{site.founder}</span>
                  <span className="annotation text-faint">Founder</span>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col items-start gap-7">
                <Eyebrow>No. 06 · A note from the studio</Eyebrow>
                <blockquote className="font-serif text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.25] text-foreground italic">
                  &ldquo;I would rather show you seven projects I actually built
                  than claim a hundred I did not. Every screen on this site links
                  to real, running software.&rdquo;
                </blockquote>
                <p className="max-w-xl leading-relaxed text-muted">
                  Kodinav is an independent software studio founded by{" "}
                  <span className="text-foreground">{site.founder}</span>, one
                  experienced engineer who designs, architects and builds every
                  project personally. Direct communication, decisions explained in
                  plain language, and software built by someone whose reputation
                  depends on it working.
                </p>
                <ArrowLink href="/about">More about the studio</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Free tools ---- */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-md">
                <Eyebrow>No. 07 · Free tools</Eyebrow>
                <h2 className="mt-5 text-3xl sm:text-4xl">
                  {TOOL_COUNT} free tools. No signup.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Built for our own work, opened to everyone. Most run entirely in
                  your browser and store nothing.
                </p>
              </div>
              <ul className="grid flex-1 gap-x-10 sm:grid-cols-2 lg:max-w-2xl">
                {featuredTools.slice(0, 6).map((t) => (
                  <li key={t.href} className="border-b border-line">
                    <Link
                      href={t.href}
                      className="group flex items-baseline justify-between gap-4 py-3.5 text-sm text-muted transition-colors hover:text-accent"
                    >
                      {t.name}
                      <span
                        aria-hidden
                        className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                      >
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="border-b border-line sm:col-span-2">
                  <Link
                    href="/free-tools"
                    className="group flex items-baseline justify-between gap-4 py-3.5 font-mono text-xs tracking-[0.14em] text-accent uppercase"
                  >
                    All {TOOL_COUNT} tools
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Pricing ---- */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <SectionHeading
                eyebrow="No. 08 · Pricing"
                title="Honest pricing, fixed quotes."
                lead="After a discovery call you receive a fixed, itemised quote. Every screen and workflow named, nothing vague, nothing added mid-project."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col items-start gap-5 lg:items-end">
                <p className="font-display text-5xl tracking-tight sm:text-6xl">
                  <Price inr={site.priceFloor} usd={site.priceFloorUsd} />
                  <span className="font-serif text-3xl text-accent italic">
                    {" "}
                    onwards
                  </span>
                </p>
                <ButtonLink href="/pricing" variant="outline">
                  How pricing works
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <Link
              href="/free-website-audit"
              className="group flex flex-col items-start justify-between gap-4 border-y border-line py-6 sm:flex-row sm:items-center"
            >
              <p className="text-lg leading-relaxed text-muted">
                <span className="text-foreground">Not ready for a full project?</span>{" "}
                See what your current website is costing you, free, in about sixty
                seconds.
              </p>
              <span className="inline-flex shrink-0 items-center gap-2 font-mono text-xs tracking-[0.14em] text-accent uppercase transition-transform duration-300 group-hover:translate-x-1">
                Run the free audit →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <SectionHeading
                eyebrow="No. 09 · Questions"
                title="The things people ask first."
                lead="If your question isn't here, a discovery call is the fastest way to a straight answer."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Faq items={homeFaqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
