import type { Metadata, Viewport } from "next";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";

/**
 * Metadata shared by every root layout. The site has one root layout per
 * document language — (en), zh-hk, zh-tw — because <html lang> can only be
 * set by a root layout, and each language needs its own. This module keeps
 * them from drifting apart.
 */

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Extend the paper background under the iPhone notch / Dynamic Island;
  // fixed elements pad themselves with env(safe-area-inset-*).
  viewportFit: "cover",
  themeColor: "#f4f3ee",
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // ≤60 chars so Google shows it untruncated in SERPs
    default: `${site.name} — Website Development & Custom Web Apps`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.founder, url: site.url }],
  creator: site.founder,
  publisher: site.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_HK", "zh_TW"],
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    // Explicit, because pages that set no openGraph of their own (the home
    // page, privacy, terms) were shipping without a share card: the
    // app/opengraph-image file convention stopped applying once the root
    // segment lost its layout to the per-language root layouts.
    images: ogImage(`${site.name} — ${site.tagline}`),
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ogImage(`${site.name} — ${site.tagline}`).map((i) => i.url),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  // Google Search Console verification. Present both as a DNS TXT record and
  // here as an HTML meta tag, so a URL-prefix property verifies instantly
  // without waiting on Google's DNS cache. Override via env var if needed.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "9EfehS5fC17OPIdiq4iYrrrTR5EeBVwhno6duhgYp3A",
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

/**
 * Root metadata for a Traditional Chinese layout. Drops the English
 * defaults a Chinese page must never inherit — the "/" canonical and the
 * English title/description — so a zh page that forgets its own canonical
 * fails loudly in review instead of silently canonicalising to the
 * English homepage.
 */
export function zhRootMetadata(locale: "zh-HK" | "zh-TW"): Metadata {
  const ogLocale = locale === "zh-HK" ? "zh_HK" : "zh_TW";
  return {
    ...rootMetadata,
    title: { default: site.name, template: `%s｜${site.name}` },
    description: undefined,
    keywords: undefined,
    alternates: { types: { "application/rss+xml": "/feed.xml" } },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: ["en_US", locale === "zh-HK" ? "zh_TW" : "zh_HK"],
      siteName: site.name,
    },
    twitter: { card: "summary_large_image" },
  };
}
