# Hong Kong & Taiwan — launch and 30-day plan

Launched 2026-09-15. This is the working plan: what shipped, what only you can do, and
how to tell whether it is working. Check it against Search Console weekly.

---

## 1. Honest expectations for the first 30 days

Nobody can guarantee a Google ranking in 30 days, and anyone who promises one is
selling something. Here is what is realistic for a newer domain like kodinav.com:

| Timeframe | Realistic | Not realistic |
|---|---|---|
| Days 1–7 | All new URLs crawled and indexed (after the Search Console and IndexNow steps below) | Page-one rankings |
| Weeks 2–4 | Impressions for long-tail and tool queries in HK/TW: *website cost hong kong*, *網站架設費用*, *利得稅計算機*, *營業稅計算*; first positions typically on pages 2–5 | Page one for *網頁設計 香港* or *web design hong kong* |
| Months 2–6 | Page-one positions for long-tail terms, climbing on head terms as backlinks and reviews accumulate | — |

**Head terms** (網頁設計 香港, 網站架設, web design hong kong) are held by local agencies
with years of backlinks. Content alone will not beat them in a month; authority (section 4)
is the lever.

**The only guaranteed visibility within 30 days is Google Ads** (section 5). The market
pages were built to double as ad landing pages, with lead forms and source tracking.

---

## 2. What shipped

### Keyword research

Hong Kong query research (method, clusters, page→query map) lives in
`hong-kong-keywords.md`, refreshed 2026-09-16 from Google's Hong Kong
autocomplete. It is what drove the FPS QR generator and the 報價單 section.

### Pages and target queries

| URL | Language | Primary query | Supporting queries |
|---|---|---|---|
| `/web-development-hong-kong` | en-HK | web design hong kong | web development company hong kong, bilingual website hong kong, outsource web development hong kong |
| `/zh-hk` | zh-HK | 網頁設計 香港 | 網站設計, 網站開發, 網頁設計公司, 網店開發, 中英雙語網站 |
| `/zh-hk/website-cost` | zh-HK | 網頁設計 收費 | 網頁設計 價錢, 做網站 幾錢, 網站製作 價錢 |
| `/blog/website-cost-hong-kong-2026` | en-HK | website cost hong kong | web design price hong kong |
| `/hong-kong-profits-tax-calculator` | en | profits tax calculator hong kong | two-tiered profits tax rates |
| `/zh-hk/profits-tax-calculator` | zh-HK | 利得稅計算機 | 利得稅計算, 兩級制利得稅 |
| `/zh-hk/fps-qr-code-generator` | zh-HK | 轉數快 qr code 生成 | 轉數快 qr code 收款／付款／點用 |
| `/fps-qr-code-generator` | en | fps qr code generator | fps qr code format, fps qr code specification |
| `/web-development-taiwan` | en-TW | web design taiwan | web development company taiwan, English website for Taiwanese manufacturer |
| `/zh-tw` | zh-TW | 網站架設 | 網頁設計, 形象官網, 網站設計公司, 電商網站架設 |
| `/zh-tw/website-cost` | zh-TW | 網站架設費用 | 架網站 費用, 網頁設計 報價, 形象官網 費用 |
| `/blog/website-cost-taiwan-2026` | en-TW | website cost taiwan | — |
| `/taiwan-business-tax-calculator` | en | taiwan vat calculator | taiwan business tax calculator |
| `/zh-tw/business-tax-calculator` | zh-TW | 營業稅計算 | 含稅計算, 未稅計算 |

### Technical and answer-engine (AEO / GEO) work

- **Real `lang` per page.** `<html lang="zh-HK">` and `<html lang="zh-TW">` come from separate
  root layouts (`src/app/(en)`, `src/app/zh-hk`, `src/app/zh-tw`). Bing uses the lang attribute,
  and Yahoo Taiwan runs on Bing.
- **hreflang clusters** in `src/lib/i18n.ts`, emitted as `<link rel="alternate">` tags on every
  member page and mirrored in `sitemap.xml`. Verified reciprocal.
- **FAQ answers are now real HTML on every page on the site.** Previously only the first answer
  of each FAQ existed in the markup; the rest were injected on click, invisible to AI crawlers
  and to Google's indexer.
- **Structured data:** WebPage (with `inLanguage`), Service with a price in HKD/USD, FAQPage,
  BreadcrumbList, Article and WebApplication. The organisation schema now lists Hong Kong and
  Taiwan first in `areaServed`.
- **`/llms.txt`**, generated from the site's data files, so prices and facts quoted by AI
  assistants match the pages. Honest caveat: few AI crawlers read it yet. It costs nothing,
  but it is not a ranking lever.
- **`robots.txt`** explicitly allows search and AI answer-engine crawlers (OAI-SearchBot,
  PerplexityBot, ClaudeBot, Google-Extended, Bingbot and others).
- **IndexNow** key at `/cb5f1309deb6f2cda291bd113f78f4ca.txt` and `scripts/indexnow.mjs`
  push URLs to Bing and other engines within hours.
- **Local pricing everywhere:** visitors in Hong Kong see HK$ and Taiwan visitors see NT$ on all
  English pages (timezone-based, set before paint), including the cost calculator.
- **Chinese OG share cards** render real Traditional Chinese, for WhatsApp, LINE and Facebook
  previews.
- **Internal links:** a homepage strip, footer, navbar (繁中) and mobile menu all link to the
  new pages. Pages linked only from the sitemap barely rank.

---

## 3. Do this in the first 48 hours after deploy (only you can)

