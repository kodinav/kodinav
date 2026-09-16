import type { Metadata } from "next";
import { GuidePage, type GuideContent } from "@/components/zh/GuidePage";
import { site } from "@/data/site";
import { fmtHkd, priceBands, rangeHkd } from "@/lib/fx";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const path = "/zh-hk/website-cost";

const content: GuideContent = {
  locale: "zh-HK",
  path,
  title: "2026 香港網站設計收費指南：做一個網站要幾錢？",
  excerpt: "以港幣說清楚：香港網站設計的真實收費、報價差距背後的原因，以及怎樣比較報價才不會被表面數字誤導。",
  date: "2026-09-15",
  tag: "收費指南",
  meta: { updated: "更新日期：", readingTime: "閱讀時間約 8 分鐘", author: `作者：${site.founder}` },
  breadcrumb: { home: { name: "首頁", href: "/zh-hk" }, current: "網站設計收費指南" },
  sections: [
    {
      heading: "簡單答案",
      paragraphs: [
        `在 Kodinav 這類獨立工作室，香港企業度身訂造的公司網站收費為 ${rangeHkd(priceBands.business)}，網店為 ${rangeHkd(priceBands.ecommerce)}，具備會員、預約或管理後台的網上系統則由 ${fmtHkd(priceBands.webapp[0])} 起。你在市場上會看到遠低或遠高於這些數字的報價，因為模板套餐、自由工作者和設計公司賣的其實是不同產品。`,
        "這份指南會拆解每個價位實際買到甚麼、香港網站特有的成本因素，以及比較報價的方法。",
      ],
    },
    {
      heading: "Kodinav 香港收費一覽",
      paragraphs: [
        "以下為工作室的真實價格，以美元定價並按聯繫匯率換算為港幣後向上取整。每個項目在諮詢通話後都會收到列明細項的固定報價。",
      ],
      table: {
        head: ["項目", "價錢（港幣）", "一般製作時間"],
        rows: [
          ["廣告登陸頁", rangeHkd(priceBands.landing), "1–2 星期"],
          ["企業網站（5 頁以內）", rangeHkd(priceBands.business), "3–6 星期"],
          ["加設第二語言（中英雙語）", `+ ${rangeHkd(priceBands.bilingual)}`, "與網站一併報價"],
          ["網店", rangeHkd(priceBands.ecommerce), "4–8 星期"],
          ["網上系統", rangeHkd(priceBands.webapp), "6–12 星期"],
        ],
      },
    },
    {
      heading: "為甚麼香港網站報價差距這麼大？",
      paragraphs: [
        "「網站」一詞涵蓋了完全不同的產品。最基本的是模板：購買現成佈景主題或使用網站建立工具，再放入你的標誌、文字及相片。速度快、價錢低，如果公司只需要在網上有個基本存在，這可能是合適的選擇；但當你需要真正的速度、獨特的設計，或希望網站帶來查詢時，模板的限制就會浮現。",
        "中間是度身訂造：為你的業務設計版面、按客戶的搜尋習慣規劃內容，並以速度及搜尋引擎為前提開發。到了這個層次，網站才開始像一位銷售員，而不只是一本電子小冊子。",
        "最高的一層是大型網站及真正的應用程式，例如產品種類繁多的網店、預約系統或會員平台；另外亦包括需要承擔客戶經理、辦公室及銷售團隊成本的設計公司項目。",
      ],
    },
    {
      heading: "香港網站特有的成本因素",
      paragraphs: [
        `中英雙語。大部分香港企業同時需要英文及繁體中文。正確的做法是每個語言版本都有獨立網址、語言標籤及 hreflang 設定，並準備兩套內容。在 Kodinav，加設第二語言的費用為 ${rangeHkd(priceBands.bilingual)}。`,
        "付款方式。透過 Stripe 或 PayPal 接受信用卡相對簡單；若要加入轉數快（FPS）、AlipayHK 或 WeChat Pay HK，通常需要經支援這些方式的支付服務商處理，整合及測試時間亦會增加。",
        "預約、會員及系統整合。凡是需要儲存客戶資料或連接其他系統（例如 CRM、WhatsApp Business、存貨系統）的功能，本質上都是軟件而不是網頁，收費亦會相應提高。",
        "文案。如果團隊裡沒有人能撰寫兩種語言的文案，便需要預留撰稿或翻譯的預算。等待內容，往往是香港網站延遲上線最常見的原因。",
      ],
    },
    {
      heading: "網站上線後的持續費用",
      paragraphs: [
        "一個製作精良的企業網站，寄存費用並不高，而且應該按成本收費，並使用登記在你名下的帳戶。域名每年續期，費用很少。維護服務可按需要選擇：有些企業希望每月更新及監察，有些則只在需要修改時才聯絡開發者。簽約前請要求對方以書面列明所有持續費用，因為異常便宜的報價，往往會在這些地方把利潤賺回來。",
      ],
    },
    {
      heading: "網頁設計報價單應該列明什麼？",
      paragraphs: [
        "香港不少網頁設計報價單只有一句「企業網站一式」加一個總價，到開工後才發現頁數、語言版本、內容由誰提供全部未講清楚。一份可以直接簽的報價單，應該逐項寫明以下內容；缺少任何一項，都應該在付款前問清楚。",
      ],
      table: {
        head: ["報價單應列明", "如果沒有寫明，應該問"],
        rows: [
          ["頁數及每頁名稱", "超出頁數如何收費？"],
          ["語言版本", "中英雙語是否已包括？中文文案由誰提供？"],
          ["功能清單（表格、預約、付款、會員）", "哪些功能屬於報價範圍以外？"],
          ["內容及相片來源", "文案、相片由你提供，還是由開發者處理？"],
          ["SEO 及速度標準", "有沒有基本的 SEO 結構、結構化資料及速度要求？"],
          ["修改次數", "設計階段可以改幾次？之後如何收費？"],
          ["交付日期及付款階段", "每期付款對應哪一個可驗收的成果？"],
          ["程式碼、域名及寄存帳戶擁有權", "完成後是否登記在你公司名下？"],
          ["上線後支援", "包含多久的支援？之後的維護如何收費？"],
        ],
      },
    },
    {
      heading: "怎樣公平地比較報價？",
      paragraphs: [
        "向每一位開發者問同樣的五條問題：實際由誰開發？價錢是否固定，包括甚麼？程式碼、域名及寄存帳戶是否屬於我？網站在手機上的速度如何，可否展示正在運作的例子？上線後會發生甚麼，支援服務怎樣收費？",
        "對自己作品有信心的開發者，會清楚回答全部五條問題。含糊其辭，比高昂的價錢更值得警惕。",
      ],
    },
  ],
  faq: {
    title: "常見問題",
    items: [
      {
        q: "香港網頁設計一般要幾錢？",
        a: `在 Kodinav，企業網站為 ${rangeHkd(priceBands.business)}，網店為 ${rangeHkd(priceBands.ecommerce)}，網上系統由 ${fmtHkd(priceBands.webapp[0])} 起，全部提供列明細項的固定報價。市場上的價錢差距很大，因為不同報價其實對應不同產品。`,
      },
      {
        q: "中英雙語網站會貴很多嗎？",
        a: `在 Kodinav，加設第二語言的費用為 ${rangeHkd(priceBands.bilingual)}，視乎頁數及功能而定。另外需要預留撰寫或翻譯中文文案的時間及預算。`,
      },
      {
        q: "網站每年還要付甚麼費用？",
        a: "主要是寄存及域名續期，兩者都應按成本收費並登記在你名下。維護服務屬可選項目，應在簽約前以書面報價。",
      },
      {
        q: "網頁設計報價單一般包括什麼？",
        a: "一份清楚的報價單會列明頁數及每頁名稱、語言版本、功能清單、內容由誰提供、SEO 及速度標準、修改次數、交付日期、付款階段、上線後支援，以及程式碼、域名和寄存帳戶的擁有權。只寫「企業網站一式」加一個總價的報價單，通常代表範圍未傾清楚。",
      },
      {
        q: "模板網站還是度身訂造比較好？",
        a: "如果只需要在網上有個基本存在，模板可能已經足夠；如果希望網站帶來查詢、在 Google 取得排名，或需要付款、預約等功能，度身訂造通常更划算。",
      },
    ],
  },
  cta: {
    title: "想知道你的項目實際要幾錢？",
    body: "告訴我你的需要，一個工作天內便會收到英文回覆，並安排免費諮詢通話。",
    label: "索取固定報價",
    href: "/zh-hk#lead-form",
  },
  related: {
    title: "延伸閱讀",
    links: [
      { label: "香港網頁設計及網站開發", href: "/zh-hk" },
      { label: "香港開網店指南", href: "/zh-hk/online-shop-guide" },
      { label: "用 AI 做網站得唔得？", href: "/zh-hk/ai-website-builder" },
      { label: "香港利得稅計算機", href: "/zh-hk/profits-tax-calculator" },
      { label: "How Much Does a Website Cost in Hong Kong? (English)", href: "/blog/website-cost-hong-kong-2026" },
    ],
  },
};

export const metadata: Metadata = {
  title: "2026 香港網頁設計收費指南｜做網站要幾錢？",
  description: `香港網站設計收費一覽：企業網站 ${rangeHkd(priceBands.business)}、網店 ${rangeHkd(priceBands.ecommerce)}。拆解報價差距的原因、中英雙語及付款整合成本，以及比較報價的五條問題。`,
  keywords: ["網頁設計 收費", "網頁設計 價錢", "網站設計 收費", "做網站 幾錢", "網站製作 價錢", "網店 開發 費用", "香港 網頁設計"],
  alternates: localeAlternates("cost", path),
  openGraph: {
    title: content.title,
    description: content.excerpt,
    url: `${site.url}${path}`,
    type: "article",
    locale: "zh_HK",
    images: ogImage("2026 香港網站設計收費指南", "收費指南"),
  },
};

export default function ZhHkWebsiteCostPage() {
  return <GuidePage content={content} />;
}
