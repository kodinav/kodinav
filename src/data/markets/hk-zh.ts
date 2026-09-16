import { site } from "@/data/site";
import { fmtHkd, priceBands, rangeHkd, toHkd } from "@/lib/fx";
import type { MarketContent } from "./types";

// Hong Kong written Chinese (書面語) with Hong Kong vocabulary:
// 網店, 軟件, 寄存, 電郵, 視像會議, 私隱, 星期.

const floor = fmtHkd(priceBands.business[0]);

export const hkZh: MarketContent = {
  locale: "zh-HK",
  path: "/zh-hk",
  source: "market-hk-zh",
  breadcrumb: { home: { name: "首頁", href: "/zh-hk" }, current: "香港網頁設計" },
  hero: {
    eyebrow: "香港企業網站方案",
    title: ["香港", "網頁設計", "及網站開發，由工程師親自打造。"],
    lead: `Kodinav 是一間獨立軟件工作室。創辦人 ${site.founder} 親自為香港公司設計及開發網站、網店和網上系統：載入快速、支援中英雙語，並提供 ${floor} 起的書面固定報價。由第一次通話到網站上線，你都直接與負責開發的工程師溝通。`,
    primaryCta: "索取固定報價",
    secondaryCta: { label: "WhatsApp 查詢", href: site.whatsapp, external: true },
    notes: [`${floor} 起・固定報價`, "3 至 6 星期上線", "中英雙語網站", "程式碼屬於你"],
  },
  facts: {
    eyebrow: "重點一覽",
    title: "Kodinav 香港服務：八個重點。",
    items: [
      { term: "服務範圍", detail: "企業網站、廣告登陸頁、網店、網上系統（Web App）及手機應用程式。" },
      {
        term: "由誰開發",
        detail: `創辦人兼軟件工程師 ${site.founder} 親自開發，不經客戶經理，亦不外判。`,
      },
      {
        term: "價錢",
        detail: `企業網站 ${floor} 起（約 US$2,000）。每個項目都有列明細項的書面固定報價。`,
      },
      { term: "製作時間", detail: "登陸頁 1–2 星期、企業網站 3–6 星期、網店 4–8 星期、網上系統 6–12 星期。" },
      { term: "語言", detail: "網站可以是繁體中文、英文或中英雙語。專案溝通以英文進行。" },
      {
        term: "工作室位置",
        detail: "印度德里首都圈（Delhi NCR）。香港項目透過 WhatsApp、電郵及視像會議遙距進行。",
      },
      { term: "時差", detail: "香港比印度快 2.5 小時，你的下午正好是工作室的辦公時間。" },
      { term: "擁有權", detail: "程式碼、域名、寄存服務及數據由第一天起登記在你名下。" },
    ],
  },
  why: {
    eyebrow: "為何選擇獨立工作室",
    title: "直接與工程師合作，不經中間人。",
    lead: "香港不缺網頁設計公司。真正難找的，是可以直接用 WhatsApp 聯絡、親手寫程式的資深工程師，而且報價反映的是工作本身，而不是公司的營運開支。",
    items: [
      {
        title: "你交代需求的人，就是開發的人",
        body: "不少公司由資深同事負責洽談，實際製作卻交給初級員工。在 Kodinav，第一次通話的工程師會親自寫每一行程式碼，需求不會在傳達之間走樣。",
      },
      {
        title: "在客戶的手機上一樣快",
        body: "大部分客戶第一次接觸你的公司，都是用手機。網頁在伺服器端預先渲染、圖片按裝置尺寸輸出、腳本減到最少，一秒內載入是基本標準，而不是額外收費項目。",
      },
      {
        title: "中英雙語，結構清晰",
        body: "中文版和英文版共用同一套程式碼，各有獨立網址、語言標籤及 hreflang 設定，讓 Google 向每位客戶顯示正確語言，兩個版本都不會淪為附屬品。",
      },
      {
        title: "可以直接交給上司審批的固定報價",
        body: "書面報價以港幣或美元列明每一頁及每項功能。已協定的就是最終收費，並按可運作的進度分期付款。",
      },
    ],
  },
  services: {
    eyebrow: "服務範圍",
    title: "由公司網站到度身訂造的系統。",
    lead: "以下每項服務都由同一位工程師設計、開發及支援。價錢為工作室以港幣計算的真實起步價。",
    items: [
      {
        title: "企業網站",
        body: "清楚介紹業務、把瀏覽者轉化為查詢的公司及專業服務網站。",
        price: `${floor} 起`,
        href: "/services/business-websites",
        linkLabel: "服務詳情（英文）",
      },
      {
        title: "網店",
        body: "產品目錄、購物車及網上付款一應俱全，速度不受現成模板限制。",
        price: `${fmtHkd(priceBands.ecommerce[0])} 起`,
        href: "/services/ecommerce",
        linkLabel: "服務詳情（英文）",
      },
      {
        title: "網上系統",
        body: "預約系統、客戶平台、管理後台及內部工具，按你團隊的實際流程度身設計。",
        price: `${fmtHkd(priceBands.webapp[0])} 起`,
        href: "/services/web-applications",
        linkLabel: "服務詳情（英文）",
      },
      {
        title: "廣告登陸頁",
        body: "為 Google 及 Meta 廣告而設的單一目標頁面，並已設定轉換追蹤。",
        price: `${fmtHkd(priceBands.landing[0])} 起`,
        href: "/services/landing-page-development",
        linkLabel: "服務詳情（英文）",
      },
      {
        title: "網站重建",
        body: "重建緩慢或過時的網站，同時保留已累積的 Google 排名。",
        price: "按範圍報價",
        href: "/services/website-redesign",
        linkLabel: "服務詳情（英文）",
      },
      {
        title: "手機應用程式",
        body: "一套程式碼同時支援 iOS 及 Android，並與網站共用後台。",
        price: "按範圍報價",
        href: "/services/mobile-apps",
        linkLabel: "服務詳情（英文）",
      },
    ],
  },
  local: {
    eyebrow: "專為香港而設",
    title: "香港網站需要注意的細節。",
    lead: "兩種書面語言、習慣用 WhatsApp 的客戶、本地付款方式，以及個人資料私隱法例：香港網站的要求，是現成模板不會考慮的。",
    items: [
      {
        title: "繁體中文與英文",
        body: "每種語言各有獨立網址、正確的 lang 及 hreflang 標籤，切換語言時仍停留在同一頁面。中文文案由你的團隊提供或審閱，確保讀來自然地道。",
      },
      {
        title: "香港人常用的付款方式",
        body: "透過 Stripe 或 PayPal 等支付閘道接受信用卡，並可經支援的支付服務商接受轉數快（FPS）、AlipayHK 或 WeChat Pay HK。最適合的組合視乎你的客戶及手續費而定。",
      },
      {
        title: "以 WhatsApp 為中心",
        body: "一按即可聯絡的 WhatsApp 按鈕、預設查詢訊息及 WhatsApp Business 連結，放在客戶決定聯絡你的每一個位置。",
      },
      {
        title: "重視私隱的表格",
        body: "查詢及預約表格只收集必要資料，說明資料用途並附上清晰的私隱政策，設計時已考慮《個人資料（私隱）條例》的收集原則。",
      },
      {
        title: "在 Google 香港搜尋得到",
        body: "伺服器端渲染的頁面、結構化資料（Schema），以及按香港人搜尋習慣撰寫的中英文標題。",
      },
      {
        title: "由就近的伺服器提供",
        body: "網站部署於 Cloudflare 或 Vercel 等內容傳遞網絡（CDN），直接由位於香港的節點向訪客提供頁面。",
      },
    ],
  },
  pricing: {
    eyebrow: "港幣收費",
    title: "網站製作收費，以港幣計算。",
    lead: "以下是工作室的真實價格範圍，按港元聯繫匯率由美元換算並向上取整。你的實際價錢會在簡短的諮詢通話後以書面固定。",
    head: ["項目", "價錢（港幣）", "一般製作時間"],
    rows: [
      { item: "廣告登陸頁", price: rangeHkd(priceBands.landing), timeline: "1–2 星期" },
      { item: "企業網站（5 頁以內）", price: rangeHkd(priceBands.business), timeline: "3–6 星期" },
      { item: "加設第二語言（中英雙語）", price: `+ ${rangeHkd(priceBands.bilingual)}`, timeline: "與網站一併報價" },
      { item: "網店", price: rangeHkd(priceBands.ecommerce), timeline: "4–8 星期" },
      { item: "網上系統", price: rangeHkd(priceBands.webapp), timeline: "6–12 星期" },
    ],
    footnote: `以上範圍不包括額外頁數、預約功能或會員帳戶等附加項目。網站寄存按成本收費，並使用登記在你名下的帳戶。大型平台的費用可達 HK$${toHkd(25000).toLocaleString("en-US")} 或以上。`,
    guide: { label: "閱讀《2026 香港網站設計收費指南》", href: "/zh-hk/website-cost" },
  },
  proof: {
    eyebrow: "真實作品",
    title: "真實運作中的軟件，全部遙距交付。",
    lead: "以下每個項目都是正在運作、可以即時打開的網站或系統，而且全部以遙距方式交付，與香港項目的合作模式完全相同。",
    items: [
      {
        slug: "flaming-logistics",
        name: "Flaming Integrated Logistiks",
        body: "為尼日利亞拉各斯一間貨運公司開發的企業物流平台：即時貨件追蹤、報價流程及完整管理後台，全程跨時區合作完成。",
        alt: "Flaming Integrated Logistiks 物流平台首頁",
      },
      {
        slug: "lighthouse-classes",
        name: "Lighthouse Classes",
        body: "多語言學習平台，包括課程、網上直播課及字典，並正確處理由右至左書寫的烏爾都文及波斯文。多種語言，同一套整潔的程式碼。",
        alt: "Lighthouse Classes 多語言學習平台首頁",
      },
      {
        slug: "kosmo-dental-clinic",
        name: "Kosmo Dental Clinic",
        body: "牙科診所網站，全天候接收預約申請，在手機上一按即可致電或以 WhatsApp 查詢。",
        alt: "Kosmo Dental Clinic 牙科診所網站首頁",
      },
    ],
    all: { label: "查看所有個案（英文）", href: "/work" },
  },
  process: {
    eyebrow: "合作流程",
    title: "四個步驟，全程網上進行。",
    lead: "香港項目透過視像會議、WhatsApp 及即時預覽連結進行，你毋須離開辦公室。",
    steps: [
      {
        title: "諮詢通話",
        body: "安排在你下午的時間，以 Zoom、Google Meet 或 WhatsApp 討論 30 分鐘，了解你的業務和目標。",
      },
      { title: "固定報價", body: "書面列明每一頁及每項功能，以港幣或美元固定價錢，並訂明交付日期。" },
      { title: "開發過程透明", body: "先設計、後開發，你隨時可以用手機打開私人預覽連結查看進度。" },
      { title: "上線及交接", body: "網站於你的域名正式上線，為你的團隊講解使用方法，附上文件，並包括一段支援期。" },
    ],
  },
  faq: {
    eyebrow: "常見問題",
    title: "香港企業最常問的問題。",
    items: [
      {
        q: "香港網頁設計收費大約多少？",
        a: `在 Kodinav，度身訂造的企業網站收費為 ${rangeHkd(priceBands.business)}，網店為 ${rangeHkd(priceBands.ecommerce)}，網上系統則由 ${fmtHkd(priceBands.webapp[0])} 起，全部在開工前提供列明細項的固定報價。香港市場價格差異很大，因為模板套餐、自由工作者及設計公司提供的其實是不同產品。`,
      },
      {
        q: "可以製作中英雙語網站嗎？",
        a: `可以。每種語言各有獨立網址，並設定正確的語言及 hreflang 標籤，讓 Google 向用戶顯示合適的版本；切換語言時亦會停留在同一頁面。加設第二語言的費用為 ${rangeHkd(priceBands.bilingual)}。中文文案由你的團隊撰寫或審閱，確保自然地道。`,
      },
      {
        q: "可以用中文溝通嗎？",
        a: "專案溝通以英文進行，英文在香港商界亦被廣泛使用。網站本身可以是全繁體中文、全英文或中英雙語。",
      },
      {
        q: "找香港以外的網站開發者合作，會有風險嗎？",
        a: "真正的風險是失聯、延誤及被綁死，而這些都以書面方式處理：固定的範圍及價錢、全程可查看的預覽連結、按可運作的成果分期付款，以及登記在你名下的程式碼、域名及寄存服務。作品集中每個項目都正在運作，你可以先查看再決定。",
      },
      {
        q: "製作一個網站需要多久？",
        a: "登陸頁約 1–2 星期、企業網站 3–6 星期、網店 4–8 星期、網上系統 6–12 星期。最大的變數通常是內容及意見回覆的速度。",
      },
      {
        q: "你們在哪個時區工作？",
        a: "印度標準時間，比香港慢 2.5 小時。工作室的辦公時間與你的下午重疊，每個查詢都會在一個工作天內回覆。",
      },
      {
        q: "網店可以接受哪些付款方式？",
        a: "可透過 Stripe 或 PayPal 等支付閘道接受信用卡，並可經支援香港商戶的支付服務商接受轉數快（FPS）、AlipayHK 或 WeChat Pay HK。最合適的組合視乎你的客戶、手續費及結算需要，會在開發前確定。",
      },
      {
        q: "可以保證網站在 Google 香港排第一嗎？",
        a: "任何誠實的開發者都不能保證排名。Kodinav 保證的是 Google 重視的技術基礎：快速的伺服器端渲染頁面、清晰結構、結構化資料，以及按香港人搜尋習慣撰寫的中英文標題。排名其後會隨內容及口碑逐步提升。",
      },
      {
        q: "網站完成後屬於誰？",
        a: "完全屬於你。程式碼、域名、寄存及內容帳戶全部登記在你名下，並在交接時提供文件，你不會被工作室綁死。",
      },
    ],
  },
  form: {
    eyebrow: "免費諮詢",
    title: "為你的香港項目索取固定報價。",
    lead: "告訴我你的需要，一個工作天內便會收到英文回覆，內容是對你現有網站的真實觀察，而不是千篇一律的推銷說辭。",
    orgLabel: "公司名稱",
    submitLabel: "索取報價",
    budgets: [
      "HK$16,000 – 40,000",
      "HK$40,000 – 100,000",
      "HK$100,000 – 200,000",
      "HK$200,000+",
      { value: "Not sure yet", label: "未確定" },
    ],
    timelines: [
      { value: "As soon as possible", label: "越快越好" },
      { value: "Within 1 month", label: "一個月內" },
      { value: "1–3 months", label: "一至三個月內" },
      { value: "Just exploring", label: "只是了解一下" },
    ],
    labels: {
      name: "你的姓名",
      namePlaceholder: "全名",
      phone: "電話 / WhatsApp",
      phonePlaceholder: "+852",
      email: "電郵",
      website: "現有網站",
      websiteOptional: "（如有）",
      budget: "預算範圍",
      budgetPlaceholder: "選擇預算",
      timeline: "預計時間",
      timelinePlaceholder: "選擇時間",
      sending: "傳送中…",
      error: "傳送失敗，請再試一次，或直接以 WhatsApp 聯絡。",
      privacy: "不會發送垃圾訊息，亦無任何義務。你的資料只會用於回覆這次查詢。",
      successTitle: "已收到你的查詢。",
      successBody: "Abhinav 會在一個工作天內親自以英文回覆你，通常會更快。",
    },
  },
  related: {
    eyebrow: "延伸閱讀",
    title: "香港企業實用資源。",
    links: [
      {
        label: "2026 香港網站設計收費指南",
        href: "/zh-hk/website-cost",
        note: "以港幣列出各類網站的真實價格範圍。",
      },
      {
        label: "轉數快 QR code 產生器",
        href: "/zh-hk/fps-qr-code-generator",
        note: "輸入 FPS ID、手機或電郵，即時生成收款 QR code。",
      },
      {
        label: "香港利得稅計算機",
        href: "/zh-hk/profits-tax-calculator",
        note: "按兩級制稅率計算法團及非法團業務的利得稅。",
      },
      {
        label: "香港開網店指南：商業登記、平台、收款",
        href: "/zh-hk/online-shop-guide",
        note: "開網店之前要處理的五件事，逐項說明。",
      },
      {
        label: "用 AI 做網站得唔得？",
        href: "/zh-hk/ai-website-builder",
        note: "AI 建站做得好與會出事的地方，以及何時值得請人。",
      },
      {
        label: "免費網站檢測（英文介面）",
        href: "/free-website-audit",
        note: "約一分鐘檢查網站速度、手機版、SEO 及可信度。",
      },
      {
        label: "Web design & development for Hong Kong (English)",
        href: "/web-development-hong-kong",
        note: "This page in English.",
      },
    ],
  },
  schema: {
    name: "香港網頁設計及網站開發",
    description: `為香港企業度身設計及開發網站、網店及網上系統，由創辦人 ${site.founder} 親自開發，固定報價 ${floor} 起。`,
    area: { "@type": "AdministrativeArea", name: "Hong Kong" },
    currency: "HKD",
    minPrice: toHkd(priceBands.business[0]),
  },
};
