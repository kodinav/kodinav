import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { LeadForm } from "@/components/LeadForm";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ProjectShot } from "@/components/ProjectVisual";
import { ArrowLink, ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { getProject } from "@/data/projects";
import { site } from "@/data/site";
import type { MarketContent } from "@/data/markets/types";
import { cjkWords } from "@/lib/cjk";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

/**
 * Market landing page for Hong Kong / Taiwan, in English or Traditional
 * Chinese. Every visible string comes from the content object; the template
 * owns layout and structured data only.
 *
 * Built for organic search and answer engines as much as for visitors: an
 * "at a glance" definition list states the facts plainly, prices are real
 * numbers in local currency, and all FAQ answers ship as HTML.
 */
export function MarketPage({ content: c }: { content: MarketContent }) {
  const url = `${site.url}${c.path}`;
  const words = (text: string) => cjkWords(text, c.locale);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: c.schema.name,
      description: c.schema.description,
      inLanguage: c.locale === "en" ? "en" : c.locale,
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#studio` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: c.schema.name,
      description: c.schema.description,
      serviceType: "Website and web application development",
      provider: { "@id": `${site.url}/#studio` },
      areaServed: c.schema.area,
      offers: {
        "@type": "Offer",
        url,
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: c.schema.minPrice,
          priceCurrency: c.schema.currency,
        },
      },
    },
    faqSchema(c.faq.items),
    {
      ...breadcrumbSchema([{ name: c.breadcrumb.current, path: c.path }]),
      // breadcrumbSchema always roots at the English "/"; translated pages
      // root at their own language home instead.
      ...(c.breadcrumb.home.href !== "/" && {
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: c.breadcrumb.home.name,
            item: `${site.url}${c.breadcrumb.home.href}`,
          },
          ...(c.breadcrumb.home.href === c.path
            ? []
            : [{ "@type": "ListItem", position: 2, name: c.breadcrumb.current, item: url }]),
        ],
      }),
    },
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      {/* ---- Hero ---- */}
      <section className="bg-noise relative overflow-hidden pt-32 pb-16 sm:pt-44 sm:pb-20">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
          {c.breadcrumb.home.href !== c.path && (
            <Breadcrumbs home={c.breadcrumb.home} items={[{ name: c.breadcrumb.current }]} />
          )}
          <Reveal className="flex flex-col items-start gap-7">
            <Eyebrow>{c.hero.eyebrow}</Eyebrow>
            <h1 className="max-w-4xl text-balance text-[clamp(2.4rem,6.4vw,4.6rem)] leading-[1.04]">
              {words(c.hero.title[0])}
              <span className="text-gradient inline-block">{words(c.hero.title[1])}</span>
              {words(c.hero.title[2])}
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">{c.hero.lead}</p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <ButtonLink href="#lead-form" size="lg">
                {c.hero.primaryCta}
              </ButtonLink>
              <ButtonLink
                href={c.hero.secondaryCta.href}
                variant="outline"
                size="lg"
                external={c.hero.secondaryCta.external}
              >
                {c.hero.secondaryCta.label}
              </ButtonLink>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {c.hero.notes.map((n) => (
                <li key={n} className="annotation flex items-center gap-2">
                  <span aria-hidden className="size-1.5 bg-accent" />
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---- At a glance ---- */}
      <section className="border-y border-line-strong bg-surface/40">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <SectionHeading eyebrow={c.facts.eyebrow} title={words(c.facts.title)} />
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <dl className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
              {c.facts.items.map((f) => (
                <div key={f.term} className="flex flex-col gap-1.5 bg-background p-5 sm:p-6">
                  <dt className="annotation">{f.term}</dt>
                  <dd className="leading-relaxed text-foreground">{f.detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---- Why ---- */}
      <section>
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow={c.why.eyebrow} title={words(c.why.title)} lead={c.why.lead} />
          </Reveal>
          <Stagger className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {c.why.items.map((w, i) => (
              <StaggerItem key={w.title}>
                <div className="flex flex-col gap-2.5 border-t border-line-strong pt-5">
                  <span className="font-mono text-[0.625rem] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-medium tracking-tight text-foreground">{w.title}</h3>
                  <p className="prose-justify text-sm leading-relaxed text-muted">{w.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- Services ---- */}
      <section id="services" className="scroll-mt-24 border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow={c.services.eyebrow} title={words(c.services.title)} lead={c.services.lead} />
          </Reveal>
          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {c.services.items.map((s) => (
              <StaggerItem key={s.title} className="flex flex-col gap-3 bg-background p-6 sm:p-7">
                <h3 className="font-display text-xl tracking-tight text-foreground">{s.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-muted">{s.body}</p>
                <p className="annotation text-foreground/80">{s.price}</p>
                <Link
                  href={s.href}
                  className="group inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-accent uppercase"
                >
                  {s.linkLabel}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- Local specifics (ink band) ---- */}
      <section className="ink bg-noise relative overflow-hidden border-t border-line-strong">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow={c.local.eyebrow} title={words(c.local.title)} lead={c.local.lead} />
          </Reveal>
          <Stagger className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {c.local.items.map((l, i) => (
              <StaggerItem key={l.title}>
                <div className="flex flex-col gap-2.5 border-t border-line-strong pt-5">
                  <span className="font-mono text-[0.625rem] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-medium tracking-tight text-foreground">{l.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{l.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- Pricing ---- */}
      <section id="pricing" className="scroll-mt-24 border-t border-line-strong">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow={c.pricing.eyebrow} title={words(c.pricing.title)} lead={c.pricing.lead} />
          </Reveal>
          <Reveal delay={0.08} className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-strong">
                  {c.pricing.head.map((h) => (
                    <th key={h} scope="col" className="annotation py-3 pr-4 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.pricing.rows.map((r) => (
                  <tr key={r.item} className="border-b border-line">
                    <th scope="row" className="py-4 pr-4 font-medium text-foreground">
                      {r.item}
                    </th>
                    <td className="tabular py-4 pr-4 text-foreground">{r.price}</td>
                    <td className="py-4 text-sm text-muted">{r.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal className="mt-6 flex flex-col items-start gap-5">
            <p className="max-w-3xl text-sm leading-relaxed text-faint">{c.pricing.footnote}</p>
            <ArrowLink href={c.pricing.guide.href}>{c.pricing.guide.label}</ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* ---- Proof ---- */}
      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow={c.proof.eyebrow} title={words(c.proof.title)} lead={c.proof.lead} />
              <ArrowLink href={c.proof.all.href} className="mb-2">
                {c.proof.all.label}
              </ArrowLink>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {c.proof.items.map((p, i) => {
              const project = getProject(p.slug);
              if (!project) return null;
              return (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <Link
                    href={`/work/${p.slug}`}
                    className="card-hover group flex h-full flex-col overflow-hidden rounded-md border border-line bg-surface-raised"
                  >
                    <ProjectShot
                      image={{ ...project.images.cover, alt: p.alt }}
                      caption={p.name}
                      sizes="(max-width: 1024px) 100vw, 380px"
                    />
                    <div className="flex flex-1 flex-col gap-2.5 p-6">
                      <h3 className="font-display text-xl tracking-tight text-foreground transition-colors group-hover:text-accent">
                        {p.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">{p.body}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- Process ---- */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow={c.process.eyebrow} title={words(c.process.title)} lead={c.process.lead} />
          </Reveal>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {c.process.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3 bg-background p-6">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-medium tracking-tight text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Lead form ---- */}
      <section id="lead-form" className="relative scroll-mt-24 overflow-hidden border-t border-line-strong bg-surface/40">
        <div className="relative mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <SectionHeading eyebrow={c.form.eyebrow} title={words(c.form.title)} lead={c.form.lead} align="center" />
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <div className="rounded-md border border-line-strong bg-surface-raised p-6 sm:p-10">
              <LeadForm
                orgLabel={c.form.orgLabel}
                source={c.source}
                budgets={c.form.budgets}
                timelines={c.form.timelines}
                submitLabel={c.form.submitLabel}
                labels={c.form.labels}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <SectionHeading eyebrow={c.faq.eyebrow} title={words(c.faq.title)} />
            </Reveal>
            <Faq items={c.faq.items} />
          </div>
        </div>
      </section>

      {/* ---- Related ---- */}
      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <Eyebrow>{c.related.eyebrow}</Eyebrow>
            <h2 className="mt-5 text-3xl sm:text-4xl">{words(c.related.title)}</h2>
          </Reveal>
          <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
            {c.related.links.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link href={l.href} className="group flex flex-col gap-1 py-4">
                  <span className="flex items-baseline justify-between gap-4 text-foreground transition-colors group-hover:text-accent">
                    {l.label}
                    <span aria-hidden className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent">
                      →
                    </span>
                  </span>
                  <span className="text-sm text-muted">{l.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
