import type { LeadFormLabels, LeadOption } from "@/components/LeadForm";

/**
 * Content model for a market landing page (Hong Kong / Taiwan, in English
 * and Traditional Chinese). One template renders all four; each language
 * version is a complete, hand-written content object — not a machine
 * translation of the others — so vocabulary follows local usage
 * (e.g. HK 軟件/網店/質素 vs Taiwan 軟體/電商/品質).
 */
export type MarketLocale = "en" | "zh-HK" | "zh-TW";

export type MarketContent = {
  locale: MarketLocale;
  /** Canonical path of this page. */
  path: string;
  /** Lead `source` recorded in /admin, e.g. "market-hk-zh". */
  source: string;
  breadcrumb: { home: { name: string; href: string }; current: string };
  hero: {
    eyebrow: string;
    /** [before accent, accent, after accent] */
    title: [string, string, string];
    lead: string;
    primaryCta: string;
    secondaryCta: { label: string; href: string; external?: boolean };
    notes: string[];
  };
  /** "At a glance" definition list — the page's answer-engine summary. */
  facts: { eyebrow: string; title: string; items: { term: string; detail: string }[] };
  why: { eyebrow: string; title: string; lead: string; items: { title: string; body: string }[] };
  services: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { title: string; body: string; price: string; href: string; linkLabel: string }[];
  };
  local: { eyebrow: string; title: string; lead: string; items: { title: string; body: string }[] };
  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    head: [string, string, string];
    rows: { item: string; price: string; timeline: string }[];
    footnote: string;
    guide: { label: string; href: string };
  };
  proof: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { slug: string; name: string; body: string; alt: string }[];
    all: { label: string; href: string };
  };
  process: { eyebrow: string; title: string; lead: string; steps: { title: string; body: string }[] };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  form: {
    eyebrow: string;
    title: string;
    lead: string;
    orgLabel: string;
    submitLabel: string;
    budgets: LeadOption[];
    timelines?: LeadOption[];
    labels?: Partial<LeadFormLabels>;
  };
  related: { eyebrow: string; title: string; links: { label: string; href: string; note: string }[] };
  schema: {
    /** WebPage/Service name, e.g. "Web design and development for Hong Kong businesses". */
    name: string;
    description: string;
    area: { "@type": "AdministrativeArea" | "Country"; name: string };
    currency: "HKD" | "TWD" | "USD";
    minPrice: number;
  };
};
