import type { Metadata } from "next";
import { ProfitsTaxCalculator, type ProfitsTaxLabels } from "@/components/ProfitsTaxCalculator";
import { ZhToolShell } from "@/components/zh/ZhToolShell";
import { site } from "@/data/site";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { cjkWords } from "@/lib/cjk";
import { faqSchema } from "@/lib/schema";

const path = "/zh-hk/profits-tax-calculator";

export const metadata: Metadata = {
  title: "香港利得稅計算機｜兩級制稅率即時計算",
  description:
    "免費香港利得稅計算機：按兩級制稅率計算法團（8.25%／16.5%）及非法團業務（7.5%／15%）應繳稅款，並顯示實際稅率及寬減後稅額。",
  keywords: ["利得稅計算", "利得稅計算機", "香港利得稅", "兩級制利得稅", "利得稅稅率", "公司稅 香港"],
  alternates: localeAlternates("profitsTax", path),
  openGraph: {
    title: "香港利得稅計算機｜兩級制稅率即時計算",
    description: "按兩級制稅率計算法團及非法團業務的利得稅，並顯示實際稅率。免費使用。",
    url: `${site.url}${path}`,
    type: "website",
    locale: "zh_HK",
    images: ogImage("香港利得稅計算機", "免費工具"),
  },
};

const labels: ProfitsTaxLabels = {
  profits: "應評稅利潤（港幣）",
  entity: "業務類型",
  corporation: "法團（有限公司）",
  unincorporated: "非法團業務（獨資／合夥）",
  twoTier: "使用兩級制利得稅率",
  twoTierHint: "如屬有關連實體，而你計算的並非獲選定使用兩級制稅率的實體，請取消勾選。",
  reduction: "一次性稅務寬減上限（港幣，可選填）",
  reductionHint: "只在《財政預算案》為你計算的課稅年度公布寬減時填寫。",
  breakdown: "計算結果",
  firstTier: "首 HK$200 萬利潤",
  remainder: "其餘利潤",
  standardAll: "全部利潤按標準稅率",
  taxBefore: "寬減前稅款",
  reductionApplied: "減：一次性寬減",
  payable: "應繳利得稅",
  effective: "實際稅率",
  empty: "輸入應評稅利潤後，這裡會顯示各級稅款、一次性寬減（如有）及實際稅率。",
  disclaimer: "按公布稅率計算，金額四捨五入至元。應評稅利潤、扣除項目及有關連實體身分等問題，請諮詢你的會計師。",
};

const faqs = [
  {
    q: "香港利得稅稅率是多少？",
    a: "在兩級制下，法團首 HK$200 萬應評稅利潤的稅率為 8.25%，其後的利潤為 16.5%；非法團業務（例如獨資或合夥業務）首 HK$200 萬的稅率為 7.5%，其後為 15%。",
  },
  {
    q: "是否每間公司都可以使用 8.25% 的較低稅率？",
    a: "不是。如果業務之間屬於有關連實體（例如受同一方控制的公司），只可以選定其中一個實體使用兩級制稅率，其餘實體須就全部利潤按標準稅率繳稅。計算非選定實體時，請取消勾選兩級制選項。",
  },
  {
    q: "甚麼是應評稅利潤？",
    a: "大致是業務在香港產生的利潤，扣除可扣除開支及承前虧損後的金額。香港採用地域來源原則徵稅，並非在香港產生或得自香港的利潤，一般無須繳納利得稅。",
  },
  {
    q: "一次性稅務寬減是甚麼？",
    a: "部分年度的《財政預算案》會就指定課稅年度寬減利得稅，每宗個案設有上限。請輸入你所計算年度的寬減上限；如該年度沒有寬減，留空即可。確實金額請以稅務局公布為準。",
  },
  {
    q: "這個計算機可以取代專業意見嗎？",
    a: "不可以。計算機只會按公布的稅率計算你輸入的金額。應評稅利潤、扣除項目、有關連實體身分及暫繳稅等，應交由你的會計師或稅務代表處理。",
  },
];

export default function ZhHkProfitsTaxPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "香港利得稅計算機",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      inLanguage: "zh-HK",
      url: `${site.url}${path}`,
      description: "按兩級制稅率計算香港法團及非法團業務利得稅的免費工具。",
      provider: { "@id": `${site.url}/#studio` },
      offers: { "@type": "Offer", price: "0", priceCurrency: "HKD" },
    },
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首頁", item: `${site.url}/zh-hk` },
        { "@type": "ListItem", position: 2, name: "利得稅計算機", item: `${site.url}${path}` },
      ],
    },
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ZhToolShell
        breadcrumb={{ home: { name: "首頁", href: "/zh-hk" }, current: "利得稅計算機" }}
        eyebrow="免費利得稅計算機"
        title={
          <>
            {cjkWords("香港利得稅，", "zh-HK")}
            <span className="text-gradient">{cjkWords("即時計算。", "zh-HK")}</span>
          </>
        }
        lead="輸入應評稅利潤，即可按兩級制稅率看到各級稅款、一次性寬減（如有）及實際稅率。"
        tool={<ProfitsTaxCalculator labels={labels} />}
        faqTitle="關於香港利得稅的常見問題。"
        faqs={faqs}
        funnel={{
          eyebrow: "需要度身訂造的系統？",
          body: "這個工具永久免費。如果你的公司需要網站、網店或內部系統，Kodinav 可以為你設計及開發。",
          label: "了解網站開發服務",
          href: "/zh-hk",
        }}
        related={{
          title: "延伸閱讀",
          links: [
            { label: "2026 香港網站設計收費指南", href: "/zh-hk/website-cost" },
            { label: "香港網頁設計及網站開發", href: "/zh-hk" },
            { label: "Hong Kong Profits Tax Calculator (English)", href: "/hong-kong-profits-tax-calculator" },
          ],
        }}
      />
    </>
  );
}
