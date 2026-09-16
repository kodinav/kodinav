import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/motion";
import { ButtonLink, Eyebrow, SectionHeading } from "@/components/ui";

/**
 * Free-tool page scaffold for the Traditional Chinese sections — the zh
 * counterpart of ToolShell, with every string passed in and the funnel
 * pointing at the Chinese market page instead of an English service page.
 */
export function ZhToolShell({
  breadcrumb,
  eyebrow,
  title,
  lead,
  tool,
  middle,
  faqTitle,
  faqs,
  funnel,
  related,
}: {
  breadcrumb: { home: { name: string; href: string }; current: string };
  eyebrow: string;
  title: ReactNode;
  lead: string;
  tool: ReactNode;
  middle?: ReactNode;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  funnel: { eyebrow: string; body: string; label: string; href: string };
  related: { title: string; links: { label: string; href: string }[] };
}) {
  return (
    <>
      <section className="bg-noise relative overflow-hidden pt-32 pb-16 sm:pt-40">
        <div
          aria-hidden
          className="bg-grid absolute inset-0"
          style={{
            maskImage: "radial-gradient(120% 80% at 50% 0%, black 35%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, black 35%, transparent 80%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Breadcrumbs home={breadcrumb.home} items={[{ name: breadcrumb.current }]} />
          <div className="flex flex-col items-center gap-6 text-center">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">{title}</h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">{lead}</p>
          </div>
          <div className="mt-12">{tool}</div>
        </div>
      </section>

      {middle}

      <section className="border-t border-line-strong">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 px-5 py-14 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="annotation mb-2">{funnel.eyebrow}</p>
            <p className="max-w-xl text-lg leading-relaxed text-muted">{funnel.body}</p>
          </div>
          <ButtonLink href={funnel.href} variant="outline">
            {funnel.label}
          </ButtonLink>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading title={faqTitle} align="center" />
          </Reveal>
          <div className="mt-10">
            <Faq items={faqs} />
          </div>
        </div>
      </section>

      <section className="border-t border-line-strong bg-surface/30">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <p className="annotation mb-5">{related.title}</p>
          <ul className="flex flex-col">
            {related.links.map((l) => (
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
