import { site } from "@/data/site";
import { fmtTwd, priceBands, rangeTwd, rangeUsd } from "@/lib/fx";
import type { MarketContent } from "./types";

// Taiwan Mandarin usage: 網站架設, 形象官網, 軟體, 網路, 主機, 網域, 金流,
// 視訊會議, 隱私, 週, 專案.

const floorTwd = fmtTwd(priceBands.business[0]);
const both = (band: readonly [number, number]) => `${rangeUsd(band)}（約 ${rangeTwd(band)}）`;

export const twZh: MarketContent = {
  locale: "zh-TW",
  path: "/zh-tw",
  source: "market-tw-zh",
  breadcrumb: { home: { name: "首頁", href: "/zh-tw" }, current: "台灣網站架設" },
  hero: {
    eyebrow: "台灣企業網站方案",
    title: ["台灣企業的", "網站架設", "與網頁設計，由工程師親自打造。"],
    lead: `Kodinav 是獨立軟體工作室。創辦人 ${site.founder} 親自為台灣企業設計與開發形象官網、電商網站與網路系統，也為外銷製造業打造面向海外買家的英文網站。書面固定報價 US$2,000 起（約 ${floorTwd}），從第一次通話到上線，你都直接與負責開發的工程師溝通。`,
    primaryCta: "索取固定報價",
    secondaryCta: { label: "WhatsApp 詢問", href: site.whatsappZh.tw, external: true },
    notes: [`約 ${floorTwd} 起・固定報價`, "3 至 6 週上線", "中英雙語網站", "程式碼屬於你"],
  },
  facts: {
    eyebrow: "重點整理",
    title: "Kodinav 台灣服務：八個重點。",
    items: [
      {
        term: "服務項目",
        detail: "形象官網、外銷英文網站、Landing Page 到達頁、電商網站、網路系統（Web App）與 App。",
      },
      {
        term: "由誰開發",
        detail: `創辦人暨軟體工程師 ${site.founder} 親自開發，沒有業務窗口轉手，也不外包。`,
      },
      {
        term: "價格",
        detail: `形象官網 US$2,000 起，約 ${floorTwd}。報價以美元固定，並以書面列出明細。`,
      },
      { term: "製作時程", detail: "Landing Page 1–2 週、形象官網 3–6 週、電商網站 4–8 週、網路系統 6–12 週。" },
      { term: "語言", detail: "網站可為繁體中文、英文或中英雙語。專案溝通以英文進行。" },
      {
        term: "工作室地點",
        detail: "印度德里首都圈（Delhi NCR）。台灣專案透過 Email、視訊會議與 WhatsApp 遠端進行。",
      },
      { term: "時差", detail: "台灣比印度快 2.5 小時，你的下午正好是工作室的上班時間。" },
      { term: "所有權", detail: "程式碼、網域、主機與資料從第一天起就登記在你名下。" },
    ],
  },
  why: {
    eyebrow: "為什麼選擇獨立工作室",
    title: "一位工程師，全程負責。",
    lead: "無論你的客戶在台北，還是在歐美的採購部門，網站都必須快速、清楚、值得信任。這需要真正的工程能力，而不是套上公司 Logo 的現成版型。",
    items: [
      {
        title: "跟你討論需求的人，就是寫程式的人",
        body: "沒有業務轉交給資淺團隊的斷層。第一次通話的工程師會親自規劃架構、撰寫程式，每個決定都會說明清楚，需求不會在轉述中走樣。",
      },
      {
        title: "打動海外買家的英文網站",
        body: "對台灣製造業與外銷企業來說，英文官網往往是國外買家第一個查看的地方。清楚的產品頁、規格表與為採購人員設計的詢價表單，效果遠勝一份翻譯過的型錄。",
      },
      {
        title: "客戶在哪裡，網站都一樣快",
        body: "頁面由伺服器端預先渲染，並透過全球 CDN 節點提供，無論是法蘭克福的買家還是台中的消費者，網站都能在約一秒內載入。",
      },
      {
        title: "白紙黑字的固定報價",
        body: "以美元列出每個頁面與功能的明細報價，並依可運作的成果分期付款。談好的價格，就是最後的價格。",
      },
    ],
  },
  services: {
    eyebrow: "服務項目",
    title: "從形象官網到客製化系統。",
    lead: "以下每項服務都由同一位工程師設計、開發與維護。新台幣金額為約略換算，正式報價以美元固定。",
    items: [
      {
        title: "形象官網與外銷網站",
        body: "企業形象網站，以及附規格表與詢價（RFQ）表單、面向海外買家的英文產品型錄網站。",
        price: `US$2,000 起（約 ${floorTwd}）`,
        href: "/services/business-websites",
        linkLabel: "服務說明（英文）",
      },
      {
        title: "電商網站",
        body: "串接台灣金流與電子發票的購物網站，速度不受開店平台限制。",
        price: `US$4,000 起（約 ${fmtTwd(priceBands.ecommerce[0])}）`,
        href: "/services/ecommerce",
        linkLabel: "服務說明（英文）",
      },
      {
        title: "網路系統",
        body: "會員系統、預約平台、管理後台與內部工具，依你團隊的實際流程量身打造。",
        price: `US$8,000 起（約 ${fmtTwd(priceBands.webapp[0])}）`,
        href: "/services/web-applications",
        linkLabel: "服務說明（英文）",
      },
      {
        title: "Landing Page 到達頁",
        body: "專為 Google 與 Meta 廣告設計的單一目標頁面，並完成轉換追蹤設定。",
        price: `US$2,000 起（約 ${fmtTwd(priceBands.landing[0])}）`,
        href: "/services/landing-page-development",
        linkLabel: "服務說明（英文）",
      },
      {
        title: "網站改版",
        body: "重建緩慢或老舊的網站，同時保住已累積的搜尋排名。",
        price: "依需求報價",
        href: "/services/website-redesign",
        linkLabel: "服務說明（英文）",
      },
      {
        title: "App 開發",
        body: "一套程式碼同時支援 iOS 與 Android，並與網站共用後端。",
        price: "依需求報價",
        href: "/services/mobile-apps",
        linkLabel: "服務說明（英文）",
      },
    ],
  },
  local: {
    eyebrow: "為台灣量身打造",
    title: "台灣網站必須顧好的細節。",
    lead: "在地金流、統一發票、LINE 而非 WhatsApp，還有兩個搜尋引擎要顧：台灣網站的需求，是通用版型從來不會考慮的。",
    items: [
      {
        title: "正確的繁體中文",
        body: "設定正確的 zh-TW 語言標籤、依台灣字形標準選用系統字型，需要時再加上給海外訪客的獨立英文版。中文文案由你的團隊提供。",
      },
      {
        title: "台灣在地金流",
        body: "電商網站可串接綠界科技（ECPay）、藍新金流（NewebPay）或 TapPay，並在金流服務商支援時加入 LINE Pay、街口支付等電子支付。",
      },
      {
        title: "結帳自動開立電子發票",
        body: "在台灣線上銷售，一般需要開立統一發票。結帳時可透過金流或電子發票服務商的 API 自動開立電子發票。",
      },
      {
        title: "用 LINE 接住客人",
        body: "LINE 是台灣大多數人每天使用的通訊軟體。加入好友按鈕、LINE 官方帳號連結與 LINE Login，讓詢問留在客人本來就開著的 App 裡。",
      },
      {
        title: "同時顧好 Google 與 Yahoo",
        body: "Google 是台灣主要的搜尋引擎，而 Yahoo 奇摩搜尋的結果來自 Bing 的索引。網站會同時設定 Google Search Console 與 Bing 網站管理員工具。",
      },
      {
        title: "謹慎處理個人資料",
        body: "表單只蒐集必要資料並說明用途，設計時已參考台灣《個人資料保護法》的規範精神。",
      },
    ],
  },
  pricing: {
    eyebrow: "費用",
    title: "網站架設費用，美元與新台幣對照。",
    lead: "以下是工作室的真實價格區間。正式報價以美元固定；新台幣為約略換算並無條件進位，實際價格會在諮詢通話後以書面確定。",
    head: ["項目", "費用", "一般時程"],
    rows: [
      { item: "Landing Page 到達頁", price: both(priceBands.landing), timeline: "1–2 週" },
      { item: "形象官網（5 頁以內）", price: both(priceBands.business), timeline: "3–6 週" },
      { item: "加做第二語言（中英雙語）", price: `+ ${both(priceBands.bilingual)}`, timeline: "與網站一起報價" },
      { item: "電商網站", price: both(priceBands.ecommerce), timeline: "4–8 週" },
      { item: "網路系統", price: both(priceBands.webapp), timeline: "6–12 週" },
    ],
    footnote:
      "以上區間不含額外頁數、預約功能或會員帳號等加購項目。主機與金流手續費依實際成本支付，並使用你名下的帳號。大型平台費用可達 US$25,000 以上。",
    guide: { label: "閱讀《2026 台灣網站架設費用指南》", href: "/zh-tw/website-cost" },
  },
  proof: {
    eyebrow: "真實作品",
    title: "真實上線的軟體，全部遠端交付。",
    lead: "以下每個專案都是正在運作、可以立即打開的網站或系統，全部以遠端方式交付，與台灣專案的合作模式完全相同。",
    items: [
      {
        slug: "flaming-logistics",
        name: "Flaming Integrated Logistiks",
        body: "為奈及利亞拉哥斯一家貨運公司打造的企業物流平台：即時貨件追蹤、報價流程與完整管理後台，全程跨時區合作完成。",
        alt: "Flaming Integrated Logistiks 物流平台首頁",
      },
      {
        slug: "trinket",
        name: "Trinket",
        body: "客製化紀念禮品的品牌電商，以「依場合選購」的動線設計，讓銷售擺脫高抽成的電商平台。",
        alt: "Trinket 客製化禮品電商網站首頁",
      },
      {
        slug: "lighthouse-classes",
        name: "Lighthouse Classes",
        body: "多語言學習平台，包含課程、線上直播課與字典，並正確支援由右至左書寫的文字。多種語言，同一套乾淨的程式碼。",
        alt: "Lighthouse Classes 多語言學習平台首頁",
      },
    ],
    all: { label: "查看所有案例（英文）", href: "/work" },
  },
  process: {
    eyebrow: "合作流程",
    title: "四個步驟，全程線上進行。",
    lead: "台灣專案透過視訊會議、Email 與即時預覽連結進行，隨時都能看到進度。",
    steps: [
      {
        title: "諮詢通話",
        body: "安排在你的下午，透過 Google Meet 或 Zoom 花 30 分鐘了解你的業務、客群與目標。",
      },
      { title: "固定報價", body: "書面列出每個頁面與功能，以美元固定價格，並訂出交付日期。" },
      { title: "開發過程透明", body: "先設計、再開發，你隨時可以用手機打開專屬預覽連結檢查進度。" },
      { title: "上線與交接", body: "網站在你的網域正式上線，為團隊說明操作方式、提供文件，並包含一段保固支援期。" },
    ],
  },
  faq: {
    eyebrow: "常見問題",
    title: "台灣企業最常問的問題。",
    items: [
      {
        q: "在台灣架設一個網站要多少錢？",
        a: `在 Kodinav，客製化形象官網為 ${both(priceBands.business)}，電商網站為 ${both(priceBands.ecommerce)}，網路系統 US$8,000 起（約 ${fmtTwd(priceBands.webapp[0])}），開工前都會提供明細固定報價。台灣市場價格落差很大，因為套版方案、接案工作者與網頁設計公司賣的其實是不同的產品。`,
      },
      {
        q: "可以做繁體中文與英文的雙語網站嗎？",
        a: `可以。每種語言都有獨立網址，並設定正確的 zh-TW 與英文語言標籤及 hreflang，讓 Google 向每位訪客顯示正確版本。加做第二語言費用為 ${both(priceBands.bilingual)}。中文文案由你的團隊撰寫或審閱，確保讀起來道地。`,
      },
      {
        q: "可以用中文溝通嗎？",
        a: "專案溝通以英文進行。網站本身可以是全繁體中文、全英文或中英雙語。",
      },
      {
        q: "電商網站能串接台灣金流並開立電子發票嗎？",
        a: "可以。網站可串接綠界科技、藍新金流或 TapPay 等台灣金流，並透過金流或電子發票服務商的 API 自動開立電子發票。哪家金流最適合，取決於手續費、付款方式與物流需求，會在開發前一起決定。",
      },
      {
        q: "有幫台灣外銷企業做英文網站嗎？",
        a: "有。包含規格表的產品型錄、可下載的產品資料、詢價（RFQ）表單，以及依海外買家搜尋習慣規劃、有機會在 Google 取得排名的頁面結構。對許多製造業來說，這是投資報酬率最高的網站專案之一。",
      },
      {
        q: "架設一個網站需要多久？",
        a: "Landing Page 約 1–2 週、形象官網 3–6 週、電商網站 4–8 週、網路系統 6–12 週。最大的變數通常是內容與回饋意見提供的速度。",
      },
      {
        q: "你們在哪個時區工作？",
        a: "印度標準時間，比台灣慢 2.5 小時。工作室的上班時間與你的下午重疊，每則詢問都會在一個工作天內回覆。",
      },
      {
        q: "找台灣以外的網站開發者，風險高嗎？",
        a: "真正的風險是失聯、延誤與被綁住，這些都用書面方式處理：固定的範圍與價格、全程可查看的預覽連結、依可運作成果分期付款，以及登記在你名下的程式碼、網域與主機。",
      },
      {
        q: "網站完成後屬於誰？",
        a: "完全屬於你。程式碼、網域、主機與內容帳號都登記在你名下，交接時附上文件，你不會被工作室綁住。",
      },
    ],
  },
  form: {
    eyebrow: "免費諮詢",
    title: "為你的台灣專案索取固定報價。",
    lead: "告訴我你的需求，一個工作天內就會收到英文回覆，內容是針對你現有網站的具體觀察，而不是制式的推銷話術。",
    orgLabel: "公司名稱",
    submitLabel: "索取報價",
    budgets: [
      { value: "US$2,000 – 5,000 (≈ NT$62,000 – 155,000)", label: "US$2,000 – 5,000（約 NT$62,000 – 155,000）" },
      { value: "US$5,000 – 12,000 (≈ NT$155,000 – 372,000)", label: "US$5,000 – 12,000（約 NT$155,000 – 372,000）" },
      { value: "US$12,000 – 25,000 (≈ NT$372,000 – 775,000)", label: "US$12,000 – 25,000（約 NT$372,000 – 775,000）" },
      "US$25,000+",
      { value: "Not sure yet", label: "還不確定" },
    ],
    timelines: [
      { value: "As soon as possible", label: "越快越好" },
      { value: "Within 1 month", label: "一個月內" },
      { value: "1–3 months", label: "一到三個月內" },
      { value: "Just exploring", label: "先了解看看" },
    ],
    labels: {
      name: "姓名",
      namePlaceholder: "你的全名",
      phone: "電話 / WhatsApp",
      phonePlaceholder: "+886",
      email: "Email",
      website: "現有網站",
      websiteOptional: "（如果有）",
      budget: "預算範圍",
      budgetPlaceholder: "請選擇預算",
      timeline: "預計時程",
      timelinePlaceholder: "請選擇時程",
      sending: "送出中…",
      error: "送出失敗，請再試一次，或直接透過 WhatsApp 聯絡。",
      privacy: "不會寄送垃圾訊息，也沒有任何義務。你的資料只會用來回覆這次詢問。",
      successTitle: "已收到你的詢問。",
      successBody: "Abhinav 會在一個工作天內親自以英文回覆，通常會更快。",
    },
  },
  related: {
    eyebrow: "延伸閱讀",
    title: "台灣企業實用資源。",
    links: [
      {
        label: "2026 台灣網站架設費用指南",
        href: "/zh-tw/website-cost",
        note: "以美元與新台幣列出各類網站的真實價格區間。",
      },
      {
        label: "營業稅計算機（含稅／未稅）",
        href: "/zh-tw/business-tax-calculator",
        note: "5% 營業稅加稅、扣稅，一鍵算出整數金額。",
      },
      {
        label: "台灣網路開店指南：稅籍登記、平台、金流",
        href: "/zh-tw/online-shop-guide",
        note: "開網路商店之前要處理的五件事，逐項說明。",
      },
      {
        label: "免費網站健檢（英文介面）",
        href: "/free-website-audit",
        note: "約一分鐘檢查網站速度、手機版、SEO 與可信度。",
      },
      {
        label: "Web design & development for Taiwan (English)",
        href: "/web-development-taiwan",
        note: "This page in English.",
      },
    ],
  },
  schema: {
    name: "台灣網站架設與網頁設計",
    description: `為台灣企業量身打造形象官網、電商網站與網路系統，由創辦人 ${site.founder} 親自開發，固定報價 US$2,000 起。`,
    area: { "@type": "Country", name: "Taiwan" },
    currency: "USD",
    minPrice: priceBands.business[0],
  },
};
