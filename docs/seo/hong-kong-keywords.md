# Hong Kong keyword research — 2026-09-16

## How this was gathered (and what it is not)

Google's Hong Kong autocomplete endpoint (`google.com.hk/complete/search`,
`hl=zh-HK&gl=hk`) was expanded across 46 seeds × 40 modifiers — 1,840 queries,
2,735 unique suggestions. Autocomplete returns **what people in Hong Kong
actually type, ordered roughly by popularity**.

**It is not search volume.** No paid keyword tool was used, so nothing here
carries a monthly-searches figure, and any such number would be invented. What
the data supports is: this phrasing exists, people in Hong Kong use it, and
these variants cluster together. Search Console will supply the real numbers
once impressions start — that is the loop to close in 2–3 weeks.

Raw expansion output is not committed (it is a large, regenerable artefact).
Re-run it any time with the method above.

---

## What the data showed

### 1. 轉數快 / FPS QR — the clearest opening

The densest cluster in the whole harvest, and nothing in it is served by a web
studio today:

`轉數快 qr code 生成` · `轉數快 qr code 收款` · `轉數快 qr code 付款` ·
`轉數快 qr code 點用` · `fps qr code generator` · `fps qr code format` ·
`fps qr code specification` · `轉數快 qr code hsbc / 中銀 / 匯豐 / citibank / mox` ·
`payme 轉數快 qr code`

Why it is winnable: narrow utility intent, the competing results are bank help
pages and a specification PDF rather than tools, and the audience — a Hong Kong
merchant who wants to take payments — is exactly the buyer for an online shop.

**Built:** `/zh-hk/fps-qr-code-generator` and `/fps-qr-code-generator`, a real
generator (FPS ID, mobile or email, optional amount, invoice number), with a
field-by-field spec table for the `format` / `specification` searches and FAQs
answering 點用 / 收款 / bank support / fees / safety. The payload builder is
unit-tested against the published test vector (`scripts/test-fps-qr.mjs`), and
the rendered QR was decoded back to confirm it carries the exact payload.

### 2. Price and quote intent — already mapped, now sharpened

`網頁設計 價錢` · `網頁設計 報價單` · `網站設計 報價` · `網站開發 報價` ·
`整網站幾錢` · `做網站費用` · `網站製作 費用` · `網頁設計價錢香港` ·
`網頁設計freelance價錢` · `網站維護費用`

`報價單` (the quote document itself) was the surprise: people want to know what
a quote should contain, not only the price.

**Done:** `/zh-hk/website-cost` gains a 報價單 checklist table and a matching FAQ,
alongside the existing HKD price bands.

### 3. 利得稅 — confirmed, already served

`利得稅計算機` · `利得稅計算方法` · `利得稅計算表` · `利得稅稅率` ·
`香港公司利得稅` · `利得稅 vs 薪俸稅` · `freelance 利得稅`

**Live:** `/zh-hk/profits-tax-calculator` (two-tier rates, effective rate).

### 4. 網店 + 商業登記 — an unserved commercial cluster

`網店 商業登記` · `網上商店 商業登記` · `網店 公司註冊` · `網店 公司戶口` ·
`開網店 商業登記` · `網店平台` · `開網店 lihkg`

Someone searching this is starting a shop — the highest-intent visitor an
e-commerce service can get.

**Built:** `/zh-hk/online-shop-guide` — business registration (scoped to an
overview, pointing at the IRD, which is the authority), platform vs custom with
a cost table, payments including the FPS QR tool, SF Express logistics and
returns, and the pages a Hong Kong shop must carry under the PDPO.

### 5. AI site builders — rising, and we have a real answer

`用ai 做網站` · `claude 做網站` · `gemini 做網站` · `vibe coding 做網站` ·
`網頁設計 ai` · `網站設計 ai` · `ai生成網站`

A studio that builds with AI daily can write the honest comparison.

**Built:** `/zh-hk/ai-website-builder` — what AI genuinely does well, where it
breaks (speed, SEO structure, real-device testing, payment security, PDPO,
maintainability, deliverability, accountability), a cost table, when AI alone is
the right call, and a pre-launch self-check. It says plainly that we use AI
daily ourselves — that is what makes the limits credible.

### 6. Head terms — real, but not 30-day targets

`網頁設計公司香港` · `網頁設計 香港` · `網站設計公司` · `web design hong kong`

Held by established agencies. Our `/zh-hk` and `/web-development-hong-kong`
pages target them and will take months plus links, not weeks.

---

## Page → query map (Hong Kong)

| Page | Primary | Also targets |
|---|---|---|
| `/zh-hk/fps-qr-code-generator` | 轉數快 qr code 生成 | 轉數快 qr code 收款／付款／點用, 收款 qr code |
| `/fps-qr-code-generator` | fps qr code generator | fps qr code format, fps qr code specification, hkicl qr code |
| `/zh-hk/website-cost` | 網頁設計 價錢 | 網頁設計 報價單, 整網站幾錢, 做網站費用, 網站製作 價錢 |
| `/zh-hk/profits-tax-calculator` | 利得稅計算機 | 利得稅計算方法, 利得稅稅率, 兩級制利得稅 |
| `/zh-hk` | 網頁設計 香港 | 網站設計 香港, 網頁設計公司, 網店開發, 中英雙語網站 |
| `/web-development-hong-kong` | web design hong kong | web development company hong kong, bilingual website hong kong |
| `/zh-hk/online-shop-guide` | 網店 商業登記 | 開網店 準備, 網店平台, 網店 收款, 網店 公司註冊 |
| `/zh-hk/ai-website-builder` | 用 ai 做網站 | claude/gemini 做網站, vibe coding 做網站, ai 建站 缺點 |

---

## Honest expectation

The tool pages are the ones that can realistically place inside a month: narrow
intent, a page that does the job, and no incumbent tool to displace. The
service head terms will not move that fast on a five-month-old domain with few
external links — that is what the directory and review work in
`directories-and-reviews.md` is for.

Check Search Console → Performance, filtered to Hong Kong, in two to three
weeks. Queries that appear at positions 11–30 are the ones to strengthen next;
that data beats any further guessing from autocomplete.
