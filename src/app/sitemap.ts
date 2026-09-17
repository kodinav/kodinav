import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { clusterFor } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  // Real content dates, bumped manually when pages meaningfully change.
  // A `new Date()` here stamped every URL as modified on every regeneration
  // (every 5 min under revalidate), which teaches Google to distrust lastmod.
  // Bumped for the 2026-07-18 "Meridian" full-site redesign relaunch.
  const now = new Date("2026-07-18");
  // Hong Kong & Taiwan launch: new market pages, zh-HK / zh-TW sections, tools
  const hkTwLaunch = new Date("2026-09-16");

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/process`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/website-audit`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/free-website-audit`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/free-tools`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/website-cost-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/website-speed-test`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/qr-code-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/link-preview-checker`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/compare-websites`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/schema-markup-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/privacy-policy-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/redirect-checker`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/broken-link-checker`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/compress-images`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/og-image-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/utm-builder`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/is-my-website-down`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/vat-calculator-uae`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/gst-calculator-india`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/invoice-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/email-signature-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/ssl-checker`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/mobile-friendly-test`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/whatsapp-link-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/google-review-link-generator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/coaching-institute-websites`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/clinic-websites`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/web-development-dubai`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/web-development-usa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Hong Kong & Taiwan — English market pages and tools
    { url: `${site.url}/web-development-hong-kong`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/web-development-taiwan`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/fps-qr-code-generator`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/zh-hk/fps-qr-code-generator`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/hong-kong-profits-tax-calculator`, lastModified: hkTwLaunch, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/taiwan-business-tax-calculator`, lastModified: hkTwLaunch, changeFrequency: "yearly", priority: 0.7 },
    // Traditional Chinese sections
    { url: `${site.url}/zh-hk`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/zh-hk/website-cost`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/zh-hk/online-shop-guide`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/zh-hk/ai-website-builder`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/zh-hk/profits-tax-calculator`, lastModified: hkTwLaunch, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/zh-tw`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/zh-tw/website-cost`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/zh-tw/business-tax-calculator`, lastModified: hkTwLaunch, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/zh-tw/online-shop-guide`, lastModified: hkTwLaunch, changeFrequency: "monthly", priority: 0.8 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // Every URL in an hreflang cluster lists the whole cluster, mirroring the
  // <link rel="alternate"> tags on the pages themselves.
  return [...staticPages, ...servicePages, ...projectPages, ...postPages].map((entry) => {
    const cluster = clusterFor(entry.url.slice(site.url.length) || "/");
    if (!cluster) return entry;
    const languages = Object.fromEntries(
      Object.entries(cluster).map(([lang, path]) => [lang, `${site.url}${path}`])
    );
    return { ...entry, alternates: { languages } };
  });
}
