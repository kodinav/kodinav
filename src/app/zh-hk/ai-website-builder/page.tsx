import type { Metadata } from "next";
import { GuidePage, type GuideContent } from "@/components/zh/GuidePage";
import { site } from "@/data/site";
import { rangeHkd, priceBands } from "@/lib/fx";
import { ogImage } from "@/lib/og";

const path = "/zh-hk/ai-website-builder";

const content: GuideContent = {
  locale: "zh-HK",
  path,
  title: "用 AI 做網站得唔得？一個每日用 AI 寫程式的工程師的答案",
  excerpt:
    "Claude、Gemini、vibe coding 現在真的可以做出一個網站。問題從來不是做不做得出，而是上線之後：速度、SEO、收款、個人資料、維護，以及出事時誰負責。",
  date: "2026-09-16",
  tag: "AI 與網站",
  meta: { updated: "更新日期：", readingTime: "閱讀時間約 8 分鐘", author: `作者：${site.founder}` },
  breadcrumb: { home: { name: "首頁", href: "/zh-hk" }, current: "用 AI 做網站" },
  sections: [
    {
      heading: "簡單答案",
      paragraphs: [
        "可以。用 Claude、Gemini 或任何一個 AI 建站工具，今日確實可以在一個下午做出一個看起來完成的網站。這不是宣傳，我們自己每日都用 AI 寫程式，這個網站的開發過程也大量用到。",
        "真正的問題是：做出來之後會怎樣。網站的難處從來不在於把版面砌出來，而在於它上線之後要足夠快、能被 Google 找到、能安全地收錢、能正確處理客人的個人資料、日後可以繼續改，而且出事時有人負責。AI 在前者非常強，在後者目前仍然很弱。",
        "以下是具體哪些位做得好、哪些位會出事，以及什麼情況下你其實不需要請人。",
      ],
    },
    {
      heading: "AI 現在做得相當好的部分",
      paragraphs: [
        "第一版版面和設計方向：把想法變成可以看到的畫面，AI 比人手快很多，用來討論和篩選方向非常有效。",
        "文案初稿：結構、標題、產品描述的初稿，AI 可以省下大量時間，之後由你按品牌語氣修訂。",
        "原型和內部工具：只給自己或同事用、不對外、不收錢、不存客人資料的東西，AI 做到的水準通常已經足夠。",
        "小修小補：改文字、換顏色、加一個區塊，這類改動用 AI 處理快而準。",
      ],
    },
    {
      heading: "AI 通常做不好的部分",
      paragraphs: [
        "載入速度。AI 傾向堆砌現成 library 和未經處理的大圖，做出來的頁面在辦公室 Wi-Fi 看似正常，在手機行動網絡上卻要等幾秒。速度同時影響 Google 排名和成交率。",
        "SEO 結構。頁面標題、描述、標題層級、結構化資料、網站地圖，以及中英雙語網站必需的 hreflang 設定，AI 生成時經常遺漏或做錯。錯誤不會令網站壞掉，只會令它一直搜尋不到。",
        "真機測試。iPhone 的安全區、輸入框自動放大、收合鍵盤後的版面跳動，這些問題只有在真實裝置上試過才會發現。",
        "收款與安全。API 金鑰寫死在前端、webhook 沒有驗證、表單沒有防濫用措施——AI 生成的程式碼出現這些問題並不罕見，而代價是金錢或客戶資料。",
        "個人資料。香港《個人資料（私隱）條例》要求你在收集個人資料時說明用途和處理方式。AI 會生成一份看似合理的私隱政策，但不會知道你的表格實際收集了什麼、資料存放在哪裡。",
        "可維護性。一次過生成的程式碼，往往在第三、第四次改動時開始互相衝突。真正的成本不在第一版，而在之後每一次修改。",
        "上線後的基建。寄存、備份、網域續期、電郵送達設定（SPF、DKIM、DMARC）——沒有這些，你的訂單確認電郵會靜靜地跌入垃圾郵件。",
        "責任。出事的時候，AI 不會回覆你的 WhatsApp。",
      ],
    },
    {
      heading: "成本的真實面貌",
      paragraphs: [
        "AI 工具本身很便宜，這也是它吸引的原因。但要比較的不是工具月費，而是整件事的總成本：你的時間、上線後的修補，以及萬一要重做的費用。",
      ],
      table: {
        head: ["做法", "費用", "適合什麼情況"],
        rows: [
          ["自己用 AI 工具做", "工具月費 + 你的時間", "驗證概念、內部工具、單頁活動網站"],
          ["自己用 AI 做，再請人檢查及修正", "按範圍報價", "網站已經上線，但速度、SEO 或收款有問題"],
          ["請人由頭做一個企業網站", rangeHkd(priceBands.business), "網站需要帶來查詢、在 Google 有排名"],
          ["請人由頭做一個網店", rangeHkd(priceBands.ecommerce), "要安全收款、管理訂單、長期經營"],
        ],
      },
      links: [{ label: "2026 香港網站設計收費指南", href: "/zh-hk/website-cost" }],
    },
    {
      heading: "什麼情況下，AI 自己做就夠",
      paragraphs: [
        "如果你正在驗證一個未確定的生意念頭、要一個只用一次的活動頁、做一個只給同事用的內部工具，或者預算實在很緊——用 AI 自己做，是完全合理的決定，我們也會這樣建議。",
        "反過來，如果網站要靠 Google 帶客、要在網上收錢、要儲存客人資料，或者品牌形象本身就是生意的一部分，那麼把工程判斷交給沒有人負責的生成結果，風險通常大於省下的費用。",
      ],
    },
    {
      heading: "已經用 AI 做好了網站？先做這個檢查",
      paragraphs: [
        "在手機用行動網絡打開你的網站，數一數要等幾多秒才看到標題；在 Google 搜尋「site:你的網域」，看看有幾多頁被收錄；填一次自己的查詢表格，確認電郵真的收到而不是進了垃圾郵件；檢查有沒有私隱政策，以及它是否符合你實際收集的資料；最後確認網域、寄存和程式碼的帳戶全部在你名下。",
        "任何一項不過關，都不代表要重做整個網站——通常是三四個具體問題。我們有一個免費的網站檢測工具，會一次過檢查速度、手機版、SEO 及可信度，並用日常語言說明每一項的意思。",
      ],
      links: [{ label: "立即檢測你的網站（免費）", href: "/free-website-audit" }],
    },
    {
      heading: "我們自己都用 AI，所以更清楚分界線在哪",
      paragraphs: [
        "Kodinav 的開發流程大量使用 AI：生成初稿、重構、寫測試、檢查程式碼。分別在於，架構決定、效能預算、SEO 結構、真機測試、安全處理和上線後的責任，由工程師承擔，而不是交給生成結果。",
        "換句話說，AI 令做網站更快，但不會令「有人負責」這件事變得不必要。",
      ],
    },
  ],
  faq: {
    title: "常見問題",
    items: [
      {
        q: "用 AI 做的網站可以在 Google 排到嗎？",
        a: "可以，但不會因為用了 AI 而自動有排名。Google 看的是頁面速度、結構、內容是否切合搜尋意圖，以及其他網站有沒有連結到你。AI 生成的網站常見的問題是標題、結構化資料和網站地圖不完整，令收錄變慢；這些可以補救，但要有人知道要補什麼。",
      },
      {
        q: "Claude、Gemini 或 vibe coding 做出來的網站，最常見的問題是什麼？",
        a: "按我們檢查過的網站，最常見的依次是：手機載入太慢、SEO 基本結構缺失、查詢表格的電郵送達有問題、API 金鑰或安全設定處理不當，以及改到第三四次之後程式碼開始互相衝突。",
      },
      {
        q: "我已經用 AI 做了網站，可以請你幫忙執嗎？",
        a: "可以，而且通常比重做便宜。做法是先檢查現況，列出實際有問題的項目和修正需要的工作，再提供固定報價；如果現有程式碼結構已經無法繼續改，我們會直接說明，而不是收錢慢慢補。",
      },
      {
        q: "AI 會取代網頁設計師和開發者嗎？",
        a: "部分工序已經被取代，做初稿的速度尤其明顯。未被取代的是判斷和責任：決定架構、取捨效能、處理安全與個人資料，以及在出事時有人跟進。現階段最現實的說法是，用 AI 的工程師會取代不用 AI 的工程師。",
      },
    ],
  },
  cta: {
    title: "想有人看一看你的 AI 網站？",
    body: "告訴我你的網址，我會親自看一次，一個工作天內以英文回覆，指出實際存在的問題——即使結論是暫時不用花錢改。",
    label: "免費諮詢",
    href: "/zh-hk#lead-form",
  },
  related: {
    title: "延伸閱讀",
    links: [
      { label: "免費網站檢測（英文介面）", href: "/free-website-audit" },
      { label: "2026 香港網站設計收費指南", href: "/zh-hk/website-cost" },
      { label: "香港開網店指南", href: "/zh-hk/online-shop-guide" },
      { label: "香港網頁設計及網站開發", href: "/zh-hk" },
    ],
  },
};

export const metadata: Metadata = {
  title: "用 AI 做網站得唔得？AI 建站的真實限制",
  description:
    "Claude、Gemini、vibe coding 真的可以做出網站。由每日用 AI 寫程式的工程師說明：AI 做得好的部分、會出事的部分（速度、SEO、收款、私隱、維護），以及什麼時候值得請人。",
  keywords: [
    "用 ai 做網站",
    "ai 做網站",
    "claude 做網站",
    "gemini 做網站",
    "vibe coding 做網站",
    "ai 網頁設計",
    "ai 建站 缺點",
    "ai 網站 seo",
  ],
  alternates: { canonical: path },
  openGraph: {
    title: content.title,
    description: content.excerpt,
    url: `${site.url}${path}`,
    type: "article",
    locale: "zh_HK",
    images: ogImage("用 AI 做網站的真實限制", "AI 與網站"),
  },
};

export default function ZhHkAiWebsitePage() {
  return <GuidePage content={content} />;
}
