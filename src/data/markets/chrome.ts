import { site } from "@/data/site";

/**
 * Header/footer copy for the Traditional Chinese sections. Hong Kong and
 * Taiwan are written separately on purpose: the vocabulary differs
 * (軟件 vs 軟體, 私隱 vs 隱私, 電郵 vs Email), and a Taiwanese reader
 * notices Hong Kong usage immediately, and vice versa.
 */
export type ZhLocale = "zh-HK" | "zh-TW";

export type ZhChromeCopy = {
  whatsappHref: string;
  phoneLabel: string;
  home: string;
  homeAria: string;
  skip: string;
  menu: string;
  close: string;
  nav: { label: string; href: string }[];
  cta: { label: string; href: string };
  languages: { label: string; href: string; hrefLang: string }[];
  footer: {
    blurb: string;
    note: string;
    navTitle: string;
    contactTitle: string;
    languagesTitle: string;
    whatsapp: string;
    legal: { label: string; href: string }[];
    rights: string;
  };
  whatsappAria: string;
};

export const zhChrome: Record<ZhLocale, ZhChromeCopy> = {
  "zh-HK": {
    whatsappHref: site.whatsappZh.hk,
    phoneLabel: "致電",
    home: "/zh-hk",
    homeAria: "Kodinav 香港首頁",
    skip: "跳到主要內容",
    menu: "選單",
    close: "關閉",
    nav: [
      { label: "服務", href: "/zh-hk#services" },
      { label: "收費", href: "/zh-hk/website-cost" },
      { label: "轉數快 QR", href: "/zh-hk/fps-qr-code-generator" },
      { label: "利得稅計算機", href: "/zh-hk/profits-tax-calculator" },
      { label: "作品（英文）", href: "/work" },
    ],
    cta: { label: "免費諮詢", href: "/zh-hk#lead-form" },
    languages: [
      { label: "English", href: "/web-development-hong-kong", hrefLang: "en-HK" },
      { label: "台灣", href: "/zh-tw", hrefLang: "zh-TW" },
    ],
    footer: {
      blurb: `Kodinav 是一間獨立軟件工作室，由創辦人 ${site.founder} 親自設計及開發網站、網上系統和手機應用程式。`,
      note: "工作室設於印度，以遙距方式服務香港及世界各地的企業。專案溝通以英文進行。",
      navTitle: "導覽",
      contactTitle: "聯絡",
      languagesTitle: "其他語言及地區",
      whatsapp: "WhatsApp 查詢",
      legal: [
        { label: "私隱政策（英文）", href: "/privacy-policy" },
        { label: "條款及細則（英文）", href: "/terms" },
      ],
      rights: "版權所有",
    },
    whatsappAria: `WhatsApp 查詢（${site.phone}）`,
  },
  "zh-TW": {
    whatsappHref: site.whatsappZh.tw,
    phoneLabel: "來電",
    home: "/zh-tw",
    homeAria: "Kodinav 台灣首頁",
    skip: "跳到主要內容",
    menu: "選單",
    close: "關閉",
    nav: [
      { label: "服務項目", href: "/zh-tw#services" },
      { label: "架站費用", href: "/zh-tw/website-cost" },
      { label: "營業稅計算機", href: "/zh-tw/business-tax-calculator" },
      { label: "作品集（英文）", href: "/work" },
    ],
    cta: { label: "免費諮詢", href: "/zh-tw#lead-form" },
    languages: [
      { label: "English", href: "/web-development-taiwan", hrefLang: "en-TW" },
      { label: "香港", href: "/zh-hk", hrefLang: "zh-HK" },
    ],
    footer: {
      blurb: `Kodinav 是獨立軟體工作室，由創辦人 ${site.founder} 親自設計與開發網站、網路系統與 App。`,
      note: "工作室位於印度，以遠端方式服務台灣與全球企業。專案溝通以英文進行。",
      navTitle: "網站導覽",
      contactTitle: "聯絡我們",
      languagesTitle: "其他語言與地區",
      whatsapp: "WhatsApp 詢問",
      legal: [
        { label: "隱私權政策（英文）", href: "/privacy-policy" },
        { label: "服務條款（英文）", href: "/terms" },
      ],
      rights: "版權所有",
    },
    whatsappAria: `WhatsApp 詢問（${site.phone}）`,
  },
};
