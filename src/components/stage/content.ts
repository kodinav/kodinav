import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { TOOL_COUNT } from "@/data/tools";

/**
 * The homepage tells one story: a business online, told as the history of
 * life. One cell in deep water divides, is studied in a notebook, learns to be
 * found in the dark, outswims the rest, adapts to a new shore, is catalogued,
 * branches into a lineage, lays an egg — your brief — and finally flies.
 *
 * Progress runs 0 → 1 over the whole scroll track; every beat names the
 * window it lives in. `film.ts` holds what the picture does in each window.
 *
 * The metaphor is the only invention here. Every claim a caption makes is one
 * the site already stands behind: nothing below is a client, number or
 * credential Kodinav does not have.
 */

export const SCREENS = 58;

export const chapters = [
  { id: "origin", no: 1, label: "Origin", at: 0.064 },
  { id: "selection", no: 2, label: "Selection", at: 0.192 },
  { id: "work", no: 3, label: "Specimens", at: 0.398 },
  { id: "terms", no: 4, label: "Lineage", at: 0.652 },
  { id: "questions", no: 5, label: "Questions", at: 0.742 },
] as const;

/** The clock in the top band: where in deep time the scroll is. */
export const eras: { at: number; label: string; years: number | null; note?: string }[] = [
  { at: 0, label: "Origin", years: 3_800_000_000 },
  { at: 0.1, label: "First colonies", years: 1_600_000_000 },
  { at: 0.118, label: "The notebook", years: null, note: "Fig. 1" },
  { at: 0.186, label: "The deep", years: 530_000_000 },
  { at: 0.252, label: "The shallows", years: 420_000_000 },
  { at: 0.322, label: "The shore", years: 375_000_000 },
  { at: 0.39, label: "The cabinet", years: null, note: `${projects.length} specimens` },
  { at: 0.648, label: "The lineage", years: null, note: `${services.length} branches` },
  { at: 0.73, label: "The night", years: 150_000_000 },
  { at: 0.862, label: "The egg", years: 66_000_000 },
  { at: 0.95, label: "First flight", years: 1_000_000 },
  { at: 1, label: "Today", years: 0 },
];

export const hero = {
  range: [0, 0.05] as const,
  title: "Evolution took four billion years.",
  lines: ["Evolution took", "four billion years."],
  kicker: "Yours takes weeks.",
  sub: ["Websites, web apps and mobile apps,", "designed, built and supported by one engineer."],
  cta: { label: "Book a discovery call", href: "/contact" },
  chip: "Independent studio",
  body: `${site.name} is an independent software studio. Every project is designed, engineered and supported personally by ${site.founder} — fast, findable, and entirely yours.`,
};

/** The statements of the story, in order. `id` anchors a chapter. */
export const statements = [
  {
    key: "origin",
    id: "origin",
    range: [0.064, 0.1] as const,
    lines: ["It starts", "with one cell."],
    chip: "No handoffs",
    body: "And one engineer. No account managers and no juniors: the person you talk to writes your software.",
  },
  {
    key: "found",
    id: "selection",
    range: [0.192, 0.24] as const,
    lines: ["Built to be found."],
    chip: "Search-first",
    body: "Most of the sea is dark. Semantic HTML, structured data and search-led structure are engineered in from day one.",
  },
  {
    key: "fast",
    id: undefined,
    range: [0.256, 0.305] as const,
    lines: ["Survival", "of the fastest."],
    chip: "Performance",
    body: "Sub-second loads and green Core Web Vitals as standard, never as an upsell.",
  },
  {
    key: "adapted",
    id: undefined,
    range: [0.324, 0.372] as const,
    lines: ["Adapted", "to its habitat."],
    chip: "Hong Kong · Taiwan · worldwide",
    body: "Built in English, Traditional Chinese or both, for businesses in Hong Kong, Taiwan, the US, the UAE and worldwide.",
  },
  {
    key: "yours",
    id: undefined,
    range: [0.948, 0.978] as const,
    lines: ["Yours to keep."],
    chip: "Full ownership",
    body: "The genome is yours: source code, documentation and infrastructure access, handed over at launch.",
  },
];

