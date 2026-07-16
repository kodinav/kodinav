import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { CtaSection } from "@/components/CtaSection";
import { ProjectShot } from "@/components/ProjectVisual";
import { Price } from "@/components/Price";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { featuredTools, TOOL_COUNT } from "@/data/tools";

const whyPoints = [
  {
    title: "You work with the founder",
    body: "No account managers, no handoffs, no telephone game. The person you talk to is the person engineering your software.",
  },
  {
    title: "Performance first",
    body: "Sub-second loads and 95+ Lighthouse scores as the default, not an upsell. Speed is a ranking factor and a trust signal.",
  },
  {
    title: "Built to rank",
    body: "Semantic HTML, schema markup and page structures designed for search, engineered in from day one rather than retrofitted.",
  },
  {
    title: "Yours to keep",
    body: "Clean architecture, documented handover and a support period on every project. You own the code completely, and clients stay by choice.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Selected work — index rows */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="No. 01 · Selected Work"
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
                className="group grid items-center gap-x-6 gap-y-4 border-b border-line py-7 transition-colors duration-300 active:opacity-70 sm:py-9 lg:grid-cols-[5rem_1fr_16rem_2rem]"
              >
                <span className="flex items-center justify-between font-mono text-xs text-faint">
                  {String(i + 1).padStart(2, "0")}
                  <span aria-hidden className="text-lg text-brass lg:hidden">
                    ↗
                  </span>
                </span>
                <div>
 <h3 className="font-display text-[clamp(1.9rem,6.5vw,3.1rem)] leading-[1.05] tracking-tight transition-colors duration-300 group-hover:text-accent">
                    {p.name}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted lg:hidden">
                    {p.summary}
                  </p>
                </div>
                <div className="hidden flex-col gap-1.5 lg:flex">
                  <span className="annotation">{p.industry}</span>
                  <span className="annotation text-foreground/60">
                    {p.stack.slice(0, 3).join(" · ")} · {p.year}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="hidden font-mono text-2xl text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-brass lg:block"
                >
                  ↗
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* featured visual under the index */}
        <Reveal className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]" delay={0.1}>
          <ProjectShot
            image={projects[0].images.cover}
            caption={projects[0].name}
            sizes="(max-width: 1024px) 100vw, 720px"
          />
          <div className="ink flex flex-col justify-between gap-6 p-8">
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
              Open File 01
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* Services */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="No. 02 · Services"
                title="One studio. The full stack."
                lead="From a five-page business website to a full ERP. Designed, engineered, deployed and supported under one roof."
              />
              <ArrowLink href="/services" className="mb-2">
                All {services.length} services
              </ArrowLink>
            </div>
          </Reveal>
          <Stagger className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s, i) => (
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
                      className="font-mono text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brass"
                    >
                      ↗
                    </span>
                  </div>
 <h3 className="font-display text-2xl leading-tight tracking-tight transition-colors duration-300 group-hover:text-accent">
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
        className="group block border-t border-line-strong bg-accent text-accent-contrast transition-colors duration-300 hover:bg-foreground hover:text-background active:bg-foreground active:text-background"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-7 sm:px-8 sm:py-8">
 <span className="font-display text-[clamp(1.3rem,5vw,1.9rem)] tracking-tight">
            A nine-step process. Written scopes. No surprises.
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
              eyebrow="No. 03 · Why Kodinav"
              title="Independent by design."
              lead="Not a freelancer juggling twenty gigs. Not an agency where juniors do the work. An independent studio has a different incentive: every project carries the founder's name."
            />
          </Reveal>
          <Stagger className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {whyPoints.map((point, i) => (
              <StaggerItem key={point.title}>
                <div className="flex h-full flex-col gap-3 border-t border-line-strong pt-5">
                  <span className="font-mono text-[0.625rem] text-brass">
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
                <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-3">
                  <span className="annotation">{site.founder}</span>
                  <span className="annotation text-faint">Founder</span>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col items-start gap-7">
                <Eyebrow>No. 04 · The Studio</Eyebrow>
                <h2 className="text-4xl sm:text-6xl">
                  Every project is <span className="text-gradient">personal</span>.
                </h2>
                <p className="text-lg leading-relaxed text-muted">
                  Kodinav is an independent software studio founded by{" "}
                  <span className="text-foreground">{site.founder}</span>, one
                  experienced engineer who designs, architects and builds every
                  project personally. Direct communication, decisions explained
                  in plain language, and software built by someone whose
                  reputation depends on it working.
                </p>
                <p className="border-l-2 border-brass pl-5 font-serif text-xl italic leading-snug text-foreground/90 sm:text-2xl">
                  I would rather show you seven projects I actually built than
                  claim a hundred I did not. Every screen above links to real,
                  running software.
                </p>
                <ArrowLink href="/about" className="text-foreground">
                  More about the studio
                </ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Free tools — one quiet ledger row, not a second product */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-md">
                <Eyebrow>No. 05 · Free Tools</Eyebrow>
                <h2 className="mt-5 text-3xl sm:text-4xl">
                  {TOOL_COUNT} free tools. No signup.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Built for our own work, opened to everyone. Most run entirely
                  in your browser and store nothing.
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
                      <span aria-hidden className="text-faint transition-colors group-hover:text-brass">
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="border-b border-line sm:col-span-2">
                  <Link
                    href="/free-tools"
                    className="group flex items-baseline justify-between gap-4 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-accent"
                  >
                    All {TOOL_COUNT} tools
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <SectionHeading
                eyebrow="No. 06 · Pricing"
                title="Honest pricing, fixed quotes."
                lead="After a discovery call you receive a fixed, itemised quote. Every screen and workflow named, nothing vague, nothing added mid-project."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col items-start gap-5 lg:items-end">
 <p className="font-display text-5xl tracking-tight sm:text-6xl">
                  <Price inr={site.priceFloor} usd={site.priceFloorUsd} />
                  <span className="font-serif text-3xl text-brass italic">
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

          {/* Audit entry point, one line */}
          <Reveal className="mt-12">
            <Link
              href="/free-website-audit"
              className="group flex flex-col items-start justify-between gap-4 border-y border-line py-6 sm:flex-row sm:items-center"
            >
              <p className="text-lg leading-relaxed text-muted">
                <span className="text-foreground">
                  Not ready for a full project?
                </span>{" "}
                See what your current website is costing you, free, in about
                sixty seconds.
              </p>
              <span className="inline-flex shrink-0 items-center gap-2 font-mono text-xs tracking-[0.14em] text-accent uppercase transition-transform duration-300 group-hover:translate-x-1">
                Run the free audit →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
