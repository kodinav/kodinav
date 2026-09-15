import type { Channel } from "./analyticsTypes";

/**
 * Referrer / UTM → a named source and a channel. Kept separate from the
 * storage code so leads (whose attribution is captured at form submit) are
 * classified with exactly the same rules as page views.
 */

const RULES: [RegExp, string, Channel][] = [
  // AI assistants first: several live on search-engine domains
  [/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$|(^|\.)openai\.com$/, "ChatGPT", "AI assistants"],
  [/(^|\.)perplexity\.ai$/, "Perplexity", "AI assistants"],
  [/(^|\.)copilot\.microsoft\.com$/, "Copilot", "AI assistants"],
  [/(^|\.)gemini\.google\.com$|(^|\.)bard\.google\.com$/, "Gemini", "AI assistants"],
  [/(^|\.)claude\.ai$/, "Claude", "AI assistants"],
  [/(^|\.)you\.com$|(^|\.)phind\.com$|(^|\.)deepseek\.com$|(^|\.)meta\.ai$/, "Other AI", "AI assistants"],
  // Search engines
  [/(^|\.)google\.[a-z.]+$/, "Google", "Search"],
  [/(^|\.)bing\.com$/, "Bing", "Search"],
  [/(^|\.)yahoo\.[a-z.]+$/, "Yahoo", "Search"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo", "Search"],
  [/(^|\.)baidu\.com$/, "Baidu", "Search"],
  [/(^|\.)ecosia\.org$/, "Ecosia", "Search"],
  [/(^|\.)naver\.com$/, "Naver", "Search"],
  [/(^|\.)yandex\.[a-z.]+$/, "Yandex", "Search"],
  // Social and messaging
  [/(^|\.)facebook\.com$|(^|\.)fb\.me$/, "Facebook", "Social"],
  [/(^|\.)instagram\.com$/, "Instagram", "Social"],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, "LinkedIn", "Social"],
  [/(^|\.)t\.co$|(^|\.)x\.com$|(^|\.)twitter\.com$/, "X", "Social"],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, "YouTube", "Social"],
  [/(^|\.)reddit\.com$/, "Reddit", "Social"],
  [/(^|\.)threads\.net$/, "Threads", "Social"],
  [/(^|\.)line\.me$/, "LINE", "Social"],
  [/(^|\.)whatsapp\.com$|(^|\.)wa\.me$/, "WhatsApp", "Social"],
];

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export function classifySource(input: {
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  gclid?: boolean;
}): { source: string; channel: Channel } {
  const medium = (input.utmMedium ?? "").toLowerCase();
  if (input.gclid) return { source: "Google Ads", channel: "Paid" };
  if (input.utmSource) {
    const paid = /^(cpc|ppc|paid|paidsearch|paid_social|paidsocial|display|ads?)$/.test(medium);
    // "google (cpc)" — keeps tagged campaigns visibly apart from organic "Google"
    const label = `${input.utmSource.slice(0, 40)}${medium ? ` (${medium.slice(0, 20)})` : ""}`;
    return { source: label, channel: paid ? "Paid" : "Campaign" };
  }
  const host = input.referrer ? hostOf(input.referrer) : "";
  if (!host) return { source: "Direct", channel: "Direct" };
  if (host === "kodinav.com") return { source: "Direct", channel: "Direct" };
  for (const [re, source, channel] of RULES) {
    if (re.test(host)) return { source, channel };
  }
  return { source: host, channel: "Referral" };
}
