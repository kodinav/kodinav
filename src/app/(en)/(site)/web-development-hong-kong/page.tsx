import type { Metadata } from "next";
import { MarketPage } from "@/components/MarketPage";
import { hkEn } from "@/data/markets/hk-en";
import { site } from "@/data/site";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Web Design & Development for Hong Kong Businesses",
  description:
    "Custom websites, online shops and web apps for Hong Kong businesses. Built by the founder, fixed quotes from HK$16,000, English and Chinese bilingual ready.",
  keywords: [
    "web design Hong Kong",
    "web development company Hong Kong",
    "website development Hong Kong",
    "website design company Hong Kong",
    "e-commerce website Hong Kong",
    "bilingual website Hong Kong",
    "outsource web development Hong Kong",
    "web app development Hong Kong",
    "Next.js developer Hong Kong",
    "website cost Hong Kong",
  ],
  alternates: localeAlternates("market", hkEn.path),
  openGraph: {
    title: "Web Design & Development for Hong Kong Businesses",
    description:
      "Senior engineering, direct with the founder. Bilingual-ready websites, online shops and web apps, fixed quotes from HK$16,000.",
    url: `${site.url}${hkEn.path}`,
    type: "website",
    locale: "en_HK",
    images: ogImage("Web design & development for Hong Kong businesses", "Hong Kong"),
  },
};

export default function HongKongPage() {
  return <MarketPage content={hkEn} />;
}
