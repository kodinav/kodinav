import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";
import { getService } from "@/data/services";
import { getTool } from "@/data/tools";

/**
 * Shared shell for free-tool pages: breadcrumbs + hero + tool, an optional
 * middle section, a related-service funnel band, the FAQ block, the
 * all-tools link and the closing CTA. Keeps the tool pages structurally
 * identical without a copy of the scaffolding on each one.
 *
 * `crumb` is the tool's canonical path — the shell looks the tool up in the
 * catalogue to render the breadcrumb name and the service it funnels toward.
 */
export function ToolShell({
  eyebrow,
  title,
  lead,
  tool,
  middle,
  faqs,
  faqTitle = "Fair questions.",
  wide = false,
  crumb,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  tool: ReactNode;
  middle?: ReactNode;
  faqs: { q: string; a: string }[];
  faqTitle?: string;
  wide?: boolean;
  crumb?: string;
}) {
  const toolEntry = crumb ? getTool(crumb) : undefined;
  const service = toolEntry ? getService(toolEntry.service) : undefined;

  return (
    <>
      <section className="bg-noise relative overflow-hidden pt-32 pb-16 sm:pt-40">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className={`relative mx-auto ${wide ? "max-w-6xl" : "max-w-5xl"} px-5 sm:px-8`}>
          {toolEntry && (
            <Breadcrumbs items={[{ name: "Free Tools", href: "/free-tools" }, { name: toolEntry.name }]} />
          )}
          <div className="flex flex-col items-center gap-6 text-center">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">{title}</h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">{lead}</p>
          </div>
          <div className="mt-12">{tool}</div>
        </div>
      </section>

      {middle}

      {service && (
        <section className="border-t border-line-strong">
          <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="annotation mb-2">Want it done for you?</p>
                <p className="max-w-xl text-lg leading-relaxed text-muted">
                  This tool is free forever. When you want the underlying work done properly,
                  that&apos;s the studio&apos;s{" "}
                  <Link href={`/services/${service.slug}`} className="u-draw text-accent">
                    {service.name.toLowerCase()}
                  </Link>{" "}
                  service.
                </p>
              </div>
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex shrink-0 items-center gap-2 border border-line-strong px-6 py-3.5 font-mono text-xs tracking-[0.14em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent"
              >
                See the service →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title={faqTitle} align="center" />
          </Reveal>
          <div className="mt-10">
            <Faq items={faqs} />
          </div>
          <div className="mt-12 text-center">
            <ArrowLink href="/free-tools">Explore all free tools</ArrowLink>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
