/**
 * hreflang clusters for the Hong Kong / Taiwan market pages.
 *
 * Each cluster lists the regional and language variants of ONE page. Every
 * member must emit the full cluster (hreflang annotations are only honoured
 * when they are reciprocal), so pages and the sitemap both read from here
 * instead of hand-writing link tags that drift out of sync.
 *
 *   en-HK  English, for Hong Kong        zh-HK  Traditional Chinese, Hong Kong
 *   en-TW  English, for Taiwan           zh-TW  Traditional Chinese, Taiwan
 */
export const hreflangClusters = {
  market: {
    "en-HK": "/web-development-hong-kong",
    "en-TW": "/web-development-taiwan",
    "zh-HK": "/zh-hk",
    "zh-TW": "/zh-tw",
    "x-default": "/web-development-hong-kong",
  },
  cost: {
    "en-HK": "/blog/website-cost-hong-kong-2026",
    "en-TW": "/blog/website-cost-taiwan-2026",
    "zh-HK": "/zh-hk/website-cost",
    "zh-TW": "/zh-tw/website-cost",
    "x-default": "/blog/website-cost-hong-kong-2026",
  },
  profitsTax: {
    en: "/hong-kong-profits-tax-calculator",
    "zh-HK": "/zh-hk/profits-tax-calculator",
    "x-default": "/hong-kong-profits-tax-calculator",
  },
  fpsQr: {
    en: "/fps-qr-code-generator",
    "zh-HK": "/zh-hk/fps-qr-code-generator",
    "x-default": "/fps-qr-code-generator",
  },
  businessTax: {
    en: "/taiwan-business-tax-calculator",
    "zh-TW": "/zh-tw/business-tax-calculator",
    "x-default": "/taiwan-business-tax-calculator",
  },
} as const satisfies Record<string, Record<string, string>>;

export type HreflangCluster = keyof typeof hreflangClusters;

/** `alternates` metadata for a page: its own canonical plus its cluster. */
export function localeAlternates(cluster: HreflangCluster, canonical: string) {
  return { canonical, languages: { ...hreflangClusters[cluster] } };
}

/** The cluster (if any) a path belongs to — used by the sitemap. */
export function clusterFor(path: string): Record<string, string> | undefined {
  for (const cluster of Object.values(hreflangClusters)) {
    if ((Object.values(cluster) as string[]).includes(path)) return cluster;
  }
  return undefined;
}
