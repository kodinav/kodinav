import { site } from "@/data/site";
import { Price } from "./Price";
import { Reveal } from "./motion";
import { ButtonLink } from "./ui";
import { Stamp } from "./Stamp";

export function CtaSection({
  title = "Have a project in mind?",
  lead = `A discovery call costs nothing and commits you to nothing. We talk about your business, and I tell you honestly what's worth building and what isn't.`,
  primaryLabel = "Book Discovery Call",
  primaryHref = "/contact",
}: {
  title?: string;
  lead?: string;
  primaryLabel?: string;
  primaryHref?: string;
}) {
  return (
    <section className="ink bg-noise relative overflow-hidden border-t border-line-strong">
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div
          aria-hidden
          className="absolute top-10 right-8 hidden text-foreground/40 lg:block"
        >
          <Stamp size={110} />
        </div>
        <Reveal className="flex max-w-4xl flex-col items-start gap-8">
          <p className="annotation flex items-center gap-3">
            <span className="crosshair text-accent" aria-hidden />
            Final note
          </p>
          <h2 className="text-balance text-5xl sm:text-7xl">{title}</h2>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
            {lead}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink
              href={primaryHref}
              size="lg"
              className="border-accent! bg-accent! text-[#efeae0]! hover:bg-[#efeae0]! hover:text-[#16140f]!"
            >
              {primaryLabel}
            </ButtonLink>
            <ButtonLink href={`mailto:${site.email}`} variant="outline" size="lg" external>
              {site.email}
            </ButtonLink>
          </div>
          <p className="annotation">
            Projects from <Price inr={site.priceFloor} usd={site.priceFloorUsd} /> · Response within one business day
          </p>
        </Reveal>
      </div>
    </section>
  );
}
