import { site } from "@/data/site";
import { fmtTwd, priceBands, rangeTwd, rangeUsd } from "@/lib/fx";
import type { MarketContent } from "./types";

const floorTwd = fmtTwd(priceBands.business[0]);
const both = (band: readonly [number, number]) => `${rangeUsd(band)} (≈ ${rangeTwd(band)})`;

export const twEn: MarketContent = {
  locale: "en",
  path: "/web-development-taiwan",
  source: "market-tw-en",
  breadcrumb: { home: { name: "Home", href: "/" }, current: "Taiwan" },
  hero: {
    eyebrow: "For Taiwan businesses",
    title: ["Web design and development for ", "Taiwan", " businesses."],
    lead: `Kodinav is an independent software studio. Founder ${site.founder} personally builds fast websites, online stores and web applications for companies in Taiwan, including English websites for manufacturers and exporters selling abroad, with a fixed written quote from US$2,000 (about ${floorTwd}).`,
    primaryCta: "Get a fixed quote",
    secondaryCta: { label: "Chat on WhatsApp", href: site.whatsapp, external: true },
    notes: [`From US$2,000 (≈ ${floorTwd})`, "Launch in 3–6 weeks", "繁體中文 & English sites", "You own the code"],
  },
  facts: {
    eyebrow: "At a glance",
    title: "Kodinav for Taiwan, in eight facts.",
    items: [
      {
        term: "What gets built",
        detail: "Corporate and export websites, landing pages, e-commerce stores, web applications and mobile apps.",
      },
      {
        term: "Who builds it",
        detail: `${site.founder}, founder and software engineer. No account managers, no subcontracting.`,
      },
      {
        term: "Price",
        detail: `Business websites from US$2,000, about ${floorTwd}. Quotes are fixed in US dollars and itemised in writing.`,
      },
      {
        term: "Timeline",
        detail: "Landing pages 1–2 weeks, business websites 3–6 weeks, online stores 4–8 weeks, web apps 6–12 weeks.",
      },
      {
        term: "Languages",
        detail: "Websites in Traditional Chinese, English or both. Project communication is in English.",
      },
      {
        term: "Where the studio is",
        detail: "Delhi NCR, India. Taiwan projects run remotely over email, video calls and WhatsApp.",
      },
      {
        term: "Time zone",
        detail: "Taiwan is 2.5 hours ahead of India, so your afternoon falls inside the studio's working day.",
      },
      {
        term: "Ownership",
        detail: "Code, domain, hosting and data are registered to you from day one.",
      },
    ],
  },
  why: {
    eyebrow: "Why an independent studio",
    title: "One engineer, fully accountable.",
    lead: "Whether you sell to customers in Taipei or to buyers in Europe and the US, the website has to be fast, clear and trustworthy. That takes engineering, not a template with your logo on it.",
    items: [
      {
        title: "The person you brief builds it",
        body: "There is no hand-off from a salesperson to a junior team. The engineer on your first call designs the architecture and writes the code, so decisions are explained and nothing gets lost.",
      },
      {
        title: "English websites that win overseas buyers",
        body: "For Taiwanese manufacturers and exporters, the English website is often the first thing a foreign buyer checks. Clear product pages, specification tables and inquiry forms written for procurement teams do far more than a translated brochure.",
      },
      {
        title: "Fast wherever your customers are",
        body: "Pages are server-rendered and served from global edge networks, so a buyer in Frankfurt and a shopper in Taichung both get a site that loads in about a second.",
      },
      {
        title: "A fixed price, in writing",
        body: "An itemised quote in US dollars naming every page and feature, with milestone payments tied to working software. What is agreed is what is billed.",
      },
    ],
  },
  services: {
    eyebrow: "What Taiwan clients hire Kodinav for",
    title: "From a corporate website to a custom platform.",
    lead: "Every service below is designed, engineered and supported by the same person. NT$ figures are approximate; quotes are fixed in US dollars.",
    items: [
      {
        title: "Corporate & export websites",
        body: "Company sites and English product catalogues with specification tables and RFQ forms for overseas buyers.",
        price: `From US$2,000 (≈ ${floorTwd})`,
        href: "/services/business-websites",
        linkLabel: "Business websites",
      },
      {
        title: "E-commerce stores",
        body: "Online stores with Taiwanese payment gateways and e-invoicing, built for speed instead of a platform's limits.",
        price: `From US$4,000 (≈ ${fmtTwd(priceBands.ecommerce[0])})`,
        href: "/services/ecommerce",
        linkLabel: "E-commerce development",
      },
      {
        title: "Web applications",
        body: "Member systems, booking platforms, dashboards and internal tools shaped around how your team works.",
        price: `From US$8,000 (≈ ${fmtTwd(priceBands.webapp[0])})`,
        href: "/services/web-applications",
        linkLabel: "Custom web applications",
      },
      {
        title: "Landing pages",
        body: "Single-goal pages for Google and Meta campaigns, with conversion tracking wired in.",
        price: `From US$2,000 (≈ ${fmtTwd(priceBands.landing[0])})`,
        href: "/services/landing-page-development",
        linkLabel: "Landing page development",
      },
      {
        title: "Website redesign",
        body: "Rebuild a slow or dated site without losing the search rankings it has already earned.",
        price: "Quoted on scope",
        href: "/services/website-redesign",
        linkLabel: "Website redesign",
      },
      {
        title: "Mobile apps",
        body: "iOS and Android apps from one codebase, sharing a backend with your website.",
        price: "Quoted on scope",
        href: "/services/mobile-apps",
        linkLabel: "Mobile app development",
      },
    ],
  },
  local: {
    eyebrow: "Built for Taiwan",
    title: "The details Taiwan websites need.",
    lead: "Local payment gateways, uniform e-invoices, LINE instead of WhatsApp, and two search engines to satisfy: a Taiwan website has requirements a generic template never considers.",
    items: [
      {
        title: "Traditional Chinese done properly",
        body: "Correct zh-TW language tags, system fonts chosen for Taiwan's character standard, and a separate English version for overseas visitors when you need one. Chinese copy comes from your team.",
      },
      {
        title: "Taiwan payment gateways",
        body: "Online stores connect to local gateways such as ECPay (綠界), NewebPay (藍新) or TapPay, and to wallets such as LINE Pay or JKOPAY where your provider supports them.",
      },
      {
        title: "E-invoices at checkout",
        body: "Online sales in Taiwan generally need a uniform invoice. Checkout can issue e-invoices automatically through your payment gateway's or invoicing provider's API.",
      },
      {
        title: "LINE, where your customers already are",
        body: "LINE is the messaging app most people in Taiwan use every day. Add-friend buttons, LINE Official Account links and LINE Login keep enquiries in the app customers already have open.",
      },
      {
        title: "Google and Yahoo search",
        body: "Google leads search in Taiwan, and Yahoo's Taiwan search results come from Bing's index. Sites are set up for both Google Search Console and Bing Webmaster Tools.",
      },
      {
        title: "Personal data handled with care",
        body: "Forms collect only what is needed and say why, written with Taiwan's Personal Data Protection Act in mind.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "What it costs, in US dollars and NT dollars.",
    lead: "These are the studio's real price bands. Quotes are fixed in US dollars; NT$ figures are approximate conversions, rounded up, and your own price is set in writing after a discovery call.",
    head: ["Project", "Price", "Typical timeline"],
    rows: [
      { item: "Landing page", price: both(priceBands.landing), timeline: "1–2 weeks" },
      { item: "Business website (up to 5 pages)", price: both(priceBands.business), timeline: "3–6 weeks" },
      {
        item: "Add a second language (Traditional Chinese + English)",
        price: `+ ${both(priceBands.bilingual)}`,
        timeline: "Quoted with the site",
      },
      { item: "E-commerce store", price: both(priceBands.ecommerce), timeline: "4–8 weeks" },
      { item: "Web application", price: both(priceBands.webapp), timeline: "6–12 weeks" },
    ],
    footnote:
      "Ranges exclude add-ons such as extra pages, bookings or member accounts, which the website cost calculator prices individually. Hosting and payment-gateway fees are paid at cost on accounts you own. Large platforms can reach US$25,000 and above.",
    guide: { label: "Read the Taiwan website cost guide", href: "/blog/website-cost-taiwan-2026" },
  },
  proof: {
    eyebrow: "Proof, not promises",
    title: "Real software, delivered remotely.",
    lead: "Every project here is live software you can open. Each one was delivered remotely, which is exactly how a Taiwan project runs.",
    items: [
      {
        slug: "flaming-logistics",
        name: "Flaming Integrated Logistiks",
        body: "Enterprise logistics platform for a Lagos freight company serving international shippers: live tracking, a quote pipeline and an admin panel, built across time zones.",
        alt: "Flaming Integrated Logistiks logistics platform homepage",
      },
      {
        slug: "trinket",
        name: "Trinket",
        body: "Direct-to-consumer store for personalised keepsakes, with a shop-by-occasion flow that moved sales off high-commission marketplaces.",
        alt: "Trinket personalised keepsakes online store homepage",
      },
      {
        slug: "lighthouse-classes",
        name: "Lighthouse Classes",
        body: "Multilingual learning platform with courses, live classes and a dictionary, including right-to-left scripts. Several languages, one clean codebase.",
        alt: "Lighthouse Classes multilingual learning platform homepage",
      },
    ],
    all: { label: "All case studies", href: "/work" },
  },
  process: {
    eyebrow: "How it works",
    title: "Four steps, all online.",
    lead: "Taiwan projects run on video calls, email and a live preview link you can open any time.",
    steps: [
      {
        title: "Discovery call",
        body: "Thirty minutes on Google Meet or Zoom about your business, customers and goals, scheduled in your afternoon.",
      },
      {
        title: "Fixed quote",
        body: "A written scope naming every page and feature, with a fixed price in US dollars and a delivery date.",
      },
      {
        title: "Build in the open",
        body: "Design first, then development on a private preview link you can check from your phone at any stage.",
      },
      {
        title: "Launch and handover",
        body: "Go-live on your domain, a walkthrough for your team, documentation and a support period included.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "What Taiwan businesses ask first.",
    items: [
      {
        q: "How much does a website cost in Taiwan?",
        a: `At Kodinav, a custom corporate website costs ${both(priceBands.business)}, an e-commerce store ${both(priceBands.ecommerce)} and a web application from US$8,000 (about ${fmtTwd(priceBands.webapp[0])}), each with a fixed, itemised quote first. Prices in Taiwan range widely because template packages, freelancers and agencies are selling different products.`,
      },
      {
        q: "Can you build a Traditional Chinese and English website?",
        a: `Yes. Each language gets its own URL, correct zh-TW and English language tags, and hreflang links so Google shows each visitor the right version. Adding a second language costs ${both(priceBands.bilingual)}. Chinese copy is written or reviewed by your team so it sounds native.`,
      },
      {
        q: "Do you communicate in Chinese?",
        a: "Project communication is in English. The website itself can be entirely in Traditional Chinese, entirely in English, or both.",
      },
      {
        q: "Can my online store accept Taiwanese payments and issue e-invoices?",
        a: "Yes. Stores connect to Taiwanese gateways such as ECPay, NewebPay or TapPay, and can issue e-invoices automatically through the gateway's or an invoicing provider's API. The best gateway depends on your fees, payment methods and logistics, and it is chosen before the build starts.",
      },
      {
        q: "Do you build English websites for Taiwanese exporters?",
        a: "Yes. Product catalogues with specification tables, downloadable datasheets, RFQ forms and pages structured to rank on Google for the products overseas buyers search for. For many manufacturers it is the highest-return website project available.",
      },
      {
        q: "How long does it take to build a website?",
        a: "Landing pages take 1–2 weeks, business websites 3–6 weeks, online stores 4–8 weeks and web applications 6–12 weeks. The biggest variable is usually how quickly content and feedback come back.",
      },
      {
        q: "What time zone do you work in?",
        a: "India Standard Time, 2.5 hours behind Taiwan. The studio's working day overlaps your afternoon, and every enquiry gets a reply within one business day.",
      },
      {
        q: "Is it risky to hire a web developer outside Taiwan?",
        a: "The real risks are silence, missed deadlines and lock-in, and each is handled in writing: a fixed scope and price, a live preview link throughout, milestone payments tied to working software, and code, domain and hosting registered to you.",
      },
      {
        q: "Who owns the website when it is finished?",
        a: "You do, completely. Code, domain, hosting and content accounts are registered to you and documented at handover, so you are never locked in to the studio.",
      },
    ],
  },
  form: {
    eyebrow: "Free consultation",
    title: "Get a fixed quote for your Taiwan project.",
    lead: "Tell me what you need. You'll get a reply within one business day, with honest observations about your current site rather than a sales script.",
    orgLabel: "Company name",
    submitLabel: "Request my quote",
    budgets: [
      "US$2,000 – 5,000 (≈ NT$62,000 – 155,000)",
      "US$5,000 – 12,000 (≈ NT$155,000 – 372,000)",
      "US$12,000 – 25,000 (≈ NT$372,000 – 775,000)",
      "US$25,000+",
      "Not sure yet",
    ],
    labels: { phonePlaceholder: "+886" },
  },
  related: {
    eyebrow: "Keep reading",
    title: "Useful for Taiwan businesses.",
    links: [
      {
        label: "How much does a website cost in Taiwan?",
        href: "/blog/website-cost-taiwan-2026",
        note: "The 2026 guide to price bands, in US$ and NT$.",
      },
      {
        label: "Taiwan business tax calculator",
        href: "/taiwan-business-tax-calculator",
        note: "Add or remove 5% business tax, in whole NT dollars.",
      },
      {
        label: "Free website audit",
        href: "/free-website-audit",
        note: "Speed, mobile, SEO and trust checks on your current site in about a minute.",
      },
      {
        label: "網站架設與網頁設計（繁體中文）",
        href: "/zh-tw",
        note: "This page in Traditional Chinese.",
      },
    ],
  },
  schema: {
    name: "Web design and development for Taiwan businesses",
    description: `Custom websites, e-commerce stores and web applications for Taiwan companies and exporters, built by founder ${site.founder}. Fixed quotes from US$2,000.`,
    area: { "@type": "Country", name: "Taiwan" },
    currency: "USD",
    minPrice: priceBands.business[0],
  },
};
