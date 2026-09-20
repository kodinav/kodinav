import Link from "next/link";
import { ButtonLink, PulseDot } from "./ui";
import { Magnetic } from "./motion";
import { Instrument } from "./home/Instrument";
import { buildInfo } from "@/lib/buildInfo";

/**
 * CSS-driven line reveal: the headline is visible at first paint even before
 * JS hydrates — it carries the LCP, so it must not depend on a script.
 */
function RevealLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="reveal-line">
      <span style={{ animationDelay: `${delay}s` }}>{children}</span>
    </span>
  );
}

const markets = [
  { href: "/web-development-hong-kong", label: "Hong Kong", lang: "en" },
  { href: "/zh-hk", label: "香港（繁中）", lang: "zh-HK" },
  { href: "/web-development-taiwan", label: "Taiwan", lang: "en" },
  { href: "/zh-tw", label: "台灣（繁中）", lang: "zh-TW" },
];

export function Hero({
  pageCount,
  toolCount,
  productCount,
}: {
  pageCount: number;
  toolCount: number;
  productCount: number;
}) {
  const facts = [
    buildInfo.commit && `build ${buildInfo.commit}`,
    buildInfo.date,
    buildInfo.next && `Next.js ${buildInfo.next}`,
    `${pageCount} pages`,
    `${toolCount} free tools`,
    `${productCount} shipped products`,
  ].filter(Boolean) as string[];

  return (
    <section className="relative overflow-hidden pt-[calc(6.5rem+env(safe-area-inset-top))] sm:pt-36">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* the layout's own 12-column grid, made visible: the bench top */}
        <div aria-hidden className="bg-columns pointer-events-none absolute inset-x-5 inset-y-0 hidden opacity-70 sm:inset-x-8 lg:block" />

        <div className="relative grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
          {/* headline column */}
          <div className="lg:col-span-7">
            <p className="spec flex flex-wrap items-center gap-x-4 gap-y-1.5 text-foreground/70">
              <span className="flex items-center gap-2">
                <PulseDot />
                Taking new projects
              </span>
              <span aria-hidden className="hidden h-3 w-px bg-line-strong sm:block" />
              <span className="hidden sm:inline">Independent software studio · Est. 2024</span>
            </p>

            <h1 className="mt-7 text-[clamp(2.6rem,6.2vw,5.4rem)]">
              <RevealLine delay={0.05}>We build software</RevealLine>
              <RevealLine delay={0.15}>that helps businesses</RevealLine>
              <RevealLine delay={0.25}>
                <span className="text-accent">grow</span>.
              </RevealLine>
            </h1>

            <div
              className="rise-soft mt-8 flex max-w-xl flex-col items-start gap-7"
              style={{ animationDelay: "0.35s" }}
            >
              <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
                Websites, web applications and mobile apps, engineered for speed,
                search and the next five years — designed, built and supported
                personally by the founder.{" "}
                <span className="text-foreground">
                  This page measures itself while you read it; the numbers beside
                  it are live.
                </span>
              </p>

              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                <Magnetic>
                  <ButtonLink href="/contact" size="lg" className="w-full sm:w-auto">
                    Book discovery call
                  </ButtonLink>
                </Magnetic>
                <ButtonLink href="/work" variant="outline" size="lg" className="w-full sm:w-auto">
                  See the work
                </ButtonLink>
              </div>

              {/* A working instrument, not a promise: submits to the real audit
                  tool, which reads ?url= and starts the scan. Plain GET form —
                  works before hydration and without JavaScript. */}
              <form action="/free-website-audit" method="get" className="w-full max-w-xl">
                <label htmlFor="hero-audit-url" className="spec mb-2 block">
                  Or paste your website — free 60-second audit, no email needed
                </label>
                <div className="flex rounded-[2px] border border-line-strong bg-surface-raised focus-within:border-accent">
                  <input
                    id="hero-audit-url"
                    name="url"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    spellCheck={false}
                    required
                    placeholder="yourwebsite.com"
                    className="min-h-12 w-full min-w-0 bg-transparent px-4 font-mono text-sm text-foreground placeholder:text-faint outline-none"
                  />
                  <button
                    type="submit"
                    className="flex shrink-0 items-center gap-2 border-l border-line-strong px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-foreground hover:text-background"
                  >
                    Audit <span aria-hidden>→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* instrument column */}
          <div
            className="rise-soft lg:col-span-5 lg:pt-2"
            style={{ animationDelay: "0.45s" }}
          >
            <Instrument />
          </div>
        </div>
      </div>

      {/* index strip: markets + build facts */}
      <div className="mt-14 border-y border-line-strong bg-background/60 sm:mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="spec flex flex-wrap items-center gap-x-5 gap-y-1.5 border-b border-line py-3">
            <span className="text-foreground/70">Now serving Hong Kong &amp; Taiwan</span>
            {markets.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                hrefLang={m.lang}
                lang={m.lang}
                className="u-draw text-foreground transition-colors hover:text-accent"
              >
                {m.label}
              </Link>
            ))}
          </p>
          <p className="spec tabular py-3 text-faint">{facts.join(" · ")}</p>
        </div>
      </div>
    </section>
  );
}
