"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { services } from "@/data/services";

/**
 * Desktop mega-menu over the full service catalogue, grouped the way a
 * prospective client thinks about the work: what they want built, what they
 * want run. Opens on hover and keyboard focus with a short close delay so it
 * doesn't flicker shut across the trigger-to-panel gap.
 *
 * The panel stays mounted (hidden via CSS + `inert`), so its links are in
 * the server HTML for crawlers instead of appearing only after a hover.
 */

const byslug = Object.fromEntries(services.map((s) => [s.slug, s]));

const groups: { title: string; note: string; slugs: string[] }[] = [
  {
    title: "Websites & stores",
    note: "Marketing sites, landing pages and commerce, built to convert.",
    slugs: [
      "business-websites",
      "landing-page-development",
      "portfolio-websites",
      "ecommerce",
      "website-redesign",
    ],
  },
  {
    title: "Applications & platforms",
    note: "Custom software shaped around how your business actually works.",
    slugs: [
      "web-applications",
      "learning-management-systems",
      "admin-dashboards",
      "crm",
      "erp",
      "mobile-apps",
      "ai-integrations",
    ],
  },
  {
    title: "Performance & care",
    note: "Make an existing site fast, findable and looked-after.",
    slugs: ["website-performance", "website-maintenance"],
  },
];

export function ServicesMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 130);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link
        href="/services"
        onFocus={show}
        aria-expanded={open}
        className={`u-draw flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${
          active ? "text-accent" : "text-foreground/75 hover:text-foreground"
        }`}
      >
        Services
        <span
          aria-hidden
          className={`text-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </Link>

      <div
        inert={!open}
        onFocus={show}
        onBlur={hide}
        className={`mega absolute top-full left-1/2 z-50 mt-4 w-[min(60rem,92vw)] ${open ? "is-open" : ""}`}
      >
        <div className="overflow-hidden rounded-[2px] border border-line-strong bg-surface-raised shadow-[0_36px_80px_-40px_rgba(22,23,27,0.45)]">
          <div className="grid gap-px bg-line lg:grid-cols-[1.1fr_1.1fr_0.9fr]">
            {groups.map((g) => (
              <div key={g.title} className="bg-surface-raised p-6">
                <p className="spec mb-1 text-accent">{g.title}</p>
                <p className="mb-4 text-xs leading-relaxed text-faint">{g.note}</p>
                <ul className="flex flex-col">
                  {g.slugs.map((slug) => {
                    const s = byslug[slug];
                    if (!s) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/services/${slug}`}
                          prefetch={false}
                          className="group -mx-2 flex items-baseline gap-2 rounded-[2px] px-2 py-1.5 transition-colors hover:bg-surface"
                        >
                          <span
                            aria-hidden
                            className="translate-y-px text-faint transition-colors group-hover:text-accent"
                          >
                            ›
                          </span>
                          <span className="text-sm text-foreground/85 transition-colors group-hover:text-accent">
                            {s.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4">
            <p className="text-xs text-faint">
              One studio, the full stack — from a five-page site to a full ERP.
            </p>
            <Link
              href="/services"
              prefetch={false}
              className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent transition-colors hover:text-foreground"
            >
              All services →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
