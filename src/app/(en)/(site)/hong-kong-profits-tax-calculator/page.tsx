import type { Metadata } from "next";
import { ProfitsTaxCalculator } from "@/components/ProfitsTaxCalculator";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

const path = "/hong-kong-profits-tax-calculator";

export const metadata: Metadata = {
  title: "Hong Kong Profits Tax Calculator (Two-Tier Rates)",
  description:
    "Free Hong Kong profits tax calculator using the two-tiered rates: 8.25% / 16.5% for corporations, 7.5% / 15% for unincorporated businesses, plus effective rate.",
  keywords: [
    "hong kong profits tax calculator",
    "profits tax calculator hk",
    "two-tiered profits tax rates hong kong",
    "hk corporate tax calculator",
    "hong kong company tax rate",
    "利得稅計算機",
  ],
  alternates: localeAlternates("profitsTax", path),
  openGraph: {
    title: "Hong Kong Profits Tax Calculator (Two-Tier Rates)",
    description: "Two-tiered profits tax for corporations and unincorporated businesses, with your effective rate. Free.",
    url: `${site.url}${path}`,
    type: "website",
    images: ogImage("Hong Kong profits tax, calculated", "Free Tax Calculator"),
  },
};

const faqs = [
  {
    q: "What are Hong Kong's profits tax rates?",
    a: "Under the two-tiered system, corporations pay 8.25% on the first HK$2 million of assessable profits and 16.5% on the rest. Unincorporated businesses, such as sole proprietorships and partnerships, pay 7.5% on the first HK$2 million and 15% on the rest.",
  },
  {
    q: "Can every company use the lower 8.25% rate?",
    a: "No. Where businesses are connected entities, such as companies under common control, only one of them can be nominated to use the two-tiered rates; the others pay the standard rate on all their profits. Untick the two-tier option to calculate a non-nominated entity.",
  },
  {
    q: "What are assessable profits?",
    a: "Broadly, your business's Hong Kong-sourced profits after allowable deductions and any losses brought forward. Hong Kong taxes on a territorial basis, so profits that do not arise in or derive from Hong Kong are generally not chargeable to profits tax.",
  },
  {
    q: "What is the one-off tax reduction?",
    a: "In some years the Budget reduces final profits tax for a particular year of assessment, up to a cap per case. Enter the cap for the year you are calculating to see the reduced amount, or leave it blank if none applies. Check the Inland Revenue Department's announcement for the exact figure.",
  },
  {
    q: "Is this a substitute for professional advice?",
    a: "No. It applies the published rates to the figure you enter. Working out assessable profits, deductions, connected-entity status and provisional tax is a job for your accountant or tax representative.",
  },
];

export default function HongKongProfitsTaxPage() {
  const schemas = [
    toolSchema(
      "Hong Kong Profits Tax Calculator",
      path,
      "Free Hong Kong profits tax calculator using the two-tiered rates for corporations and unincorporated businesses."
    ),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Hong Kong Profits Tax Calculator", path },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb={path}
        eyebrow="Free Profits Tax Calculator"
        title={
          <>
            Hong Kong profits tax, <span className="text-gradient">calculated</span>.
          </>
        }
        lead="Enter your assessable profits and see the tax at each tier of the two-tiered system, any one-off reduction, and your effective rate."
        wide
        tool={<ProfitsTaxCalculator />}
        faqs={faqs}
        faqTitle="Fair questions about Hong Kong profits tax."
      />
    </>
  );
}
