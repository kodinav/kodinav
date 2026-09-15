"use client";

import { useState } from "react";

/**
 * Accordion FAQ. Every answer is always in the server-rendered HTML; closed
 * panels are collapsed with CSS, not unmounted. Search engines and AI answer
 * engines (most of which never run JavaScript or click) can only quote an
 * answer that exists in the markup — the earlier unmount-on-close version
 * shipped only the first answer as HTML.
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto w-full max-w-2xl border-t border-line-strong">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `faq-panel-${i}`;
        return (
          <div key={i} className="border-b border-line">
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-baseline gap-4 py-5 text-left active:opacity-70"
              >
                <span className="font-mono text-[0.625rem] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-medium text-foreground">{item.q}</span>
                <span
                  aria-hidden
                  className={`font-mono text-lg leading-none transition-all duration-300 ${
                    open ? "rotate-45 text-accent" : "text-faint"
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              inert={!open}
              className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="prose-justify pb-6 pl-9 leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
