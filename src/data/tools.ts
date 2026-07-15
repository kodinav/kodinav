/**
 * Single source of truth for the free-tools suite. The mega-menu, footer,
 * hub page and per-tool "related service" funnel all read from here, so the
 * tool catalogue is described once and never drifts out of sync.
 *
 * `service` is the paid service each tool naturally funnels into — the whole
 * point of the free suite is to earn trust and route serious visitors to the
 * work we actually sell.
 */

export type ToolGroup = "diagnose" | "generate" | "business";

export type Tool = {
  href: string;
  name: string;
  /** One line for cards and menus. */
  blurb: string;
  group: ToolGroup;
  /** Slug of the service this tool funnels toward. */
  service: string;
  /** Surfaced in the desktop mega-menu (kept short). */
  featured?: boolean;
};

export const toolGroups: { id: ToolGroup; title: string; eyebrow: string; blurb: string }[] = [
  {
    id: "diagnose",
    title: "Check & test",
    eyebrow: "Fig. 01 — Diagnostics",
    blurb: "See exactly what's helping or hurting a website, in plain language.",
  },
  {
    id: "generate",
    title: "Generate",
    eyebrow: "Fig. 02 — Generators",
    blurb: "The links, codes, markup and documents a business website needs — made in seconds.",
  },
  {
    id: "business",
    title: "Calculate & paperwork",
    eyebrow: "Fig. 03 — Business",
    blurb: "Pricing, tax and invoicing tools for running the business behind the website.",
  },
];

export const tools: Tool[] = [
  // ---- Diagnose ----
  {
    href: "/free-website-audit",
    name: "Free Website Audit",
    blurb: "The full picture in one scan: speed, mobile, SEO, conversion and trust, in plain language.",
    group: "diagnose",
    service: "website-performance",
    featured: true,
  },
  {
    href: "/website-speed-test",
    name: "Website Speed Test",
    blurb: "Server response, page weight and Google's own mobile score — in business terms.",
    group: "diagnose",
    service: "website-performance",
    featured: true,
  },
  {
    href: "/mobile-friendly-test",
    name: "Mobile-Friendly Test",
    blurb: "Google retired its mobile test; this one carries on the job.",
    group: "diagnose",
    service: "website-performance",
  },
  {
    href: "/compare-websites",
    name: "Compare Two Websites",
    blurb: "Your site against a competitor's, winner marked on every row.",
    group: "diagnose",
    service: "website-redesign",
    featured: true,
  },
  {
    href: "/link-preview-checker",
    name: "Link Preview Checker",
    blurb: "The exact card WhatsApp and LinkedIn show for your link — and your Google snippet.",
    group: "diagnose",
    service: "business-websites",
  },
  {
    href: "/broken-link-checker",
    name: "Broken Link Checker",
    blurb: "Every link on a page tested; the dead ones named with their anchor text.",
    group: "diagnose",
    service: "website-maintenance",
  },
  {
    href: "/redirect-checker",
    name: "Redirect Checker",
    blurb: "Every hop between the click and the page — plus all four versions of your domain.",
    group: "diagnose",
    service: "website-redesign",
  },
  {
    href: "/ssl-checker",
    name: "SSL Checker",
    blurb: "Certificate expiry, days remaining, and whether browsers trust the chain.",
    group: "diagnose",
    service: "website-maintenance",
  },
  {
    href: "/is-my-website-down",
    name: "Is My Website Down?",
    blurb: "Down for everyone or just you — answered by a live check from our server.",
    group: "diagnose",
    service: "website-maintenance",
  },
  // ---- Generate ----
  {
    href: "/whatsapp-link-generator",
    name: "WhatsApp Link Generator",
    blurb: "One-tap chat link with message templates, a QR code and a website chat button.",
    group: "generate",
    service: "business-websites",
    featured: true,
  },
  {
    href: "/google-review-link-generator",
    name: "Google Review Link",
    blurb: "A one-tap review link, a printable counter sign, and ready-to-send ask messages.",
    group: "generate",
    service: "business-websites",
    featured: true,
  },
  {
    href: "/qr-code-generator",
    name: "QR Code Generator",
    blurb: "Links, Wi-Fi, contact cards, UPI payments — with your logo, never expires.",
    group: "generate",
    service: "business-websites",
    featured: true,
  },
  {
    href: "/og-image-generator",
    name: "OG Image Generator",
    blurb: "A clean 1200×630 share card from a headline and your colours.",
    group: "generate",
    service: "business-websites",
  },
  {
    href: "/schema-markup-generator",
    name: "Schema Markup Generator",
    blurb: "LocalBusiness, FAQ, Service and Organization JSON-LD from a simple form.",
    group: "generate",
    service: "website-performance",
  },
  {
    href: "/privacy-policy-generator",
    name: "Legal Pages Generator",
    blurb: "Privacy policy, terms, refund and cookie policy — all four from one form.",
    group: "generate",
    service: "business-websites",
  },
  {
    href: "/email-signature-generator",
    name: "Email Signature Generator",
    blurb: "A clean signature that renders correctly in Gmail and Outlook.",
    group: "generate",
    service: "business-websites",
  },
  {
    href: "/utm-builder",
    name: "UTM Link Builder",
    blurb: "Tagged campaign links that report cleanly in Google Analytics.",
    group: "generate",
    service: "landing-page-development",
  },
  // ---- Business ----
  {
    href: "/website-cost-calculator",
    name: "Website Cost Calculator",
    blurb: "An honest price range for your website, store or web app — the studio's real numbers.",
    group: "business",
    service: "business-websites",
    featured: true,
  },
  {
    href: "/invoice-generator",
    name: "Invoice Generator",
    blurb: "A clean GST/VAT-ready invoice with a UPI payment QR, straight to PDF.",
    group: "business",
    service: "web-applications",
  },
  {
    href: "/vat-calculator-uae",
    name: "UAE VAT Calculator",
    blurb: "Add 5% VAT or split it out of an inclusive AED price.",
    group: "business",
    service: "business-websites",
  },
  {
    href: "/gst-calculator-india",
    name: "GST Calculator (India)",
    blurb: "All slabs, both directions, with the CGST/SGST split.",
    group: "business",
    service: "web-applications",
  },
  {
    href: "/compress-images",
    name: "Image Compressor",
    blurb: "Photos resized and WebP-encoded on your own device — no upload.",
    group: "business",
    service: "website-performance",
  },
];

export const toolsByGroup = (group: ToolGroup) => tools.filter((t) => t.group === group);
export const featuredTools = tools.filter((t) => t.featured);
export const getTool = (href: string) => tools.find((t) => t.href === href);
export const TOOL_COUNT = tools.length;
