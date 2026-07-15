import type { ReactNode } from "react";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/motion";
import { ArrowLink, Eyebrow, SectionHeading } from "@/components/ui";

/**
 * Shared shell for free-tool pages: hero + tool, an optional middle section,
 * the FAQ block, the all-tools link and the closing CTA. Keeps the twenty-odd
 * tool pages structurally identical without twenty copies of the scaffolding.
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
}: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  tool: ReactNode;
  middle?: ReactNode;
  faqs: { q: string; a: string }[];
  faqTitle?: string;
  wide?: boolean;
}) {
  return (
    <>
      <section className="bg-noise relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className={`relative mx-auto ${wide ? "max-w-6xl" : "max-w-5xl"} px-5 sm:px-8`}>
          <div className="flex flex-col items-center gap-6 text-center">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="text-balance text-4xl sm:text-6xl">{title}</h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">{lead}</p>
          </div>
          <div className="mt-12">{tool}</div>
        </div>
      </section>

      {middle}

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
