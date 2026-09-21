import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { TOOL_COUNT } from "@/data/tools";

/**
 * Everything the homepage stage says, and when. Progress runs 0 → 1 over the
 * whole scroll track; every beat names the window it lives in.
 *
 * All of it is Kodinav's own, and all of it is true of the studio: nothing
 * here is a client, number or credential the site does not already stand
 * behind.
 */

export const SCREENS = 46;

export const chapters = [
  { id: "studio", no: 1, label: "The Studio", at: 0.082 },
  { id: "work", no: 2, label: "The Work", at: 0.246 },
  { id: "terms", no: 3, label: "The Terms", at: 0.527 },
  { id: "questions", no: 4, label: "Questions", at: 0.672 },
] as const;

export const hero = {
  range: [0, 0.058] as const,
  title: "Built by one engineer.",
  sub: ["Websites, web apps and mobile apps,", "designed, built and supported by the founder."],
  cta: { label: "Book a discovery call", href: "/contact" },
  chip: "Independent studio",
  body: `${site.name} is an independent software studio. Every project is designed, engineered and supported personally by ${site.founder} — fast, findable, and entirely yours.`,
};

/** Chapter 1 — four short statements on paper, one at a time. */
export const studioBeats = [
  {
    range: [0.088, 0.118] as const,
    lines: ["You brief", "the engineer."],
    chip: "No handoffs",
    body: "No account managers and no juniors. The person you talk to writes your software.",
  },
  {
    range: [0.122, 0.151] as const,
    lines: ["Fast by default."],
    chip: "Performance",
    body: "Sub-second loads and green Core Web Vitals as standard, never as an upsell.",
  },
  {
    range: [0.155, 0.184] as const,
    lines: ["Built to be found."],
    chip: "Search-first",
    body: "Semantic HTML, structured data and search-led structure, engineered in from day one.",
  },
  {
    range: [0.188, 0.214] as const,
    lines: ["Yours to keep."],
    chip: "Full ownership",
    body: "Source code, documentation and infrastructure access, handed over at launch.",
  },
];

/** Chapter 2 — the real, shipped work, scrolling through the pinned frame. */
export const work = {
  range: [0.238, 0.505] as const,
  items: projects.map((p) => ({
    slug: p.slug,
    chip: `${p.industry.split(" · ")[0]} · ${p.year}`,
    title: p.name,
    body: p.summary,
    cover: p.images.cover,
    url: p.url,
  })),
};

/** Chapter 3 — how an engagement runs. Two statements. */
export const terms = [
  {
    range: [0.53, 0.588] as const,
    side: "right" as const,
    lines: ["Fixed quotes.", "No surprises."],
    lead: "After a short discovery call you receive a fixed, itemised quote naming every screen and workflow. Projects start from",
    price: { inr: site.priceFloor, usd: site.priceFloorUsd },
    label: "In writing",
    body: "A typical business website runs three to six weeks from discovery to launch. Applications are sliced so you see working software in weeks. Every project includes a support period, and you own the code completely.",
    links: [{ label: "How pricing works", href: "/pricing" }],
  },
  {
    range: [0.594, 0.642] as const,
    side: "left" as const,
    lines: ["From a five-page site", "to a full ERP."],
    lead: "Business websites, landing pages and stores. Web applications, learning platforms, CRMs, ERPs, dashboards and mobile apps. Performance, search and care for what already exists.",
    price: null,
    label: "One studio",
    body: `All ${services.length} services are scoped the same way: written down, fixed in price, and explained in plain language.`,
    links: [
      { label: `All ${services.length} services`, href: "/services" },
      { label: `${TOOL_COUNT} free tools`, href: "/free-tools" },
    ],
  },
];

/** Chapter 4 — the questions people ask first, arriving one at a time. */
export const questions = {
  range: [0.664, 0.8] as const,
  sign: "Fair questions",
  items: [
    {
      q: "Who actually builds my project?",
      a: `The founder, ${site.founder}, personally. Kodinav is an independent studio, not an agency that hands your work to juniors. You talk to, and are built for by, the same engineer throughout.`,
    },
    {
      q: "How much does a project cost?",
      a: "Projects start from ₹75,000 (about $2,000) and scale with scope. After a short discovery call you receive a fixed, itemised quote naming every screen and workflow. Nothing vague, nothing added mid-project.",
    },
    {
      q: "How long does it take?",
      a: "A typical business website runs 3 to 6 weeks from discovery to launch. Web applications and platforms are sliced so you see working software in weeks, and are scoped individually with a fixed quote.",
    },
    {
      q: "Do I own the code?",
      a: "Completely. Full source code, documentation and infrastructure access are handed over at launch. Every project includes a support period, and you are never locked in.",
    },
    {
      q: "Do you work with international clients?",
      a: "Yes. The studio is based in India and works with businesses in Hong Kong, Taiwan, the US, the UAE and worldwide — one engineer accountable across every timezone. Websites can be built in English, Traditional Chinese or both.",
    },
  ],
};

export const brief = {
  range: [0.815, 0.908] as const,
  chip: "The brief",
  intro:
    "Tell me what you’re building and where it’s stuck. You’ll hear back within one business day, from the engineer who would build it.",
  fields: { name: "Your name", email: "Work email", message: "What do you want to build?" },
  submit: "Send the brief",
  done: `Received. You’ll hear from ${site.founder.split(" ")[0]} within one business day.`,
};

export const signoff = {
  range: [0.935, 1.01] as const,
  line: ["Independent", "by design."],
  legal: `${site.name} · Independent software studio · Delhi NCR`,
  index: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Free tools", href: "/free-tools" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "香港", href: "/zh-hk", lang: "zh-HK" },
    { label: "台灣", href: "/zh-tw", lang: "zh-TW" },
  ],
};

export type StageContent = {
  hero: typeof hero;
  studioBeats: typeof studioBeats;
  work: typeof work;
  terms: typeof terms;
  questions: typeof questions;
  brief: typeof brief;
  signoff: typeof signoff;
  email: string;
};

export const stageContent: StageContent = {
  hero,
  studioBeats,
  work,
  terms,
  questions,
  brief,
  signoff,
  email: site.email,
};
