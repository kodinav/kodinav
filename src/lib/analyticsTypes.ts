/** Client-safe analytics types (no Node imports). */

export type Channel = "Search" | "AI assistants" | "Social" | "Paid" | "Campaign" | "Referral" | "Direct";

/** A page view as stored. `v` is a daily-rotating visitor hash, never an IP. */
export type PageviewEvent = {
  t: "pv";
  ts: number;
  id: string;
  sid: string;
  v: string;
  p: string;
  ref: string; // referrer host + path, external only
  src: string; // classified source, e.g. "Google", "ChatGPT", "Direct"
  ch: Channel;
  us?: string;
  um?: string;
  uc?: string;
  c: string; // ISO 3166-1 alpha-2, or "ZZ" when unknown
  lang: string; // document language of the page (en / zh-HK / zh-TW)
  dev: "mobile" | "tablet" | "desktop";
  n?: 1; // first visit on this browser
};

export type LeaveEvent = { t: "lv"; ts: number; id: string; ms: number };

export type CustomEvent = {
  t: "ev";
  ts: number;
  n: string; // whatsapp | email | phone | lead | audit
  p: string;
  s?: string;
  sid: string;
  v: string;
  c: string;
};

export type AnalyticsEvent = PageviewEvent | LeaveEvent | CustomEvent;

export type Row = { key: string; label: string; value: number; sub?: string; emphasis?: boolean };

export type DailyPoint = {
  date: string; // YYYY-MM-DD
  pageviews: number;
  visitors: number;
  visits: number;
  leads: number;
  contacts: number; // WhatsApp + email + phone clicks
};

export type Totals = {
  pageviews: number;
  visitors: number;
  visits: number;
  avgEngagedSec: number;
  bounceRate: number; // 0..1, single-page visits
  leads: number;
  contacts: number;
  whatsapp: number;
};

export type MarketSnapshot = {
  code: "HK" | "TW";
  name: string;
  visits: number;
  pageviews: number;
  contacts: number;
  leads: number;
  zhPageviews: number;
};

export type AnalyticsSummary = {
  from: string;
  to: string;
  days: number;
  generatedAt: string;
  storage: "file" | "redis";
  totals: Totals;
  previous: Totals;
  daily: DailyPoint[];
  realtime: number;
  markets: MarketSnapshot[];
  channels: Row[];
  sources: Row[];
  aiSources: Row[];
  campaigns: Row[];
  pages: (Row & { avgSec: number; entries: number })[];
  landingPages: Row[];
  countries: Row[];
  languages: Row[];
  devices: Row[];
  events: Row[];
  leadSources: Row[];
  leadChannels: Row[];
};
