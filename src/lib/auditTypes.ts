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

/* ------------------------------------------------------------------ *
 * Link preview checker
 * ------------------------------------------------------------------ */

export type PreviewIssue = {
  severity: "critical" | "warning";
  text: string;
  fix: string;
};

export type LinkPreview = {
  finalUrl: string;
  /** <title> — the SERP + fallback preview title. */
  title: string | null;
  /** meta description. */
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogSiteName: string | null;
  /** Absolute og:image URL, if declared and resolvable. */
  ogImage: string | null;
  twitterCard: string | null;
  /** Result of probing the og:image itself; null when nothing conclusive. */
  image: { status: number; type: string | null } | null;
  issues: PreviewIssue[];
};

/* ------------------------------------------------------------------ *
 * Redirect tracer, broken-link checker, SSL inspector
 * ------------------------------------------------------------------ */

export type RedirectHop = { url: string; status: number };

export type RedirectTrace = {
  hops: RedirectHop[];
  finalUrl: string;
  finalStatus: number;
  /** Time from first request to final response headers. */
  totalMs: number;
};

export type LinkCheckState = "ok" | "broken" | "server-error" | "blocked" | "unreachable";

export type LinkCheck = {
  url: string;
  /** Anchor text as written on the page, truncated. */
  text: string;
  status: number | null;
  state: LinkCheckState;
};

export type LinkCheckResult = {
  finalUrl: string;
  totalFound: number;
  checked: LinkCheck[];
  /** True when the page had more unique links than the per-scan cap. */
  capped: boolean;
};

export type SslInfo = {
  host: string;
  /** Whether Node's CA store accepted the full chain. */
  trusted: boolean;
  trustError: string | null;
  issuer: string | null;
  subject: string | null;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  altNames: string[];
};
