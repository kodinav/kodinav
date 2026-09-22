import Image from "next/image";
import Link from "next/link";
import { DotSphere } from "@/components/DotSphere";
import { Faq } from "@/components/Faq";
import { LeadForm } from "@/components/LeadForm";
import { Price } from "@/components/Price";
import { ArrowLink, ButtonLink, Eyebrow } from "@/components/ui";
import { WorkList } from "@/components/WorkList";
import { homeFaq } from "@/data/homeFaq";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { TOOL_COUNT } from "@/data/tools";
import { faqSchema } from "@/lib/schema";

/**
 * Home. Title, description, canonical and Open Graph come from the root
 * metadata, and the organisation / founder / website JSON-LD from
 * RootDocument; this page adds the FAQ it answers.
 *
 * Built for the person deciding whether to spend their own money: what is
 * built, proof it works, the price and the time, the person, and a way in.
 * Everything here is a claim the site already makes; nothing is invented.
 */
const steps = [
  {
    n: "01",
    title: "A short call",
    body: "You explain the business and what is stuck. No deck, no sales team: you talk to the engineer who would build it.",
  },
  {
    n: "02",
    title: "A fixed, written quote",
    body: "Every screen and workflow is named and priced. Nothing vague, nothing added mid-project.",
  },
  {
    n: "03",
    title: "Launch, then support",
    body: "A typical business website is live in three to six weeks. Source code, documentation and access are handed over: you own it completely.",
  },
];

