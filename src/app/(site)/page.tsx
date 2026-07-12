import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { TechStack } from "@/components/TechStack";
import { CtaSection } from "@/components/CtaSection";
import { ProjectShot } from "@/components/ProjectVisual";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";

const industries = [
  "Coaching Institutes",
  "Schools & Universities",
  "Publishers",
  "Clinics & Hospitals",
  "Startups",
  "Hotels & Restaurants",
  "Real Estate",
  "Manufacturing",
  "NGOs",
];

const whyPoints = [
  {
    title: "You work with the founder",
    body: "No account managers, no handoffs, no telephone game. The person you talk to is the person engineering your software.",
  },
  {
    title: "Performance-first development",
    body: "Sub-second loads and 95+ Lighthouse scores as the default, not an upsell. Speed is a ranking factor and a trust signal.",
  },
  {
    title: "SEO-ready architecture",
    body: "Semantic HTML, schema markup and page structures designed to rank. Engineered in from day one, not retrofitted.",
  },
  {
    title: "Built to scale, built to last",
    body: "Clean architecture and maintainable code, so your software grows with the business instead of being rebuilt every two years.",
  },
  {
    title: "Security-first mindset",
    body: "Role-based access, audited dependencies and careful data handling, because your customers' data is your reputation.",
  },
  {
    title: "Transparent communication",
    body: "Written scopes, honest timelines, and plain-language explanations of every technical decision. No surprises mid-project.",
  },
  {
    title: "Long-term support",
    body: "Every project includes a support period, and you own the code completely. Most clients stay for years. By choice, not lock-in.",
  },
  {
    title: "Business-focused solutions",
    body: "Software is a means to an outcome: more admissions, more bookings, fewer manual hours. That outcome is the spec.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Industries strip */}
      <section
        aria-label="Industries served"
        className="border-b border-line py-4"
      >
        <div className="marquee-mask overflow-hidden">
          <div
            className="animate-marquee flex w-max gap-10 pr-10"
            style={{ animationDuration: "48s" }}
          >
            {[...industries, ...industries].map((ind, i) => (
              <span
                key={i}
                aria-hidden={i >= industries.length}
                className="annotation flex items-center gap-10 whitespace-nowrap"
              >
                <span aria-hidden className="text-accent">
                  ✳
                </span>
                Serving {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work — index rows */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Fig. 01 — Selected Work"
              title="Real projects, real outcomes."
            />
            <ArrowLink href="/work" className="mb-2">
              All case files
            </ArrowLink>
          </div>
        </Reveal>

        <div className="mt-14 border-t border-line-strong">
          {projects.map((p, i) => (
            <Reveal key={p.slug} y={16}>
              <Link
                href={`/work/${p.slug}`}
                className="group grid items-center gap-x-6 gap-y-4 border-b border-line py-7 transition-colors duration-300 active:opacity-70 sm:py-10 lg:grid-cols-[5rem_1fr_16rem_2rem]"
              >
                <span className="flex items-center justify-between font-mono text-xs text-faint">
                  /{String(i + 1).padStart(3, "0")}
                  <span
                    aria-hidden
                    className="text-lg text-accent lg:hidden"
                  >
                    ↗
                  </span>
                </span>
                <div>
                  <h3 className="font-display text-[clamp(2.1rem,9vw,3.75rem)] leading-none uppercase transition-colors duration-300 group-hover:text-accent lg:text-7xl">
                    {p.name}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted lg:hidden">
                    {p.summary}
                  </p>
                </div>
                <div className="hidden flex-col gap-1.5 lg:flex">
                  <span className="annotation">{p.industry}</span>
                  <span className="annotation text-foreground/60">
                    {p.stack.slice(0, 3).join(" · ")} — {p.year}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="hidden font-mono text-2xl text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent lg:block"
                >
                  ↗
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* featured visual under the index */}
        <Reveal className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]" delay={0.1}>
          <ProjectShot
            image={projects[0].images.cover}
            caption={projects[0].name}
            sizes="(max-width: 1024px) 100vw, 720px"
          />
          <div className="ink flex flex-col justify-between gap-6 p-7">
            <p className="annotation">From the files</p>
            <p className="font-serif text-2xl leading-snug italic sm:text-3xl">
              &ldquo;Every case file follows the same honest structure: the
              business problem, what was built, and what actually changed.&rdquo;
            </p>
            <ButtonLink
              href={`/work/${projects[0].slug}`}
              variant="outline"
              className="w-fit border-line-strong text-foreground"
            >
              Open File 001
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* Services */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Fig. 02 — Services"
              title="One studio. The full stack."
              lead="From a five-page business website to a full ERP. Designed, engineered, deployed and supported under one roof."
            />
          </Reveal>
          <Stagger className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <StaggerItem key={s.slug} className="bg-background">
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col gap-4 p-6 transition-colors duration-300 hover:bg-surface-raised active:bg-surface-raised sm:p-7"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[0.625rem] text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    >
                      ↗
                    </span>
                  </div>
                  <h3 className="font-display text-2xl leading-none uppercase transition-colors duration-300 group-hover:text-accent">
                    {s.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{s.short}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process link band */}
      <Link
        href="/process"
        className="group block border-t border-line-strong bg-accent text-[#16140f] transition-colors duration-300 hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-7 sm:px-8 sm:py-8">
          <span className="font-display text-[clamp(1.35rem,5.4vw,1.5rem)] uppercase sm:text-4xl">
            The 09-step process — no surprises
          </span>
          <span
            aria-hidden
            className="font-mono text-3xl transition-transform duration-300 group-hover:translate-x-2"
          >
            →
          </span>
        </div>
      </Link>

      {/* Why Kodinav */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Fig. 03 — Why Kodinav"
              title="Independent by design."
              lead="Not a freelancer juggling twenty gigs. Not an agency where juniors do the work. An independent studio has a different incentive: every project carries the founder's name."
            />
          </Reveal>
          <Stagger className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {whyPoints.map((point, i) => (
              <StaggerItem key={point.title}>
                <div className="flex h-full flex-col gap-3 border-t border-line-strong pt-5">
                  <span className="font-mono text-[0.625rem] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-medium tracking-tight">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {point.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Founder — ink band */}
      <section className="ink bg-noise relative overflow-hidden border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <figure className="relative mx-auto w-full max-w-sm border border-line-strong bg-surface-raised p-3">
                <div className="relative aspect-4/5 w-full overflow-hidden border border-line-strong">
                  <Image
                    src="/founder.jpg"
                    alt={`${site.founder} — founder and software engineer, Kodinav`}
                    fill
                    sizes="(max-width: 640px) 100vw, 384px"
                    className="object-cover"
                  />
                </div>
                <span aria-hidden className="crosshair absolute -top-1.5 -left-1.5 text-line-strong" />
                <span aria-hidden className="crosshair absolute -top-1.5 -right-1.5 text-line-strong" />
                <span aria-hidden className="crosshair absolute -bottom-1.5 -left-1.5 text-line-strong" />
                <span aria-hidden className="crosshair absolute -right-1.5 -bottom-1.5 text-line-strong" />
                <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-3">
                  <span className="annotation">Fig. A — {site.founder}</span>
                  <span className="annotation text-faint">Founder</span>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col items-start gap-7">
                <Eyebrow>Fig. 04 — The Studio</Eyebrow>
                <h2 className="text-5xl sm:text-6xl">
                  Every project is <span className="text-gradient">personal</span>.
                </h2>
                <p className="text-pretty text-lg leading-relaxed text-muted">
                  Kodinav is an independent software studio founded by{" "}
                  <span className="text-foreground">{site.founder}</span>, one
                  experienced engineer who designs, architects and builds every
                  project personally. Direct communication, decisions explained
                  in plain language, and software built by someone whose
                  reputation depends on it working.
                </p>
                <p className="text-pretty leading-relaxed text-muted">
                  When additional expertise is required, I collaborate with a
                  trusted network of designers and developers. But ownership,
                  quality and accountability always stay with me.
                </p>
                <ArrowLink href="/about">More about the studio</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <SectionHeading
              eyebrow="Fig. 05 — Technology"
              title="Boring where it should be. Modern where it matters."
              lead="Proven, widely-adopted technologies chosen for longevity. Any competent engineer can maintain what I build, and you're never held hostage by an exotic stack."
            />
          </Reveal>
          <div className="mt-14">
            <TechStack />
          </div>
        </div>
      </section>

      {/* Studio note */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <Eyebrow>Fig. 06 — A Note From The Studio</Eyebrow>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <blockquote className="max-w-4xl">
              <p className="font-serif text-2xl leading-snug text-pretty italic sm:text-4xl">
                I&apos;d rather show you four projects I actually built than
                claim a hundred I didn&apos;t. Every screen on this page links
                to real, running software: a language platform, an EdTech
                library, a travel product, an online store. If we work together,
                yours joins them.
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-accent" />
                <span className="annotation text-foreground/80">
                  {site.founder} — Founder, {site.name}
                </span>
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Pricing note */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <SectionHeading
                eyebrow="Fig. 07 — Pricing"
                title="Honest pricing, fixed quotes."
                lead="After a discovery call you receive a fixed, itemised quote. Every screen and workflow named, nothing vague, nothing added mid-project."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col items-start gap-5 lg:items-end">
                <p className="font-display text-6xl uppercase sm:text-7xl">
                  {site.priceFloor}
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

          {/* Audit front-door offer — the low-commitment entry point */}
          <Reveal className="mt-10">
            <Link
              href="/website-audit"
              className="card-hover ink group flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10"
            >
              <div className="flex flex-col gap-3">
                <p className="annotation flex items-center gap-3">
                  <span className="crosshair text-accent" aria-hidden />
                  Not ready for a full project?
                </p>
                <h3 className="font-display text-3xl uppercase sm:text-4xl">
                  Start with a{" "}
                  <span className="text-gradient">{site.audit.priceUsd} website audit</span>.
                </h3>
                <p className="max-w-xl leading-relaxed text-muted">
                  A real engineer tells you exactly why your site is slow,
                  invisible on Google, or losing enquiries, with a prioritised
                  fix list. Delivered in {site.audit.turnaround}. Fee credited
                  toward the fixes if you go ahead.
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 border border-accent bg-accent px-6 py-3.5 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform group-hover:translate-x-1">
                Order audit →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
