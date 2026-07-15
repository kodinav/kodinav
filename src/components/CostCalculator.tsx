"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/**
 * Interactive website cost estimator. All arithmetic is client-side and the
 * ranges are the studio's real ones — floor ₹75,000 / $2,000, same numbers as
 * the pricing page. The output is an estimate, never a quote: quotes are fixed
 * and written after a discovery call.
 */

type Range = [number, number];

type ProjectType = "landing" | "business" | "ecommerce" | "webapp";

const TYPES: { id: ProjectType; label: string; blurb: string }[] = [
  { id: "landing", label: "Landing Page", blurb: "One focused page built to convert ad or campaign traffic" },
  { id: "business", label: "Business Website", blurb: "A multi-page site that earns trust and enquiries" },
  { id: "ecommerce", label: "E-Commerce Store", blurb: "Products, cart, checkout and payments you own" },
  { id: "webapp", label: "Web Application", blurb: "Portals, dashboards, LMS, CRM — custom software" },
];

const BASE: Record<ProjectType, { usd: Range; inr: Range }> = {
  landing: { usd: [2000, 3000], inr: [75000, 120000] },
  business: { usd: [2000, 4000], inr: [75000, 160000] },
  ecommerce: { usd: [4000, 8000], inr: [150000, 320000] },
  webapp: { usd: [8000, 15000], inr: [300000, 600000] },
};

const PAGES: { id: string; label: string; usd: Range; inr: Range }[] = [
  { id: "p5", label: "Up to 5 pages", usd: [0, 0], inr: [0, 0] },
  { id: "p10", label: "6–10 pages", usd: [500, 1000], inr: [20000, 40000] },
  { id: "p20", label: "11–20 pages", usd: [1000, 2000], inr: [40000, 80000] },
  { id: "p20plus", label: "20+ pages", usd: [2000, 4000], inr: [80000, 160000] },
];

const FEATURES: { id: string; label: string; usd: Range; inr: Range; skipFor?: ProjectType[] }[] = [
  { id: "cms", label: "Edit content yourself (CMS)", usd: [600, 1200], inr: [25000, 50000] },
  { id: "booking", label: "Bookings / appointments", usd: [600, 1200], inr: [25000, 50000] },
  // Payments are part of the e-commerce base, not an add-on
  { id: "payments", label: "Online payments", usd: [500, 1000], inr: [20000, 40000], skipFor: ["ecommerce"] },
  { id: "accounts", label: "Customer accounts / login", usd: [1000, 2500], inr: [40000, 100000] },
  { id: "multilang", label: "Multiple languages", usd: [500, 1200], inr: [20000, 50000] },
  { id: "integrations", label: "WhatsApp / CRM integrations", usd: [400, 900], inr: [15000, 35000] },
  { id: "copy", label: "Help writing the content", usd: [400, 900], inr: [15000, 35000] },
];

const AED_PER_USD = 3.67;

function fmtUsd(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}
function fmtInr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
function fmtAed(n: number) {
  return `AED ${(Math.round((n * AED_PER_USD) / 100) * 100).toLocaleString("en-US")}`;
}

