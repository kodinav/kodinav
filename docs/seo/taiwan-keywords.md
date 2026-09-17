# Taiwan keyword research — 2026-09-17

Companion to `hong-kong-keywords.md`, same method, different market — and a
noticeably different answer.

## How this was gathered (and what it is not)

Google Taiwan's autocomplete endpoint (`google.com.tw/complete/search`,
`hl=zh-TW&gl=tw`) expanded across 55 seeds × 40 modifiers — 2,200 queries,
2,071 unique suggestions.

Unlike the Hong Kong run, `suggestqueries.google.com` and `google.com.tw`
returned identical results here. That is consistent with the earlier finding
that `suggestqueries` skews Taiwanese: for Taiwan it happens to be right, for
Hong Kong it was wrong. Use the country endpoint either way.

**It is not search volume.** No paid tool was used, so nothing here carries a
monthly-searches figure, and any such number would be invented. Every
suggestion in this harvest surfaced once, so frequency does not rank them
either — the clusters below were read for intent, not counted.

Raw expansion output is not committed (large, regenerable).

---

## What the data showed

### 1. TWQR is NOT a tool opportunity — this is the important one

TWQR looked like the exact Taiwan analogue of the Hong Kong FPS QR win: ~90
suggestions, including `twqr qr code 產生器`, plus `是什麼`, `店家 申請`,
`申請 費用`, `手續費`, `如何使用`, `轉帳`, and the bank and wallet names.

**We must not build a TWQR generator.** TWQR is an acquiring scheme, not a
person-to-person payload standard. A merchant's TWQR collection code is issued
by a bank, an electronic payment institution or a partner acquirer/gateway
after application; a merchant cannot generate an ordinary QR code and use it as
a TWQR collection code. A self-serve "TWQR generator" would hand shop owners
codes that silently fail to collect money.

This is the structural difference from FPS: an FPS QR encodes an identifier the
payer's bank app resolves (so a generator is correct and useful), whereas TWQR
encodes a merchant relationship that has to exist first.

The remaining TWQR demand is informational and currently held by banks,
wallets and money-comparison blogs. Worth a page eventually; not an empty field,
and not a tool.

### 2. 網路開店 + 營業登記 + platform comparison — the densest unserved cluster

`網路開店平台推薦` · `網路開店平台比較` · `網路開店平台ptt` · `網路開店平台dcard` ·
`網路開店 教學` · `網路開店 免費` · `網路開店 營業登記` · `shopline 開店 費用` ·
`91app 開店 費用` · `shopline 開店 教學` · `購物車系統 推薦` ·
`電商網站架設` · `電商網站 價格` · `電商網站 設計` · `網路開店 詐騙`

Why it is winnable: the incumbents are forum threads (PTT/Dcard) and the
platforms' own content marketing. Nobody neutral is answering "platform or
custom build" for a Taiwanese shop owner, and that shop owner is exactly the
buyer for an e-commerce site.

**Built:** `/zh-tw/online-shop-guide`, mirroring the Hong Kong guide's shape but
on Taiwanese facts — tax-registration thresholds, the 公司/商業/稅籍登記
distinction, a platform-vs-custom table, Taiwanese payment and delivery
reality, and the statutory website disclosures below.

### 3. Taiwan has statutory *website* requirements Hong Kong does not

These came out of verifying the registration facts, and they are the strongest
reason a web studio (not an accountant) should own this page:

- A registered 營業人 must disclose **營業人名稱 and 統一編號 in a prominent
  position on the selling website**. That is a footer/About requirement.
- **消保法 §19**: online (通訊交易) consumers may withdraw within **7 days** of
  receiving goods, no reason and no cost, subject to published reasonable
  exceptions. It is a right, not a courtesy, so the 購物須知 must state it.
- 經濟部's **零售業等網路交易定型化契約應記載及不得記載事項**: terms that
  breach the "不得記載" list are void — copied-from-anywhere shop terms are a
  real liability.
