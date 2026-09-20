import Image from "next/image";
import Link from "next/link";
import sitemap from "@/app/sitemap";
import { Hero } from "@/components/Hero";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { WorkLedger, type LedgerEntry } from "@/components/home/WorkLedger";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";
import { featuredPosts, posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { toolGroups, toolsByGroup, TOOL_COUNT } from "@/data/tools";
import { capitalize, numberWord } from "@/lib/words";

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

/* Each principle carries the thing that lets you check it. */
const principles = [
  {
    title: "You work with the founder",
    body: "No account managers, no handoffs, no telephone game. The person you brief is the person engineering your software.",
    proof: { label: "About the studio", href: "/about" },
  },
  {
    title: "Performance is the default",
    body: "Sub-second loads and green Core Web Vitals as standard, not an upsell. The panel at the top of this page is this site's own reading, taken in your browser.",
    proof: { label: "See this page's live numbers", href: "#instrument" },
  },
  {
    title: "Built to be found",
    body: "Semantic HTML, structured data and a structure designed for search, engineered in from day one rather than retrofitted.",
    proof: { label: "Audit this site with our own tool", href: "/free-website-audit?url=kodinav.com" },
  },
  {
    title: "Yours to keep",
    body: "Clean architecture, documented handover and a support period on every project. You own the code completely.",
    proof: { label: "github.com/kodinav", href: "https://github.com/kodinav", external: true },
  },
];

const founderFacts = [
  { k: "Founder", v: site.founder },
  { k: "Based", v: "Delhi NCR, India" },
  { k: "Working with", v: "Hong Kong · Taiwan · US · UAE · India" },
  { k: "Replies", v: "within one business day" },
  { k: "Since", v: "2024" },
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
    a: "Yes. The studio is based in India and works with businesses in Hong Kong, Taiwan, the US, the UAE and worldwide — one engineer accountable across every timezone. Websites can be built in English, Traditional Chinese or both.",
  },
];

