import type { Metadata } from "next";
import { TaxCalculator } from "@/components/TaxCalculator";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

const path = "/taiwan-business-tax-calculator";

export const metadata: Metadata = {
  title: "Taiwan Business Tax Calculator — 5% in NT$",
  description:
    "Free Taiwan business tax calculator: add 5% to a net price or split the tax out of an inclusive NT$ amount, rounded to whole dollars like a uniform invoice.",
  keywords: [
    "taiwan vat calculator",
    "taiwan business tax calculator",
    "5% tax calculator taiwan",
    "taiwan sales tax calculator",
    "營業稅計算",
    "含稅計算",
  ],
  alternates: localeAlternates("businessTax", path),
  openGraph: {
    title: "Taiwan Business Tax Calculator — Add or Remove 5%",
    description: "Add or remove Taiwan's 5% business tax, rounded to whole NT dollars. Free.",
    url: `${site.url}${path}`,
    type: "website",
    images: ogImage("Taiwan business tax, calculated", "Free Tax Calculator"),
  },
};

const faqs = [
  {
    q: "What is the business tax rate in Taiwan?",
    a: "Most businesses charge value-added business tax at 5%. Small-scale businesses that are exempt from issuing uniform invoices are instead taxed at 1% on sales assessed by the tax authority, and some special industries have other rates. This calculator does the arithmetic; which rate applies to you is a question for your accountant.",
  },
  {
    q: "How do I remove 5% tax from a tax-inclusive price in Taiwan?",
    a: "Divide the inclusive amount by 1.05 and round to the nearest dollar to get the net sales amount; the tax is the inclusive amount minus that net. For NT$1,050 inclusive, the net is NT$1,000 and the tax is NT$50. Taking 5% of the inclusive price gives the wrong answer.",
  },
  {
    q: "Why are the results in whole NT dollars?",
    a: "Uniform invoices in Taiwan are issued in whole dollars, with tax rounded to the nearest dollar. The calculator rounds the same way, so the net amount plus the tax always equals the total exactly.",
  },
  {
    q: "Do Taiwanese invoices show the tax separately?",
    a: "Invoices issued to businesses that provide a company tax ID show the sales amount and the tax separately. Invoices issued to consumers generally show a single tax-inclusive total.",
  },
  {
    q: "How often is business tax filed?",
    a: "Businesses that issue uniform invoices generally file and pay every two months, by the 15th of the month after each two-month period.",
  },
];

export default function TaiwanBusinessTaxPage() {
  const schemas = [
    toolSchema(
      "Taiwan Business Tax Calculator",
      path,
      "Free Taiwan business tax calculator: add 5% tax or extract it from an inclusive NT$ amount, in whole dollars."
    ),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Taiwan Business Tax Calculator", path },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb={path}
        eyebrow="Free Business Tax Calculator"
        title={
          <>
            Taiwan business tax, <span className="text-gradient">instantly</span>.
          </>
        }
        lead="Add 5% business tax to a net price, or split the tax out of an inclusive one, rounded to whole NT dollars the way a uniform invoice is."
        wide
        tool={
          <TaxCalculator taxName="business tax" currency="NT$" rates={[5, 1]} defaultRate={5} wholeUnits />
        }
        faqs={faqs}
        faqTitle="Fair questions about Taiwan business tax."
      />
    </>
  );
}