/** The notebook — the studied specimen, every part named: the fixed quote. */
export const notebook = {
  range: [0.118, 0.174] as const,
  lines: ["Every part named.", "Every price fixed."],
  lead: "After a short discovery call you receive a fixed, itemised quote naming every screen and workflow. Projects start from",
  price: { inr: site.priceFloor, usd: site.priceFloorUsd },
  label: "In writing",
  body: "A typical business website runs three to six weeks from discovery to launch. Applications are sliced so you see working software in weeks. Every project includes a support period, and you own the code completely.",
  links: [{ label: "How pricing works", href: "/pricing" }],
  fig: "Fig. 1 — a quote, itemised",
  /* An illustration of what "itemised" means — not any client's quote.
     x, y are in the specimen's own units (1 ≈ half its length). */
  parts: [
    { n: "01", label: "Home", ax: 0.58, ay: 0.08, lx: 0.98, ly: 0.52 },
    { n: "02", label: "Catalogue", ax: 0.08, ay: 0.3, lx: 0.2, ly: 0.78 },
    { n: "03", label: "Checkout", ax: -0.26, ay: 0.12, lx: -0.62, ly: 0.66 },
    { n: "04", label: "Accounts", ax: -0.84, ay: 0.12, lx: -0.92, ly: -0.56 },
    { n: "05", label: "Admin", ax: -0.2, ay: -0.2, lx: -0.34, ly: -0.74 },
    { n: "06", label: "Search", ax: 0.36, ay: -0.14, lx: 0.62, ly: -0.62 },
  ],
};

/** The cabinet — the real, shipped work, catalogued. */
export const work = {
  range: [0.392, 0.638] as const,
  items: projects.map((p) => ({
    slug: p.slug,
    chip: `${p.industry.split(" · ")[0]} · ${p.year}`,
    title: p.name,
    body: p.summary,
    cover: p.images.cover,
    url: p.url,
  })),
};

/* The lineage: every service the studio offers, as the tips of one tree. */
const clades: { label: string; slugs: string[] }[] = [
  {
    label: "Sites",
    slugs: ["landing-page-development", "portfolio-websites", "business-websites", "ecommerce"],
  },
  {
    label: "Systems",
    slugs: ["web-applications", "learning-management-systems", "admin-dashboards", "crm", "erp"],
  },
  { label: "Reach", slugs: ["mobile-apps", "ai-integrations"] },
  { label: "Care", slugs: ["website-redesign", "website-performance", "website-maintenance"] },
];
const grouped = new Set(clades.flatMap((c) => c.slugs));
const strays = services.filter((s) => !grouped.has(s.slug)).map((s) => s.slug);

export const lineage = {
  range: [0.652, 0.716] as const,
  lines: ["From a five-page site", "to a full ERP."],
  lead: "Business websites, landing pages and stores. Web applications, learning platforms, CRMs, ERPs, dashboards and mobile apps. Performance, search and care for what already exists.",
  label: "One ancestor",
  body: `All ${services.length} services descend from the same practice: written down, fixed in price, and explained in plain language.`,
  links: [
    { label: `All ${services.length} services`, href: "/services" },
    { label: `${TOOL_COUNT} free tools`, href: "/free-tools" },
  ],
  clades: [...clades, ...(strays.length ? [{ label: "More", slugs: strays }] : [])]
    .map((c) => ({
      label: c.label,
      tips: c.slugs.flatMap((slug) => {
        const s = services.find((x) => x.slug === slug);
        return s ? [{ slug, name: s.name }] : [];
      }),
    }))
    .filter((c) => c.tips.length),
};

/** The questions people ask first, arriving one at a time under the stars. */
export const questions = {
  range: [0.742, 0.856] as const,
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

/** The egg: the next generation is the visitor's own project. */
export const brief = {
  range: [0.868, 0.934] as const,
  chip: "The next one is yours",
  intro:
    "Tell me what you’re building and where it’s stuck. You’ll hear back within one business day, from the engineer who would build it.",
  fields: { name: "Your name", email: "Work email", message: "What do you want to build?" },
  submit: "Send the brief",
  done: `Received. You’ll hear from ${site.founder.split(" ")[0]} within one business day.`,
};

export const signoff = {
  range: [0.984, 1.01] as const,
  line: ["Evolve", "on purpose."],
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
  statements: typeof statements;
  notebook: typeof notebook;
  work: typeof work;
  lineage: typeof lineage;
  questions: typeof questions;
  brief: typeof brief;
  signoff: typeof signoff;
  email: string;
};

export const stageContent: StageContent = {
  hero,
  statements,
  notebook,
  work,
  lineage,
  questions,
  brief,
  signoff,
  email: site.email,
};
