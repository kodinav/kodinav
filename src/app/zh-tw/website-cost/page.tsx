import type { Metadata } from "next";
import { GuidePage, type GuideContent } from "@/components/zh/GuidePage";
import { site } from "@/data/site";
import { TWD_PER_USD, fmtTwd, priceBands, rangeTwd, rangeUsd } from "@/lib/fx";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const path = "/zh-tw/website-cost";
const both = (band: readonly [number, number]) => `${rangeUsd(band)}（約 ${rangeTwd(band)}）`;

const content: GuideContent = {
  locale: "zh-TW",
  path,
  title: "2026 台灣網站架設費用指南：架一個網站要多少錢？",
  excerpt: "用美元與新台幣說清楚：台灣架設網站的真實費用、報價落差的原因，以及如何比較報價才不會被表面數字誤導。",
  date: "2026-09-15",
  tag: "費用指南",
  meta: { updated: "更新日期：", readingTime: "閱讀時間約 8 分鐘", author: `作者：${site.founder}` },
  breadcrumb: { home: { name: "首頁", href: "/zh-tw" }, current: "網站架設費用指南" },
  sections: [
    {
      heading: "簡單回答",
      paragraphs: [
        `在 Kodinav 這樣的獨立工作室，台灣企業的客製化形象官網為 ${both(priceBands.business)}，電商網站為 ${both(priceBands.ecommerce)}，具備會員、預約或管理後台的網路系統則從 US$8,000（約 ${fmtTwd(priceBands.webapp[0])}）起。市場上會看到遠低或遠高於這些數字的報價，因為套版方案、接案工作者與網頁設計公司賣的其實是不同的產品。`,
        "這份指南說明每個價位實際買到什麼、台灣網站特有的成本因素，以及比較報價的方法。",
      ],
    },
    {
      heading: "Kodinav 台灣費用一覽",
      paragraphs: [
        `正式報價以美元固定；新台幣以 1 美元兌 ${TWD_PER_USD} 新台幣約略換算並無條件進位。每個專案在諮詢通話後都會收到明細固定報價。`,
      ],
      table: {
        head: ["項目", "費用（美元）", "約合新台幣", "一般時程"],
        rows: [
          ["Landing Page 到達頁", rangeUsd(priceBands.landing), rangeTwd(priceBands.landing), "1–2 週"],
          ["形象官網（5 頁以內）", rangeUsd(priceBands.business), rangeTwd(priceBands.business), "3–6 週"],
          ["加做第二語言（中英雙語）", `+ ${rangeUsd(priceBands.bilingual)}`, `+ ${rangeTwd(priceBands.bilingual)}`, "與網站一起報價"],
          ["電商網站", rangeUsd(priceBands.ecommerce), rangeTwd(priceBands.ecommerce), "4–8 週"],
          ["網路系統", rangeUsd(priceBands.webapp), rangeTwd(priceBands.webapp), "6–12 週"],
        ],
      },
    },
    {
      heading: "套版、客製化還是系統：你實際買到的是什麼？",
      paragraphs: [
        "「做網站」涵蓋完全不同的產品。最基本的是套版：購買現成版型，或使用 SHOPLINE、CYBERBIZ 等開店平台，再放入你的 Logo、文字與照片。上線快、價格低，如果公司只需要一個基本的網路門面，這可能就是合適的選擇；但當你需要真正的速度、獨特的品牌形象，或希望網站帶來詢問與訂單時，套版的限制就會出現。",
        "中間是客製化網站：依你的品牌設計版面、依客戶的搜尋習慣規劃內容，並以速度與 SEO 為前提開發。到了這個層級，網站才開始像業務員，而不只是一份線上型錄。",
        "最高的一層是大型網站與真正的應用系統，例如商品結構複雜的電商、預約系統或會員平台；也包括需要負擔業務、專案經理與辦公室成本的網頁設計公司專案。",
      ],
    },
    {
      heading: "台灣網站特有的成本因素",
      paragraphs: [
        "金流與電子發票。串接綠界、藍新或 TapPay 等金流，並在結帳時自動開立電子發票，需要額外的整合與測試時間，但每個月能省下大量人工對帳與開票作業。",
        "物流與超商取貨。許多台灣消費者習慣到超商取貨。若要透過物流服務商的 API，讓顧客在結帳時直接選擇取貨門市，會增加電商網站的開發範圍。",
        "LINE 整合。加入好友按鈕很簡單；若要做 LINE Login、會員綁定，或透過 LINE 官方帳號發送訂單通知，就屬於系統整合，費用會相應提高。",
        `中英雙語。外銷企業通常需要英文版。正確做法是每個語言都有獨立網址與 hreflang 設定，並準備兩套內容。在 Kodinav，加做第二語言費用為 ${both(priceBands.bilingual)}。`,
      ],
    },
    {
      heading: "外銷企業的英文網站",
      paragraphs: [
        "對製造業與外銷企業來說，英文網站的目標不是好看，而是讓海外採購人員快速找到規格、信任你的工廠並送出詢價。清楚的產品分類、規格表、可下載的型錄、認證資訊與 RFQ 表單，加上針對買家搜尋的產品關鍵字規劃的頁面，是這類網站最值得投資的地方。",
      ],
    },
    {
      heading: "上線後的持續費用",
      paragraphs: [
        "製作良好的形象官網，主機費用並不高，而且應該依實際成本支付，並使用你名下的帳號。網域每年續約，費用很低。金流手續費由金流商依交易收取。維護服務可依需求選擇。簽約前請要求對方把所有持續費用寫清楚，因為異常便宜的報價，常常會在這些地方把利潤賺回來。",
      ],
    },
    {
      heading: "如何公平比較報價？",
      paragraphs: [
        "向每一位開發者問同樣的五個問題：實際由誰開發？價格是否固定、包含哪些項目？程式碼、網域與主機帳號是否屬於我？網站在手機上的速度如何，能否展示正在運作的案例？上線之後會怎麼處理，維護支援怎麼收費？",
        "對自己作品有信心的開發者，會清楚回答這五個問題。含糊其辭，比價格高更值得警惕。",
      ],
    },
  ],
  faq: {
    title: "常見問題",
    items: [
      {
        q: "架設一個網站要多少錢？",
        a: `在 Kodinav，形象官網為 ${both(priceBands.business)}，電商網站為 ${both(priceBands.ecommerce)}，網路系統 US$8,000 起，全部提供明細固定報價。市場價格落差很大，因為不同報價其實對應不同的產品。`,
      },
      {
        q: "電商網站串接金流和電子發票要另外收費嗎？",
        a: "在 Kodinav，電商網站的報價已包含金流串接；電子發票、超商物流等額外整合會在報價中逐項列出，讓你清楚知道每一筆費用的用途。",
      },
      {
        q: "網站每年還要付哪些費用？",
        a: "主要是主機與網域續約，兩者都應依實際成本支付並登記在你名下；金流手續費依交易收取。維護服務屬於選配項目，應在簽約前以書面報價。",
      },
      {
        q: "套版網站和客製化網站怎麼選？",
        a: "如果只需要基本的網路門面，套版可能就夠了；如果希望網站帶來詢問與訂單、在 Google 取得排名，或需要金流、預約、會員等功能，客製化網站通常更划算。",
      },
    ],
  },
  cta: {
    title: "想知道你的專案實際要多少錢？",
    body: "告訴我你的需求，一個工作天內就會收到英文回覆，並安排免費諮詢通話。",
    label: "索取固定報價",
    href: "/zh-tw#lead-form",
  },
  related: {
    title: "延伸閱讀",
    links: [
      { label: "台灣網站架設與網頁設計", href: "/zh-tw" },
      { label: "台灣網路開店指南", href: "/zh-tw/online-shop-guide" },
      { label: "營業稅計算機（含稅／未稅）", href: "/zh-tw/business-tax-calculator" },
      { label: "How Much Does a Website Cost in Taiwan? (English)", href: "/blog/website-cost-taiwan-2026" },
    ],
  },
};

export const metadata: Metadata = {
  title: "2026 網站架設費用指南｜架一個網站要多少錢？",
  description: `台灣網站架設費用一覽：形象官網 ${rangeUsd(priceBands.business)}、電商網站 ${rangeUsd(priceBands.ecommerce)}。說明金流、電子發票、超商取貨與雙語網站的成本。`,
  keywords: ["網站架設費用", "架網站 費用", "網頁設計 報價", "形象官網 費用", "電商網站 費用", "購物網站架設 費用", "網站建置 價格"],
  alternates: localeAlternates("cost", path),
  openGraph: {
    title: content.title,
    description: content.excerpt,
    url: `${site.url}${path}`,
    type: "article",
    locale: "zh_TW",
    images: ogImage("2026 台灣網站架設費用指南", "費用指南"),
  },
};

export default function ZhTwWebsiteCostPage() {
  return <GuidePage content={content} />;
}