export default function Home() {
  // Real counts, from the same data the site is built from.
  const pageCount = sitemap().length;

  const ledger: LedgerEntry[] = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    industry: p.industry,
    year: p.year,
    summary: p.summary,
    stack: p.stack.slice(0, 4),
    cover: p.images.cover,
    result: p.caseStudy.results[0] ?? null,
    url: p.url,
  }));

  return (
    <>
      <Hero pageCount={pageCount} toolCount={TOOL_COUNT} productCount={projects.length} />

      {/* ---- 01 · Work ---- */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="01 — Work"
              title={`${capitalize(numberWord(projects.length))} products, all live.`}
              lead="Every one is running software you can open, not a mockup. The figure beside each screenshot is taken from its case file."
            />
            <ArrowLink href="/work" className="mb-2">
              All case files
            </ArrowLink>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="mt-12">
          <WorkLedger entries={ledger} />
        </Reveal>
      </section>

      {/* ---- 02 · How it's built: capabilities + principles with proof ---- */}
      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="02 — Capabilities"
                title={
                  <>
                    One studio. The <span className="text-accent">full</span> stack.
                  </>
                }
                lead="From a five-page business website to a full ERP. Designed, engineered, deployed and supported under one roof."
              />
              <ArrowLink href="/services" className="mb-2">
                All {services.length} services
              </ArrowLink>
            </div>
          </Reveal>

          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-[2px] border border-line bg-line lg:grid-cols-3">
            {serviceGroups.map((g) => (
              <StaggerItem key={g.no} className="flex flex-col bg-background p-6 sm:p-7">
                <div className="flex items-baseline justify-between">
                  <span className="spec tabular text-accent">{g.no}</span>
                  <span className="spec">{g.slugs.length} services</span>
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
                          prefetch={false}
                          className="group flex items-baseline justify-between gap-3 py-2.5 text-sm text-muted transition-colors hover:text-accent"
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

          <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-4">
              <SectionHeading
                eyebrow="03 — The difference"
                title="Independent by design."
                lead="Not a freelancer juggling twenty gigs. Not an agency where juniors do the work. Every project carries the founder's name — so every claim below comes with a way to check it."
              />
            </Reveal>
            <Stagger className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-8">
              {principles.map((a, i) => (
                <StaggerItem key={a.title}>
                  <div className="flex h-full flex-col gap-3 border-t border-line-strong pt-5">
                    <span className="spec tabular text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-lg tracking-tight text-foreground">{a.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{a.body}</p>
                    <div className="mt-auto pt-2">
                      <ArrowLink href={a.proof.href} external={"external" in a.proof && a.proof.external}>
                        {a.proof.label}
                      </ArrowLink>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ---- 04 · Tools: the working index ---- */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="04 — Free tools"
                title={`${TOOL_COUNT} working tools. No signup.`}
                lead="Built for our own work, opened to everyone. Most run entirely in your browser and store nothing."
              />
              <ArrowLink href="/free-tools" className="mb-2">
                All tools
              </ArrowLink>
            </div>
          </Reveal>
          <Stagger className="mt-12 grid gap-x-10 gap-y-10 lg:grid-cols-3">
            {toolGroups.map((g) => (
              <StaggerItem key={g.id}>
                <p className="spec mb-3 text-accent">{g.eyebrow}</p>
                <ol className="border-t border-line-strong">
                  {toolsByGroup(g.id).map((t, i) => (
                    <li key={t.href} className="border-b border-line">
                      <Link
                        href={t.href}
                        prefetch={false}
                        className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 py-2.5 text-sm text-foreground/85 transition-colors hover:text-accent"
                      >
                        <span className="spec tabular text-faint">{String(i + 1).padStart(2, "0")}</span>
                        <span>{t.name}</span>
                        <span
                          aria-hidden
                          className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                        >
                          ↗
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- 05 · Founder ---- */}
      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-4">
              <figure className="plate relative aspect-4/5 w-full max-w-sm overflow-hidden">
                <Image
                  src="/founder.jpg"
                  alt={`${site.founder} — founder and software engineer, Kodinav`}
                  fill
                  sizes="(max-width: 640px) 100vw, 384px"
                  className="object-cover"
                />
              </figure>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
              <div className="flex flex-col items-start gap-7">
                <Eyebrow>05 — The studio</Eyebrow>
                <h2 className="text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.02]">
                  I would rather show you {numberWord(projects.length)} projects I actually built than
                  claim a hundred I did not.
                </h2>
                <p className="max-w-xl leading-relaxed text-muted">
                  Kodinav is an independent software studio founded by{" "}
                  <span className="text-foreground">{site.founder}</span>, one
                  experienced engineer who designs, architects and builds every
                  project personally. Direct communication, decisions explained in
                  plain language, and software built by someone whose reputation
                  depends on it working.
                </p>
                <dl className="grid w-full max-w-xl grid-cols-1 gap-y-2 border-t border-line-strong pt-4 sm:grid-cols-2 sm:gap-x-8">
                  {founderFacts.map((f) => (
                    <div key={f.k} className="flex items-baseline justify-between gap-4 border-b border-line py-1.5">
                      <dt className="spec">{f.k}</dt>
                      <dd className="text-right text-sm text-foreground">{f.v}</dd>
                    </div>
                  ))}
                </dl>
                <ArrowLink href="/about">More about the studio</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- 06 · Notes ---- */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="06 — Notes"
                title="Written from the work."
                lead="Honest guides on what software costs, how it is built and what to ask before you hire anyone."
              />
              <ArrowLink href="/blog" className="mb-2">
                All {posts.length} articles
              </ArrowLink>
            </div>
          </Reveal>
          <Stagger className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPosts.map((p) => (
              <StaggerItem key={p.slug} className="border-t border-line-strong">
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col gap-2 py-5">
                  <span className="spec">{p.tag}</span>
                  <h3 className="font-display text-lg leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <span className="spec mt-auto pt-2 text-faint">{p.readingTime} read</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- 07 · Questions ---- */}
      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5">
              <SectionHeading
                eyebrow="07 — Questions"
                title="The things people ask first."
                lead="If your question isn't here, a discovery call is the fastest way to a straight answer."
              />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <Faq items={homeFaqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
