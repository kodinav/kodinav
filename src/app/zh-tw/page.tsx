import type { Metadata } from "next";
import { MarketPage } from "@/components/MarketPage";
import { twZh } from "@/data/markets/tw-zh";
import { site } from "@/data/site";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: { absolute: "網站架設與網頁設計｜台灣企業固定報價｜Kodinav" },
  description:
    "為台灣企業量身打造形象官網、電商網站與網路系統。創辦人親自開發，支援中英雙語與台灣金流，固定報價 US$2,000 起（約 NT$62,000），程式碼完全屬於你。",
  keywords: [
    "網站架設",
    "網頁設計",
    "網站設計公司",
    "網站建置",
    "形象官網",
    "電商網站架設",
    "購物網站架設",
    "客製化網站",
    "RWD 響應式網站",
    "網站外包",
    "外銷英文網站",
    "APP 開發",
  ],
  alternates: localeAlternates("market", twZh.path),
  openGraph: {
    title: "台灣網站架設與網頁設計｜Kodinav",
    description: "由工程師親自打造的形象官網、電商網站與網路系統。固定報價 US$2,000 起（約 NT$62,000）。",
    url: `${site.url}${twZh.path}`,
    type: "website",
    locale: "zh_TW",
    images: ogImage("台灣網站架設與網頁設計", "台灣"),
  },
};

export default function ZhTwHome() {
  return <MarketPage content={twZh} />;
}
