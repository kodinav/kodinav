import type { Metadata } from "next";
import { TaxCalculator } from "@/components/TaxCalculator";
import { ZhToolShell } from "@/components/zh/ZhToolShell";
import { site } from "@/data/site";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { cjkWords } from "@/lib/cjk";
import { faqSchema } from "@/lib/schema";

const path = "/zh-tw/business-tax-calculator";

export const metadata: Metadata = {
  title: "營業稅計算機｜含稅、未稅 5% 一鍵換算",
  description:
    "免費營業稅計算機：輸入未稅價自動加上 5% 營業稅，或從含稅價拆出未稅金額與稅額，並依統一發票算法四捨五入到元。",
  keywords: ["營業稅計算", "營業稅計算機", "含稅計算", "未稅計算", "含稅價 未稅價", "5% 營業稅", "發票稅額計算"],
  alternates: localeAlternates("businessTax", path),
  openGraph: {
    title: "營業稅計算機｜含稅、未稅 5% 一鍵換算",
    description: "5% 營業稅加稅、拆稅，自動算到整數元。免費使用。",
    url: `${site.url}${path}`,
    type: "website",
    locale: "zh_TW",
    images: ogImage("營業稅計算機", "免費工具"),
  },
};

const faqs = [
  {
    q: "台灣營業稅率是多少？",
    a: "一般營業人適用 5% 加值型營業稅。免用統一發票的小規模營業人，則由國稅局查定銷售額後按 1% 課徵；部分特種行業另有不同稅率。本工具只負責計算，實際適用哪個稅率，請洽詢會計師或國稅局。",
  },
  {
    q: "含稅價怎麼換算成未稅價？",
    a: "把含稅金額除以 1.05，四捨五入到元，就是未稅銷售額；稅額等於含稅金額減去未稅金額。例如含稅 NT$1,050，未稅為 NT$1,000，稅額為 NT$50。直接用含稅價乘以 5% 會算錯。",
  },
  {
    q: "為什麼計算結果都是整數？",
    a: "統一發票以新台幣元為單位，稅額算到元、元以下四捨五入。本工具採用相同算法，確保未稅金額加上稅額剛好等於含稅總額。",
  },
  {
    q: "發票上的稅額要分開寫嗎？",
    a: "開立給提供統一編號的公司行號時，發票會分別列出銷售額與稅額；開給一般消費者的發票，通常只列含稅總額。",
  },
  {
    q: "營業稅多久申報一次？",
    a: "使用統一發票的營業人，一般每兩個月申報繳納一次，於每期結束後次月 15 日前完成。",
  },
];

export default function ZhTwBusinessTaxPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "營業稅計算機",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      inLanguage: "zh-TW",
      url: `${site.url}${path}`,
      description: "5% 營業稅加稅、拆稅的免費計算工具，依統一發票算法四捨五入到元。",
      provider: { "@id": `${site.url}/#studio` },
      offers: { "@type": "Offer", price: "0", priceCurrency: "TWD" },
    },
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首頁", item: `${site.url}/zh-tw` },
        { "@type": "ListItem", position: 2, name: "營業稅計算機", item: `${site.url}${path}` },
      ],
    },
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ZhToolShell
        breadcrumb={{ home: { name: "首頁", href: "/zh-tw" }, current: "營業稅計算機" }}
        eyebrow="免費營業稅計算機"
        title={
          <>
            {cjkWords("營業稅含稅、未稅，", "zh-TW")}
            <span className="text-gradient">{cjkWords("一鍵換算。", "zh-TW")}</span>
          </>
        }
        lead="輸入未稅價自動加上營業稅，或從含稅價拆出未稅金額與稅額，並依統一發票算法四捨五入到元。"
        tool={
          <TaxCalculator
            taxName="營業稅"
            currency="NT$"
            rates={[5, 1]}
            defaultRate={5}
            wholeUnits
            labels={{
              mode: "你手上的金額是？",
              add: "未稅價：幫我加稅",
              remove: "含稅價：幫我拆出稅額",
              amount: "金額（新台幣）",
              rate: "營業稅率",
              breakdown: "計算結果",
              net: "未稅金額（銷售額）",
              tax: "營業稅",
              total: "含稅總額",
              empty: "輸入金額後，這裡會顯示未稅金額、營業稅與含稅總額。可以從未稅價加稅，也可以從含稅價拆出稅額。",
              disclaimer: "僅提供計算。實際適用的稅率，請洽詢你的會計師或國稅局。",
            }}
          />
        }
        faqTitle="關於營業稅的常見問題。"
        faqs={faqs}
        funnel={{
          eyebrow: "需要客製化網站或系統？",
          body: "這個工具永久免費。如果你的公司需要形象官網、電商網站或內部系統，Kodinav 可以為你設計與開發。",
          label: "了解網站架設服務",
          href: "/zh-tw",
        }}
        related={{
          title: "延伸閱讀",
          links: [
            { label: "2026 台灣網站架設費用指南", href: "/zh-tw/website-cost" },
            { label: "台灣網站架設與網頁設計", href: "/zh-tw" },
            { label: "Taiwan Business Tax Calculator (English)", href: "/taiwan-business-tax-calculator" },
          ],
        }}
      />
    </>
  );
}
