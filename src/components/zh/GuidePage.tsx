import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/motion";
import { ArrowLink, ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { cjkWords } from "@/lib/cjk";
import { faqSchema } from "@/lib/schema";

/** A long-form guide page for the Traditional Chinese sections. */
export type GuideContent = {
  locale: "zh-HK" | "zh-TW";
  path: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  tag: string;
  meta: { updated: string; readingTime: string; author: string };
  breadcrumb: { home: { name: string; href: string }; current: string };
  sections: {
    heading?: string;
    paragraphs: string[];
    table?: { head: string[]; rows: string[][] };
    /** Inline links under the paragraphs — the tools and pages the text refers to. */
    links?: { label: string; href: string }[];
  }[];
  faq: { title: string; items: { q: string; a: string }[] };
  cta: { title: string; body: string; label: string; href: string };
  related: { title: string; links: { label: string; href: string }[] };
};

export function GuidePage({ content: c }: { content: GuideContent }) {
  const url = `${site.url}${c.path}`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.title,
      description: c.excerpt,
      inLanguage: c.locale,
      datePublished: c.date,
      dateModified: c.date,
      image: `${site.url}${ogImage(c.title, c.tag)[0].url}`,
      mainEntityOfPage: url,
      author: { "@id": `${site.url}/#founder` },
      publisher: { "@id": `${site.url}/#studio` },
    },
    faqSchema(c.faq.items),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: c.breadcrumb.home.name, item: `${site.url}${c.breadcrumb.home.href}` },
        { "@type": "ListItem", position: 2, name: c.breadcrumb.current, item: url },
      ],
    },
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <article className="bg-noise relative overflow-hidden pt-32 pb-8 sm:pt-44">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <Breadcrumbs home={c.breadcrumb.home} items={[{ name: c.breadcrumb.current }]} />
          <Reveal className="flex flex-col gap-6">
            <Eyebrow>{c.tag}</Eyebrow>
            <h1 className="text-balance text-[clamp(2rem,5.4vw,3.2rem)]">{cjkWords(c.title, c.locale)}</h1>
            <p className="text-pretty text-lg leading-relaxed text-muted">{c.excerpt}</p>
            <p className="annotation flex flex-wrap gap-x-4 gap-y-1">
              <span>
                {c.meta.updated}
                <time dateTime={c.date}>{c.date}</time>
              </span>
              <span>{c.meta.readingTime}</span>
              <span>{c.meta.author}</span>
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col gap-10 border-t border-line pt-12">
            {c.sections.map((section, i) => (
              <Reveal key={i} y={16}>
                <section>
                  {section.heading && <h2 className="mb-4 text-2xl">{cjkWords(section.heading, c.locale)}</h2>}
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="mb-4 text-[1.06rem] leading-[1.9] text-muted">
                      {p}
                    </p>
                  ))}
                  {section.table && (
                    <div className="mt-2 mb-4 overflow-x-auto">
                      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-line-strong">
                            {section.table.head.map((h) => (
                              <th key={h} scope="col" className="annotation py-3 pr-4 font-normal">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr key={row[0]} className="border-b border-line">
                              {row.map((cell, k) =>
                                k === 0 ? (
                                  <th key={k} scope="row" className="py-3 pr-4 font-medium text-foreground">
                                    {cell}
                                  </th>
                                ) : (
                                  <td key={k} className="tabular py-3 pr-4 text-muted">
                                    {cell}
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {section.links && (
                    <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                      {section.links.map((l) => (
                        <ArrowLink key={l.href} href={l.href}>
                          {l.label}
                        </ArrowLink>
                      ))}
                    </p>
                  )}
                </section>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-col items-start gap-5 border border-line-strong bg-surface-raised p-7 sm:p-9">
            <h2 className="text-2xl">{cjkWords(c.cta.title, c.locale)}</h2>
            <p className="leading-relaxed text-muted">{c.cta.body}</p>
            <ButtonLink href={c.cta.href}>{c.cta.label}</ButtonLink>
          </Reveal>
        </div>
      </article>

      <section className="border-t border-line-strong">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading title={cjkWords(c.faq.title, c.locale)} />
          </Reveal>
          <div className="mt-8">
            <Faq items={c.faq.items} />
          </div>
        </div>
      </section>

      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <p className="annotation mb-5">{c.related.title}</p>
          <ul className="flex flex-col">
            {c.related.links.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link
                  href={l.href}
                  className="group flex items-center justify-between gap-4 py-4 text-foreground transition-colors hover:text-accent"
                >
                  {l.label}
                  <span aria-hidden className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
