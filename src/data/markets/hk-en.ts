import { site } from "@/data/site";
import { fmtHkd, priceBands, rangeHkd, toHkd } from "@/lib/fx";
import type { MarketContent } from "./types";

const floor = fmtHkd(priceBands.business[0]);

export const hkEn: MarketContent = {
  locale: "en",
  path: "/web-development-hong-kong",
  source: "market-hk-en",
  breadcrumb: { home: { name: "Home", href: "/" }, current: "Hong Kong" },
  hero: {
    eyebrow: "For Hong Kong businesses",
    title: ["Web design and development for ", "Hong Kong", " businesses."],
    lead: `Kodinav is an independent software studio. Founder ${site.founder} personally designs and builds fast, bilingual-ready websites, online shops and web applications for Hong Kong companies, with a fixed written quote from ${floor} and nobody standing between you and the engineer.`,
    primaryCta: "Get a fixed quote",
    secondaryCta: { label: "Chat on WhatsApp", href: site.whatsapp, external: true },
    notes: [`From ${floor}, fixed`, "Launch in 3–6 weeks", "English & 繁體中文 ready", "You own the code"],
  },
  facts: {
    eyebrow: "At a glance",
    title: "Kodinav for Hong Kong, in eight facts.",
    items: [
      {
        term: "What gets built",
        detail: "Business websites, landing pages, e-commerce stores, web applications and mobile apps.",
      },
      {
        term: "Who builds it",
        detail: `${site.founder}, founder and software engineer. No account managers, no subcontracting.`,
      },
      {
        term: "Price",
        detail: `Business websites from ${floor} (US$2,000). Every project gets a fixed, itemised quote in writing.`,
      },
      {
        term: "Timeline",
        detail: "Landing pages 1–2 weeks, business websites 3–6 weeks, online stores 4–8 weeks, web apps 6–12 weeks.",
      },
      {
        term: "Languages",
        detail: "Websites in English, Traditional Chinese or both. Project communication is in English.",
      },
      {
        term: "Where the studio is",
        detail: "Delhi NCR, India. Hong Kong projects run remotely over WhatsApp, email and video calls.",
      },
      {
        term: "Time zone",
        detail: "Hong Kong is 2.5 hours ahead of India, so your afternoon falls inside the studio's working day.",
      },
      {
        term: "Ownership",
        detail: "Code, domain, hosting and data are registered to you from day one.",
      },
    ],
  },
  why: {
    eyebrow: "Why an independent studio",
    title: "Senior engineering you can talk to directly.",
    lead: "Hong Kong has no shortage of web agencies. What is harder to find is the person who actually writes the code, available on WhatsApp, quoting a price that reflects the work rather than the overhead.",
    items: [
      {
        title: "The person you brief builds it",
        body: "Agencies often pitch with senior people and deliver with juniors. At Kodinav the engineer on your first call writes every line, so nothing gets lost between the sales meeting and the build.",
      },
      {
        title: "Fast on the phones your customers use",
        body: "Most customers will meet your business on a phone first. Pages are server-rendered, images are sized for each device and scripts are kept to a minimum, so sub-second loads are the default rather than an upsell.",
      },
      {
        title: "Bilingual without the mess",
        body: "English and Traditional Chinese versions share one codebase, with their own URLs, language tags and hreflang links, so Google shows each customer the right language and neither version feels like an afterthought.",
      },
      {
        title: "A fixed price you can take to your boss",
        body: "You receive an itemised quote in HKD or USD naming every page and feature. What is agreed is what is billed, with milestone payments tied to working software.",
      },
    ],
  },
  services: {
    eyebrow: "What Hong Kong clients hire Kodinav for",
    title: "From a company website to a custom platform.",
    lead: "Every service below is designed, engineered and supported by the same person. Prices are the studio's real starting points in Hong Kong dollars.",
    items: [
      {
        title: "Business websites",
        body: "Company and professional-services sites that explain what you do clearly and turn visitors into enquiries.",
        price: `From ${floor}`,
        href: "/services/business-websites",
        linkLabel: "Business websites",
      },
      {
        title: "E-commerce stores",
        body: "Online shops with your catalogue, checkout and payments, built for speed instead of a theme's limits.",
        price: `From ${fmtHkd(priceBands.ecommerce[0])}`,
        href: "/services/ecommerce",
        linkLabel: "E-commerce development",
      },
      {
        title: "Web applications",
        body: "Booking systems, customer portals, dashboards and internal tools shaped around how your team works.",
        price: `From ${fmtHkd(priceBands.webapp[0])}`,
        href: "/services/web-applications",
        linkLabel: "Custom web applications",
      },
      {
        title: "Landing pages",
        body: "Single-goal pages for Google and Meta ad campaigns, with conversion tracking wired in.",
        price: `From ${fmtHkd(priceBands.landing[0])}`,
        href: "/services/landing-page-development",
        linkLabel: "Landing page development",
      },
      {
        title: "Website redesign",
        body: "Rebuild a slow or dated website without throwing away the Google rankings it has already earned.",
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
    eyebrow: "Built for Hong Kong",
    title: "The details Hong Kong websites need.",
    lead: "Two written languages, WhatsApp-first customers, local payment methods and a personal data law: a Hong Kong website has requirements a generic template ignores.",
    items: [
      {
        title: "English and Traditional Chinese",
        body: "A separate URL for each language, correct lang and hreflang tags, and a language switch that keeps visitors on the same page. Chinese copy is supplied or reviewed by your team so it reads naturally.",
      },
      {
        title: "Payments Hong Kong customers use",
        body: "Cards through gateways such as Stripe or PayPal, and FPS, AlipayHK or WeChat Pay HK through a payment provider that supports them. The right mix depends on your customers and fees.",
      },
      {
        title: "WhatsApp at the centre",
        body: "Click-to-chat buttons, pre-filled enquiry messages and WhatsApp Business links wherever a customer decides to get in touch.",
      },
      {
        title: "Privacy-conscious forms",
        body: "Enquiry and booking forms that collect only what you need, say what the data is for and link a clear privacy policy, built with the Personal Data (Privacy) Ordinance's collection principles in mind.",
      },
      {
        title: "Found on Google Hong Kong",
        body: "Server-rendered pages, schema markup and page titles written for the way people in Hong Kong search, in both languages.",
      },
      {
        title: "Served from nearby",
        body: "Sites deploy on content delivery networks such as Cloudflare or Vercel, which serve pages from edge locations in Hong Kong itself.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing in HKD",
    title: "What it costs, in Hong Kong dollars.",
    lead: "These are the studio's real price bands, converted from US dollars at the HKD peg and rounded up. Your own price is fixed in writing after a short discovery call.",
    head: ["Project", "Price (HKD)", "Typical timeline"],
    rows: [
      { item: "Landing page", price: rangeHkd(priceBands.landing), timeline: "1–2 weeks" },
      { item: "Business website (up to 5 pages)", price: rangeHkd(priceBands.business), timeline: "3–6 weeks" },
      {
        item: "Add a second language (English + Traditional Chinese)",
        price: `+ ${rangeHkd(priceBands.bilingual)}`,
        timeline: "Quoted with the site",
      },
      { item: "E-commerce store", price: rangeHkd(priceBands.ecommerce), timeline: "4–8 weeks" },
      { item: "Web application", price: rangeHkd(priceBands.webapp), timeline: "6–12 weeks" },
    ],
    footnote: `Ranges exclude add-ons such as extra pages, bookings or customer accounts, which the website cost calculator prices individually. Hosting runs at cost on accounts you own. Large platforms can reach HK$${toHkd(25000).toLocaleString("en-US")} and above.`,
    guide: { label: "Read the Hong Kong website cost guide", href: "/blog/website-cost-hong-kong-2026" },
  },
  proof: {
    eyebrow: "Proof, not promises",
    title: "Real software, delivered remotely.",
    lead: "Every project here is live software you can open. Each one was delivered remotely, which is exactly how a Hong Kong project runs.",
    items: [
      {
        slug: "flaming-logistics",
        name: "Flaming Integrated Logistiks",
        body: "Enterprise logistics platform for a Lagos freight company: live shipment tracking, a quote pipeline and a full admin panel, built entirely across time zones.",
        alt: "Flaming Integrated Logistiks logistics platform homepage",
      },
      {
        slug: "lighthouse-classes",
        name: "Lighthouse Classes",
        body: "Multilingual learning platform with courses, live classes and a dictionary, including right-to-left Urdu and Persian. Several languages, one clean codebase.",
        alt: "Lighthouse Classes multilingual learning platform homepage",
      },
      {
        slug: "kosmo-dental-clinic",
        name: "Kosmo Dental Clinic",
        body: "Clinic website that captures appointment requests around the clock, with call and WhatsApp one tap away on mobile.",
        alt: "Kosmo Dental Clinic website homepage",
      },
    ],
    all: { label: "All case studies", href: "/work" },
  },
  process: {
    eyebrow: "How it works",
    title: "Four steps, all online.",
    lead: "Hong Kong projects run on video calls, WhatsApp and a live preview link. You never need to leave your office.",
    steps: [
      {
        title: "Discovery call",
        body: "Thirty minutes on Zoom, Google Meet or WhatsApp about your business and goals, scheduled in your afternoon.",
      },
      {
        title: "Fixed quote",
        body: "A written scope naming every page and feature, with a fixed price in HKD or USD and a delivery date.",
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
    title: "What Hong Kong businesses ask first.",
    items: [
      {
        q: "How much does a website cost in Hong Kong?",
        a: `At Kodinav, a custom business website costs ${rangeHkd(priceBands.business)}, an e-commerce store ${rangeHkd(priceBands.ecommerce)} and a web application from ${fmtHkd(priceBands.webapp[0])}, each with a fixed, itemised quote before work starts. Prices across Hong Kong vary widely because template setups, freelancers and agencies are selling very different things.`,
      },
      {
        q: "Can you build a bilingual English and Chinese website?",
        a: `Yes. Each language gets its own URL, correct language and hreflang tags so Google serves the right version, and a switcher that keeps visitors on the same page. Adding a second language costs ${rangeHkd(priceBands.bilingual)}. Chinese copy is written or reviewed by your team so it reads naturally.`,
      },
      {
        q: "Do you communicate in Chinese?",
        a: "Project communication is in English, which is widely used in Hong Kong business. The website itself can be entirely in Traditional Chinese, entirely in English, or both.",
      },
      {
        q: "Is it risky to hire a web developer outside Hong Kong?",
        a: "The real risks are silence, missed deadlines and lock-in, and each is handled in writing: a fixed scope and price, a live preview link throughout, milestone payments tied to working software, and code, domain and hosting registered to you. Every project in the portfolio is live, so you can check the work before deciding.",
      },
      {
        q: "How long does it take to build a website?",
        a: "Landing pages take 1–2 weeks, business websites 3–6 weeks, online stores 4–8 weeks and web applications 6–12 weeks. The biggest variable is usually how quickly content and feedback come back.",
      },
      {
        q: "What time zone do you work in?",
        a: "India Standard Time, 2.5 hours behind Hong Kong. The studio's working day overlaps your afternoon, and every enquiry gets a reply within one business day.",
      },
      {
        q: "Which payment methods can my online shop accept?",
        a: "Card payments through gateways such as Stripe or PayPal, plus FPS, AlipayHK or WeChat Pay HK through payment providers that support Hong Kong merchants. The right combination depends on your customers, fees and settlement needs, and it is agreed before the build starts.",
      },
      {
        q: "Will my website rank on Google in Hong Kong?",
        a: "No honest developer can promise rankings. What Kodinav does promise is the technical foundation Google rewards: fast server-rendered pages, clean structure, schema markup and titles written for Hong Kong searches in both languages. Rankings then grow with your content and reputation.",
      },
      {
        q: "Who owns the website when it is finished?",
        a: "You do, completely. Code, domain, hosting and content accounts are registered to you and documented at handover, so you are never locked in to the studio.",
      },
    ],
  },
  form: {
    eyebrow: "Free consultation",
    title: "Get a fixed quote for your Hong Kong project.",
    lead: "Tell me what you need. You'll get a reply within one business day, with honest observations about your current site rather than a sales script.",
    orgLabel: "Company name",
    submitLabel: "Request my quote",
    budgets: ["HK$16,000 – 40,000", "HK$40,000 – 100,000", "HK$100,000 – 200,000", "HK$200,000+", "Not sure yet"],
    labels: { phonePlaceholder: "+852" },
  },
  related: {
    eyebrow: "Keep reading",
    title: "Useful for Hong Kong businesses.",
    links: [
      {
        label: "How much does a website cost in Hong Kong?",
        href: "/blog/website-cost-hong-kong-2026",
        note: "The 2026 guide to price bands, in HKD.",
      },
      {
        label: "FPS QR code generator",
        href: "/fps-qr-code-generator",
        note: "Turn your FPS ID, mobile or email into a payment QR code.",
      },
      {
        label: "Hong Kong profits tax calculator",
        href: "/hong-kong-profits-tax-calculator",
        note: "Two-tiered rates for corporations and unincorporated businesses.",
      },
      {
        label: "Free website audit",
        href: "/free-website-audit",
        note: "Speed, mobile, SEO and trust checks on your current site in about a minute.",
      },
      {
        label: "網頁設計及網站開發（繁體中文）",
        href: "/zh-hk",
        note: "This page in Traditional Chinese.",
      },
    ],
  },
  schema: {
    name: "Web design and development for Hong Kong businesses",
    description: `Custom websites, e-commerce stores and web applications for Hong Kong businesses, built by founder ${site.founder}. Fixed quotes from ${floor}.`,
    area: { "@type": "AdministrativeArea", name: "Hong Kong" },
    currency: "HKD",
    minPrice: toHkd(priceBands.business[0]),
  },
};
