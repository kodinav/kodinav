import type { Metadata } from "next";
import { MarketPage } from "@/components/MarketPage";
import { twEn } from "@/data/markets/tw-en";
import { site } from "@/data/site";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Web Design & Development for Taiwan Businesses",
  description:
    "Custom websites, e-commerce and web apps for Taiwan companies and exporters. Built by the founder, fixed quotes from US$2,000 (about NT$62,000).",
  keywords: [
    "web design Taiwan",
    "web development company Taiwan",
    "website development Taipei",
    "website design company Taiwan",
    "English website for Taiwanese company",
    "export website Taiwan manufacturer",
    "e-commerce website Taiwan",
    "ECPay integration developer",
    "web app development Taiwan",
    "website cost Taiwan",
  ],
  alternates: localeAlternates("market", twEn.path),
  openGraph: {
    title: "Web Design & Development for Taiwan Businesses",
    description:
      "Senior engineering, direct with the founder. Corporate, export and e-commerce websites for Taiwan, fixed quotes from US$2,000.",
    url: `${site.url}${twEn.path}`,
    type: "website",
    locale: "en_US",
    images: ogImage("Web design & development for Taiwan businesses", "Taiwan"),
  },
};

export default function TaiwanPage() {
  return <MarketPage content={twEn} />;
}