export default function Home() {
  const work = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    industry: p.industry.split(" · ")[0],
    year: p.year,
    summary: p.summary,
    cover: p.images.cover,
    url: p.url,
  }));
  const first = site.founder.split(" ")[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(homeFaq)) }} />

      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden pt-36 pb-10 sm:pt-44 sm:pb-14">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)] lg:items-end">
            <div data-reveal>
              <Eyebrow>Independent software studio · India · Hong Kong · Taiwan</Eyebrow>
              <h1 className="mt-7 text-balance text-[clamp(2.7rem,7.1vw,7.4rem)] leading-[0.94] tracking-[-0.035em]">
                Websites, web apps and mobile apps, <span className="text-gradient">built by one engineer.</span>
              </h1>
              <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">
                A fixed, written quote. A typical business website live in three to six weeks. You own the code. Projects
                start from <Price inr={site.priceFloor} usd={site.priceFloorUsd} />.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href={site.whatsapp} external size="lg">
                  WhatsApp {first}
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline" size="lg">
                  Book a discovery call
                </ButtonLink>
              </div>
            </div>
            <div className="relative" data-reveal>
              <DotSphere className="mx-auto block aspect-square w-full max-w-[420px] text-foreground lg:ml-auto" />
              <dl className="spec">
                <div>
                  <dt>Quote</dt>
                  <dd>Fixed, itemised, in writing</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>3 to 6 weeks for a business website</dd>
                </div>
                <div>
                  <dt>Ownership</dt>
                  <dd>Source, docs and access handed over</dd>
                </div>
                <div>
                  <dt>Reply</dt>
                  <dd>Within one business day</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="marquee mt-16 border-y border-line" aria-hidden>
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span key={k} className="marquee-set">
                {services.map((s) => (
                  <span key={s.slug}>
                    {s.name}
                    <i>·</i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- the work ---------------- */}
      <section id="work" className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6" data-reveal>
          <div>
            <Eyebrow>Selected work · {projects.length} projects</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4.6vw,4rem)] leading-[1]">
              Real projects, <span className="text-gradient">built and shipped.</span>
            </h2>
          </div>
          <ArrowLink href="/work">All case files</ArrowLink>
        </div>
        <div className="mb-14 grid gap-5 sm:grid-cols-2" data-reveal>
          {projects.slice(0, 2).map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="cover group">
              <Image src={p.images.cover.src} alt={p.images.cover.alt} width={1600} height={1000} sizes="(max-width: 640px) 92vw, 46vw" priority />
              <span className="cover-cap">
                <span>{p.name}</span>
                <span className="annotation">{p.industry.split(" · ")[0]} · {p.year}</span>
              </span>
            </Link>
          ))}
        </div>
        <div data-reveal>
          <WorkList items={work} />
        </div>
      </section>

      {/* ---------------- services ---------------- */}
      <section className="ink">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">
            <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
              <Eyebrow>Services · {services.length}</Eyebrow>
              <h2 className="mt-5 text-[clamp(2rem,4.6vw,4rem)] leading-[1]">
                From a five-page site <span className="text-gradient">to a full ERP.</span>
              </h2>
              <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted">
                Business websites, landing pages and stores. Web applications, learning platforms, CRMs, ERPs, dashboards
                and mobile apps. Performance, search and care for what already exists. All quoted the same way: every
                screen named, every price fixed.
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                <ArrowLink href="/services">All services</ArrowLink>
                <ArrowLink href="/free-tools">{TOOL_COUNT} free tools</ArrowLink>
              </div>
            </div>
            <ol className="svc" data-reveal>
              {services.map((s, i) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>
                    <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="body">
                      <span className="name">{s.name}</span>
                      <span className="short">{s.short}</span>
                    </span>
                    <span className="go" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- how it works ---------------- */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">
          <div data-reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4.6vw,4rem)] leading-[1]">
              Three steps, <span className="text-gradient">no surprises.</span>
            </h2>
          </div>
          <ol className="steps" data-reveal>
            {steps.map((s) => (
              <li key={s.n}>
                <span className="annotation">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- the person ---------------- */}
      <section className="border-y border-line">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)] lg:items-center">
          <div className="portrait" data-reveal>
            <Image src="/founder.jpg" alt={`${site.founder}, founder of ${site.name}`} width={800} height={800} sizes="(max-width: 1024px) 60vw, 340px" />
          </div>
          <div data-reveal>
            <Eyebrow>Who you deal with</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4.6vw,4rem)] leading-[1]">
              You talk to the person <span className="text-gradient">who builds it.</span>
            </h2>
            <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted sm:text-lg">
              I’m {site.founder}. {site.name} is an independent studio, not an agency that hands your work to juniors. No
              account managers, no handoffs: the engineer on your first call is the one who writes your software and
              answers when something needs fixing.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <ArrowLink href="/about">About me</ArrowLink>
              <ArrowLink href={`mailto:${site.email}`} external>
                {site.email}
              </ArrowLink>
              <ArrowLink href={`tel:${site.phoneRaw}`} external>
                {site.phone}
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- the numbers ---------------- */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
        <dl className="figures" data-reveal>
          <div>
            <dd>{projects.length}</dd>
            <dt>Projects, live and documented</dt>
          </div>
          <div>
            <dd>{services.length}</dd>
            <dt>Services, each with a fixed quote</dt>
          </div>
          <div>
            <dd>{TOOL_COUNT}</dd>
            <dt>Free tools for business websites</dt>
          </div>
          <div>
            <dd>1</dd>
            <dt>Engineer, start to finish</dt>
          </div>
        </dl>
        <div className="mt-12 grid gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" data-reveal>
          <div>
            <Eyebrow>What it costs</Eyebrow>
            <h2 className="mt-5 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.02]">
              From <Price inr={site.priceFloor} usd={site.priceFloorUsd} />, <span className="text-gradient">fixed in writing.</span>
            </h2>
            <div className="mt-7 flex flex-wrap gap-6">
              <ArrowLink href="/pricing">How pricing works</ArrowLink>
              <ArrowLink href="/website-cost-calculator">Estimate your project</ArrowLink>
            </div>
          </div>
          <div className="audit">
            <p className="annotation">Not sure what you need?</p>
            <h3>Start with a website audit.</h3>
            <p>
              A real engineer tells you why your site is slow, invisible on Google or losing enquiries, with a prioritised
              fix list in {site.audit.turnaround}.
            </p>
            <ButtonLink href="/free-website-audit" variant="outline">
              See the audit
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ---------------- questions ---------------- */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">
          <div data-reveal>
            <Eyebrow>Fair questions</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4.6vw,4rem)] leading-[1]">
              What people <span className="text-gradient">ask first.</span>
            </h2>
          </div>
          <div data-reveal>
            <Faq items={homeFaq} />
          </div>
        </div>
      </section>

      {/* ---------------- the brief ---------------- */}
      <section id="brief" className="ink">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.3fr)]">
          <div data-reveal>
            <Eyebrow>Start here</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4.6vw,4rem)] leading-[1]">
              Tell me what <span className="text-gradient">you’re building.</span>
            </h2>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted sm:text-lg">
              You’ll hear back within one business day, from the engineer who would build it.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <ArrowLink href={site.whatsapp} external>
                Or message me on WhatsApp
              </ArrowLink>
            </div>
          </div>
          <div data-reveal>
            <LeadForm source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
