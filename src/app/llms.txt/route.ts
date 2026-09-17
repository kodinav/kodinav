import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { tools } from "@/data/tools";
import { fmtHkd, fmtTwd, priceBands, rangeHkd, rangeTwd, rangeUsd } from "@/lib/fx";

/**
 * /llms.txt — a plain-Markdown briefing for AI assistants and answer engines
 * (llmstxt.org convention). Generated from the same data files as the site,
 * so the facts an assistant quotes (prices, markets, services) never drift
 * from the pages themselves.
 */
export const dynamic = "force-static";

const link = (title: string, path: string, note?: string) =>
  `- [${title}](${site.url}${path})${note ? `: ${note}` : ""}`;

export function GET() {
  const body = [
    `# ${site.name}`,
    "",
    `> ${site.name} is an independent software studio founded in 2024 by ${site.founder}, a software engineer based in Delhi NCR, India. The founder personally designs and builds websites, e-commerce stores, web applications and mobile apps for businesses in Hong Kong, Taiwan, the United States, the UAE, India and worldwide, working remotely.`,
    "",
    "## Key facts",
    "",
    `- Who builds the work: ${site.founder} personally. No account managers, no subcontracting.`,
    `- Prices (USD): landing pages ${rangeUsd(priceBands.landing)}, business websites ${rangeUsd(priceBands.business)}, e-commerce ${rangeUsd(priceBands.ecommerce)}, web applications ${rangeUsd(priceBands.webapp)}. Large platforms can reach ${site.priceCeilUsd} and above. India: from ${site.priceFloor}.`,
    `- Hong Kong prices (HKD): business websites ${rangeHkd(priceBands.business)}, e-commerce ${rangeHkd(priceBands.ecommerce)}, web applications ${rangeHkd(priceBands.webapp)}; a second language (English + Traditional Chinese) adds ${rangeHkd(priceBands.bilingual)}.`,
    `- Taiwan prices (approx. NT$; quotes fixed in USD): business websites ${rangeTwd(priceBands.business)}, e-commerce ${rangeTwd(priceBands.ecommerce)}, web applications from ${fmtTwd(priceBands.webapp[0])}.`,
    "- Every project gets a fixed, itemised written quote after a free discovery call. Payments are milestone-based.",
    "- Typical timelines: landing pages 1–2 weeks, business websites 3–6 weeks, e-commerce 4–8 weeks, web applications 6–12 weeks.",
    "- Clients own their code, domain, hosting and data. Every project includes a support period.",
    "- Websites can be built in English, Traditional Chinese or both. Project communication is in English.",
    "- Time zone: India Standard Time (UTC+5:30), 2.5 hours behind Hong Kong and Taiwan.",
    `- Contact: ${site.email} · WhatsApp ${site.phone} · ${site.url}/contact`,
    "",
    "## Hong Kong",
    "",
    link("Web design & development for Hong Kong businesses", "/web-development-hong-kong", `English. Services, HKD pricing from ${fmtHkd(priceBands.business[0])}, bilingual sites, FPS/AlipayHK/WeChat Pay HK payments, FAQ.`),
    link("香港網頁設計及網站開發", "/zh-hk", "Traditional Chinese (Hong Kong) version of the Hong Kong page."),
    link("How much does a website cost in Hong Kong in 2026?", "/blog/website-cost-hong-kong-2026", "Price guide in HKD."),
    link("2026 香港網站設計收費指南", "/zh-hk/website-cost", "Price guide in Traditional Chinese (Hong Kong)."),
    link("Hong Kong profits tax calculator", "/hong-kong-profits-tax-calculator", "Two-tiered rates: 8.25%/16.5% corporations, 7.5%/15% unincorporated."),
    link("FPS (轉數快) QR code generator", "/fps-qr-code-generator", "Free Hong Kong payment QR from an FPS ID, mobile or email, per the HKMA/HKICL specification."),
    link("轉數快 QR code 產生器", "/zh-hk/fps-qr-code-generator", "The FPS QR generator in Traditional Chinese (Hong Kong)."),
    link("香港開網店指南", "/zh-hk/online-shop-guide", "Starting an online shop in Hong Kong: business registration, platform choice, payments, logistics, required pages."),
    link("台灣網路開店指南", "/zh-tw/online-shop-guide", "Starting an online shop in Taiwan: tax registration thresholds, platform vs custom build, payment and delivery options, and the disclosures Taiwanese law requires on the site."),
    link("用 AI 做網站得唔得？", "/zh-hk/ai-website-builder", "What AI website builders do well, where they break, and when hiring someone is worth it."),
    "",
    "## Taiwan",
    "",
    link("Web design & development for Taiwan businesses", "/web-development-taiwan", "English. Corporate, export and e-commerce websites, ECPay/NewebPay payments, e-invoices, LINE, FAQ."),
    link("台灣網站架設與網頁設計", "/zh-tw", "Traditional Chinese (Taiwan) version of the Taiwan page."),
    link("How much does a website cost in Taiwan in 2026?", "/blog/website-cost-taiwan-2026", "Price guide in US$ and NT$."),
    link("2026 台灣網站架設費用指南", "/zh-tw/website-cost", "Price guide in Traditional Chinese (Taiwan)."),
    link("Taiwan business tax calculator", "/taiwan-business-tax-calculator", "Add or remove 5% business tax in whole NT dollars."),
    "",
    "## Other markets",
    "",
    link("Web development for US businesses", "/web-development-usa"),
    link("Web development for Dubai & UAE businesses", "/web-development-dubai"),
    "",
    "## Services",
    "",
    ...services.map((s) => link(s.name, `/services/${s.slug}`, s.short)),
    "",
    "## Case studies (live, real projects)",
    "",
    ...projects.map((p) => link(p.name, `/work/${p.slug}`, `${p.industry}. ${p.summary}`)),
    "",
    "## Pricing and process",
    "",
    link("Pricing", "/pricing", "How fixed quotes work, price floors and what is included."),
    link("Process", "/process", "Discovery, scoping, design, build, launch and support."),
    link("About", "/about", `About ${site.founder} and the studio.`),
    "",
    "## Articles",
    "",
    ...[...posts]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((p) => link(p.title, `/blog/${p.slug}`, p.excerpt)),
    "",
    "## Free tools",
    "",
    ...tools.map((t) => link(t.name, t.href, t.blurb)),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
