"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLink } from "../ui";

/**
 * The work, as a ledger: an index of every shipped product on the left, and
 * on the right the selected one as a flat plate — the real screenshot with
 * no browser-chrome costume, one real result taken from the case file, the
 * stack and a link to the case file itself. Hover or focus a row to switch.
 * On phones the plate sits above the index and rows switch it on tap.
 */

export type LedgerEntry = {
  slug: string;
  name: string;
  industry: string;
  year: string;
  summary: string;
  stack: string[];
  cover: { src: string; alt: string };
  result: { metric: string; label: string } | null;
  /** The running product, when its address is public. */
  url?: string;
};

export function WorkLedger({ entries }: { entries: LedgerEntry[] }) {
  const [active, setActive] = useState(0);
  const p = entries[active] ?? entries[0];
  if (!p) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* plate */}
      <div className="order-first lg:order-none lg:col-span-6 lg:col-start-7">
        <div className="lg:sticky lg:top-28">
          <figure className="plate relative aspect-16/10 w-full overflow-hidden">
            <Image
              key={p.slug}
              src={p.cover.src}
              alt={p.cover.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 620px"
              className="object-cover object-top"
            />
          </figure>
          <div className="mt-4 grid grid-cols-[1fr_auto] items-start gap-4 border-t border-line-strong pt-4">
            <div>
              {p.result ? (
                <>
                  <p className="readout tabular font-display text-[1.75rem] leading-none tracking-tight text-foreground sm:text-4xl">
                    {p.result.metric}
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-muted">{p.result.label}</p>
                </>
              ) : (
                <p className="text-sm text-muted">{p.summary}</p>
              )}
            </div>
            <div className="mt-1 flex flex-col items-end gap-2.5">
              <ArrowLink href={`/work/${p.slug}`} className="whitespace-nowrap">
                Case file
              </ArrowLink>
              {p.url && (
                <ArrowLink href={p.url} external className="whitespace-nowrap">
                  Live site
                </ArrowLink>
              )}
            </div>
          </div>
          {p.result && (
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.summary}</p>
          )}
          <p className="spec mt-3 text-faint">{p.stack.join(" · ")}</p>
        </div>
      </div>

      {/* index */}
      <ol className="border-t border-line-strong lg:col-span-6 lg:col-start-1 lg:row-start-1">
        {entries.map((e, i) => {
          const selected = i === active;
          return (
            <li key={e.slug} className="border-b border-line">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={selected}
                aria-label={`Show ${e.name}`}
                className={`group grid w-full grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 py-4 text-left transition-colors sm:py-[1.15rem] ${
                  selected ? "text-accent" : "text-foreground"
                }`}
              >
                <span className="spec tabular text-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="block font-display text-xl leading-tight tracking-tight sm:text-2xl">
                    {e.name}
                  </span>
                  <span className="spec mt-1.5 block text-faint">{e.industry}</span>
                </span>
                <span className="flex items-baseline gap-3">
                  <span className="spec tabular text-faint">{e.year}</span>
                  <span
                    aria-hidden
                    className={`font-mono transition-transform duration-300 ${
                      selected ? "translate-x-0.5 text-accent" : "text-faint"
                    }`}
                  >
                    →
                  </span>
                </span>
              </button>
              <Link
                href={`/work/${e.slug}`}
                className="sr-only focus:not-sr-only focus:block focus:px-2 focus:py-1 focus:font-mono focus:text-xs focus:text-accent"
              >
                Open the {e.name} case file
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
