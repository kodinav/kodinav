/** Client-safe audit types & constants (no Node imports). */

export const CATEGORIES = [
  "speed",
  "mobile",
  "seo",
  "conversion",
  "trust",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Reserved status scale. Never reused for anything that is not a state. */
export type Severity = "critical" | "warning" | "pass";

export type Finding = {
  id: string;
  category: Category;
  severity: Severity;
  /** What the check is, in the owner's language. */
  title: string;
  /** The measured fact. This is the part that must always be true and specific. */
  detail: string;
  /** What to do about it. Empty on a pass. */
  fix?: string;
};

export type AuditResult = {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  ttfbMs: number;
  htmlBytes: number;
  domElements: number;
  overall: number;
  scores: Record<Category, number>;
  findings: Finding[];
  /** The single most damning true sentence. Doubles as the cold-outreach opener. */
  headline: string;
};

/** Google PageSpeed Insights, fetched separately so a slow lab run never blocks the scan. */
export type SpeedResult = {
  performance: number | null;
  lcpMs: number | null;
  tbtMs: number | null;
  cls: number | null;
};

export const CATEGORY_META: Record<
  Category,
  { label: string; blurb: string; fig: string }
> = {
  speed: {
    label: "Speed",
    blurb: "How long a visitor waits before anything useful appears.",
    fig: "FIG. 01",
  },
  mobile: {
    label: "Mobile",
    blurb: "Whether the site works on the phone most visitors arrive on.",
    fig: "FIG. 02",
  },
  seo: {
    label: "Findability",
    blurb: "Whether Google can understand and rank the page.",
    fig: "FIG. 03",
  },
  conversion: {
    label: "Enquiries",
    blurb: "Whether a ready-to-buy visitor can actually reach you.",
    fig: "FIG. 04",
  },
  trust: {
    label: "Trust",
    blurb: "The signals that decide whether a stranger believes the site.",
    fig: "FIG. 05",
  },
};

/**
 * Score bands. The word is what carries the meaning; the colour only ever
 * reinforces it, so the result stays readable in greyscale and to a
 * colourblind reader.
 */
export function scoreBand(score: number): {
  word: string;
  severity: Severity;
} {
  if (score >= 80) return { word: "Healthy", severity: "pass" };
  if (score >= 50) return { word: "Needs work", severity: "warning" };
  return { word: "Losing you customers", severity: "critical" };
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  warning: "Worth fixing",
  pass: "Passed",
};
