import type { Metadata } from "next";
import { MarketPage } from "@/components/MarketPage";
import { hkZh } from "@/data/markets/hk-zh";
import { site } from "@/data/site";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: { absolute: "香港網頁設計及網站開發｜定價透明・固定報價｜Kodinav" },
  description:
    "為香港企業度身設計及開發網站、網店及網上系統。由創辦人親自開發，支援中英雙語，固定報價 HK$16,000 起，3 至 6 星期上線，程式碼完全屬於你。",
  keywords: [
    "網頁設計",
    "網頁設計 香港",
    "網站設計 香港",
    "網站開發 香港",
    "網頁設計公司",
    "網站製作",
    "網店開發",
    "中英雙語網站",
    "網站外判",
    "網頁設計 收費",
    "App 開發 香港",
  ],
  alternates: localeAlternates("market", hkZh.path),
  openGraph: {
    title: "香港網頁設計及網站開發｜Kodinav",
    description: "由工程師親自打造的網站、網店及網上系統。中英雙語，固定報價 HK$16,000 起。",
    url: `${site.url}${hkZh.path}`,
    type: "website",
    locale: "zh_HK",
    images: ogImage("香港網頁設計及網站開發", "香港"),
  },
};

export default function ZhHkHome() {
  return <MarketPage content={hkZh} />;
}
