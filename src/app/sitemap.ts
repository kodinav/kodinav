import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Real content dates, bumped manually when pages meaningfully change.
  // A `new Date()` here stamped every URL as modified on every regeneration
  // (every 5 min under revalidate), which teaches Google to distrust lastmod.
  // Bumped for the 2026-07-18 "Meridian" full-site redesign relaunch.
  const now = new Date("2026-07-18");

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

  return [...staticPages, ...servicePages, ...projectPages, ...postPages];
}