export function CostCalculator() {
  const [type, setType] = useState<ProjectType>("business");
  const [pages, setPages] = useState("p5");
  const [features, setFeatures] = useState<Set<string>>(new Set());
  // INR for India, USD (with AED hint) for everyone else — same pre-paint
  // data-region signal the rest of the site uses.
  const [region, setRegion] = useState<"in" | "intl">("in");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (document.documentElement.getAttribute("data-region") === "intl") {
        setRegion("intl");
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = (id: string) => {
    setFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const cur = region === "in" ? "inr" : "usd";
  let min = BASE[type][cur][0];
  let max = BASE[type][cur][1];
  if (type !== "landing") {
    const p = PAGES.find((p) => p.id === pages)!;
    min += p[cur][0];
    max += p[cur][1];
  }
  for (const f of FEATURES) {
    if (features.has(f.id) && !f.skipFor?.includes(type)) {
      min += f[cur][0];
      max += f[cur][1];
    }
  }

  const weeks =
    type === "webapp" ? "6–12 weeks" : type === "ecommerce" ? "4–8 weeks" : type === "landing" ? "1–2 weeks" : "3–6 weeks";

  const summary = [
    TYPES.find((t) => t.id === type)!.label,
    type !== "landing" ? PAGES.find((p) => p.id === pages)!.label : null,
    ...FEATURES.filter((f) => features.has(f.id) && !f.skipFor?.includes(type)).map((f) => f.label),
  ]
    .filter(Boolean)
    .join(", ");
  const estimate =
    region === "in" ? `${fmtInr(min)} – ${fmtInr(max)}` : `${fmtUsd(min)} – ${fmtUsd(max)}`;
  const waText = encodeURIComponent(
    `Hi Abhinav, I used the website cost calculator. Project: ${summary}. Estimate shown: ${estimate}. I'd like a fixed quote.`
  );

  const chip = (active: boolean) =>
    `border px-4 py-2.5 text-left text-sm transition-colors ${
      active
        ? "border-accent bg-accent/10 text-foreground"
        : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
    }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
      <div className="flex flex-col gap-10">
        <fieldset>
          <legend className="annotation mb-4">01 — What are you building?</legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={type === t.id}
                onClick={() => setType(t.id)}
                className={chip(type === t.id)}
              >
                <span className="font-mono text-xs uppercase tracking-[0.14em]">{t.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-faint">{t.blurb}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {type !== "landing" && (
          <fieldset>
            <legend className="annotation mb-4">02 — How many pages?</legend>
            <div className="flex flex-wrap gap-2.5">
              {PAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={pages === p.id}
                  onClick={() => setPages(p.id)}
                  className={chip(pages === p.id)}
                >
                  <span className="font-mono text-xs uppercase tracking-[0.14em]">{p.label}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend className="annotation mb-4">
            {type !== "landing" ? "03" : "02"} — What should it do?
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {FEATURES.filter((f) => !f.skipFor?.includes(type)).map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={features.has(f.id)}
                onClick={() => toggle(f.id)}
                className={chip(features.has(f.id))}
              >
                <span className="font-mono text-xs uppercase tracking-[0.14em]">
                  <span aria-hidden className="mr-2 text-accent">{features.has(f.id) ? "■" : "□"}</span>
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Estimate card */}
      <div className="ink relative h-fit self-start p-7 sm:p-8 lg:sticky lg:top-28">
        <div
          aria-hidden
          className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background"
        />
        <p className="annotation mb-6 flex items-center justify-between">
          Estimated Range <span className="text-faint">No. 002</span>
        </p>
        <p className="font-display text-[clamp(2rem,6vw,2.9rem)] leading-none uppercase">
          {estimate}
        </p>
        {region === "intl" && (
          <p className="annotation mt-2 text-faint">
            ≈ {fmtAed(min)} – {fmtAed(max)}
          </p>
        )}
        <dl className="mt-6 flex flex-col gap-2.5 border-t border-line pt-5">
          <div className="flex items-baseline justify-between gap-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">Timeline</dt>
            <dd className="font-mono text-xs text-foreground/90">{weeks}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">Quote type</dt>
            <dd className="font-mono text-xs text-foreground/90">Fixed, itemised</dd>
          </div>
          <div className="flex items-baseline justify-between gap-6">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">Ownership</dt>
            <dd className="font-mono text-xs text-foreground/90">100% yours</dd>
          </div>
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          An estimate, not a quote. After a free discovery call you get a fixed,
          written quote naming every page and feature — and that number does not
          move mid-project.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={`https://wa.me/${site.phoneRaw.replace("+", "")}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-accent bg-accent px-6 py-3.5 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5"
          >
            Get a fixed quote on WhatsApp →
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-line-strong px-6 py-3.5 font-mono text-xs tracking-[0.18em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent"
          >
            Book a free discovery call
          </a>
        </div>
      </div>
    </div>
  );
}