- **個資法** notification duties on order forms, sign-ups and newsletters.

Tax facts used on the page (verified against 財政部 / 財政部稅務入口網, not blogs):
from 114-01-01 the 營業稅起徵點 is **NT$100,000/month for goods, NT$50,000 for
services**; above the threshold but under NT$200,000/month → **1%**, assessed
quarterly by 國稅局; over NT$200,000/month (or deemed capable) → **統一發票, 5%**,
filed every 2 months. Registration requires disclosing the seller's 網域名稱、
網路位址 and 會員帳號.

> Note for anyone re-checking these: WebFetch's summariser rendered `10萬元` as
> "NT$1,000,000" — a consistent 10× error. Trust the Chinese原文, not the
> converted figures.

### 4. English has no Taiwan demand at all

`web design taiwan`, `web development taiwan` and `taiwan web design company`
returned **zero autocomplete suggestions**. Each was re-probed directly to rule
out rate-limiting — genuinely empty.

Hong Kong is an English business market; Taiwan is not. `/web-development-taiwan`
should stay for hreflang reciprocity and for buyers who arrive by other routes,
but it should not carry a ranking expectation. Taiwan traffic will come in
zh-TW or not at all.

### 5. Terminology traps

- Taiwan says **`網站改版`**, not `網站重新設計` (zero autocomplete).
- Price is researched as **`網頁設計費用行情`**, `網頁設計 報價單`, and heavily
  qualified with **`ptt`** / **`dcard`** — forum-sourced price expectations.
- `網頁設計丙級` (the vocational certificate) is the single strongest 網頁設計
  suggestion. Much 網頁設計 volume in Taiwan is students and job-seekers, not
  buyers — a reason not to read raw 網頁設計 demand as commercial.

### 6. Large clusters that are NOT winnable

- **電子發票 / 統一發票 (250)** and **統一編號 (92)** are overwhelmingly
  navigational — people looking up a specific company's invoice or tax number
  (`台灣大哥大 電子發票`, `台北市政府 統一編號`). The 財政部 owns these.
- **公司登記 / 商業登記 (149)** is dominated by government-process queries
  (`線上申請`, `台北市商業處`). 經濟部 owns these.
- **行動支付 wallets (678)** is the largest cluster overall but is consumer
  intent — 優惠, 回饋, 綁定 — not merchant intent.
- **vibe coding / AI 建站 (132)** is large and rising, but mostly developer
  tutorial intent (`cursor`, `claude code 教學`, `gemini 3`). The buyer-relevant
  slice is thin: `canva ai 做網站`, `google ai 做網站`.

---

## Page → query map (Taiwan)

| Page | Primary | Also targets |
|---|---|---|
| `/zh-tw/online-shop-guide` | 網路開店 營業登記 | 網路開店平台比較／推薦, 電商網站架設, 購物車系統 推薦, 稅籍登記 網路賣家 |
| `/zh-tw/website-cost` | 網站架設 費用 | 網頁設計費用行情, 網頁設計 報價單, 網站改版 費用 |
| `/zh-tw/business-tax-calculator` | 營業稅計算 | 營業稅 5%, 含稅 未稅 換算 |
| `/zh-tw` | 網頁設計 台灣 | 網站架設, 形象官網, 電商網站設計 |
| `/web-development-taiwan` | — (no English demand) | hreflang reciprocity only |

---

## Honest expectation

Taiwan has no equivalent of the FPS QR opening — the one tool-shaped cluster
turned out to be un-buildable. So Taiwan's path is slower than Hong Kong's:
guide content that out-answers forum threads, on a five-month-old domain, with
few links.

The `/zh-tw/online-shop-guide` page is the best available shot because the
intent is commercial and the incumbents are weak, but it is a guide competing
against PTT/Dcard threads with years of accumulated authority — expect months,
not weeks, and check Search Console filtered to Taiwan rather than guessing.

Next decisions should come from Search Console (Taiwan filter, positions 11–30),
not from more autocomplete.