1. **Google Search Console** (property already verified):
   - Sitemaps → resubmit `https://kodinav.com/sitemap.xml`.
   - URL Inspection → **Request indexing** for each of the 12 URLs in the table above, starting
     with `/zh-hk`, `/zh-tw`, `/web-development-hong-kong` and `/web-development-taiwan`.
     Google allows roughly 10–12 requests a day, so spread them over two days.
2. **Bing Webmaster Tools** (bing.com/webmasters): *Import from Google Search Console*
   (one click, no DNS work), then confirm the sitemap is listed. This covers Bing, Yahoo
   Taiwan and ChatGPT search's main index. If you add the Bing verification meta tag instead,
   set `NEXT_PUBLIC_BING_SITE_VERIFICATION` in Hostinger; the layout already reads it.
3. **IndexNow**, once the deploy is live: `node scripts/indexnow.mjs`
4. **Spot-check** one Chinese page in Google's Rich Results Test and URL Inspection
   ("View crawled page"), and confirm the Chinese text and hreflang tags are present.
   Note: since 2023 Google shows FAQ rich results almost only for government and health
   sites, so do not expect FAQ dropdowns in results. The FAQ markup still feeds AI answers.

---

## 4. Weeks 1–2: authority (the real ranking lever)

Search engines and AI assistants both trust what *other* sites say about you.

- **Agency directories:** create or update profiles on Clutch, GoodFirms, DesignRush and
  Sortlist, and add **Hong Kong** and **Taiwan** as service locations. Ask 2–3 past clients
  (Lighthouse, Flaming, Kosmo) for a verified review on Clutch; reviews are what AI
  assistants cite when asked "best web developer for…".
- **Taiwan marketplaces:** PRO360達人網 (網頁設計 category) and Tasker出任務 both carry real
  local search demand and link authority.
- **Hong Kong networks:** consider the Indian Chamber of Commerce Hong Kong. It is a natural
  fit for an India-based founder and a credible listing and introduction channel; check its
  membership terms first.
- **LinkedIn:** add Hong Kong and Taiwan to the company page's service areas and publish the
  two cost guides as LinkedIn articles that link back to the originals.
- **Google Business Profile:** do **not** create an HK or TW profile without a real address
  there. Fake or virtual-office addresses get profiles suspended.

---

## 5. Weeks 1–4: Google Ads, the 30-day guarantee

- **Landing pages:** use the market pages directly. Their lead forms record `source` as
  `market-hk-en`, `market-hk-zh`, `market-tw-en` or `market-tw-zh`, so you can see in `/admin`
  exactly which market and language produced each lead. `trackLead()` already fires GA4
  `generate_lead`, so import it into Ads as the conversion.
- **Campaigns:** four ad groups, one per landing page, each geo-targeted to its market with
  the language set to match.
  - HK English: *web design hong kong*, *website development company hong kong*, *ecommerce website hong kong*
  - HK Chinese: *網頁設計*, *網站設計公司*, *網店設計*, *網頁設計 價錢*
  - TW Chinese: *網站架設*, *形象官網*, *網頁設計公司*, *電商網站架設*
  - TW English, for exporters: *english website design taiwan*, *b2b website manufacturer*
- **Negative keywords from day one:** 課程, 教學, 免費, 招聘, jobs, course, free, template, wix,
  wordpress theme.
- Start with a small daily cap, judge by **cost per lead** after 2 weeks, and shift budget to
  the best market/language.

---

## 6. Weeks 2–4: content, driven by data

Once Search Console shows HK/TW impressions (Performance → filter Country = Hong Kong or
Taiwan), write for the queries that appear. Strong candidates already mapped:

- 網店開發 / e-commerce website Hong Kong (a guide that covers FPS and AlipayHK checkout)
- 中英雙語網站 guide: how to structure a bilingual Hong Kong site
- ECPay / 綠界 integration and e-invoice guide (Taiwan, e-commerce intent)
- English B2B websites for Taiwanese manufacturers (export intent, English)
- Tools with low competition and a local audience: an FPS payment QR code generator (HK)
  and a LINE link / QR generator (TW)

Rule from `search-console-checkin.md` still applies: a page sitting at positions 11–20 is worth
improving before writing something new.

---

## 7. Decisions to confirm (these were my defaults)

- **"Project communication is in English"** is stated on every HK/TW page, because the studio
  works in English. If you plan to handle Chinese-language clients (for example through a
  translator), change that line in `src/data/markets/*.ts`.
- **Taiwan quotes are fixed in USD**, with NT$ shown as approximate; HK quotes are in HKD or USD
  (HKD is pegged). The exchange rate is `TWD_PER_USD` in `src/lib/fx.ts`. Review it quarterly.
- **LINE:** Taiwanese buyers expect it. Create a free LINE Official Account, send me the ID,
  and I will add LINE buttons to the Taiwan pages.
- **Phone number:** the +91 WhatsApp number works in both markets. A local number is optional.

---

## 8. Maintenance

- **New page with a translation?** Add it to a cluster in `src/lib/i18n.ts`, and the page
  metadata and sitemap pick it up. Every member must use `localeAlternates()`.
- **Prices** come from `priceBands` in `src/lib/fx.ts` (the same bands as the cost
  calculator). Change them there, never in page copy.
- **HK profits tax:** the two-tier rates are hard-coded. One-off Budget reductions are a user
  input, so they never go stale. Re-check the rates after each February Budget.
- **Taiwan business tax** is 5% for general businesses; re-check if legislation changes.
