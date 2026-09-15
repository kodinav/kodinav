import type { Metadata } from "next";
import { TaxCalculator } from "@/components/TaxCalculator";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "UAE VAT Calculator — Add or Remove 5% VAT",
  description:
    "Free UAE VAT calculator: add 5% VAT to a price or split it out of a VAT-inclusive amount, with the exact AED breakdown. Instant, no signup.",
  keywords: [
    "vat calculator uae",
    "uae vat calculator",
    "5% vat calculator",
    "add vat calculator",
    "remove vat calculator",
    "vat calculator dubai",
  ],
  alternates: { canonical: "/vat-calculator-uae" },
  openGraph: {
    title: "UAE VAT Calculator — Add or Remove 5% VAT",
    description:
      "Add 5% VAT or split it out of an inclusive price — exact AED breakdown, instantly. Free.",
    url: `${site.url}/vat-calculator-uae`,
    type: "website",
    images: ogImage("UAE VAT, calculated instantly", "Free VAT Calculator"),
  },
};

const faqs = [
  {
    q: "What is the VAT rate in the UAE?",
    a: "The standard rate is 5%, in force since January 2018. Certain supplies are zero-rated (such as most exports and international transport) or exempt (such as some financial services and residential leases) — this calculator handles the arithmetic; which category applies to your goods is a question for your accountant or the FTA.",
  },
  {
    q: "When does a UAE business have to register for VAT?",
    a: "Registration is mandatory when taxable supplies and imports exceed AED 375,000 per year, and voluntary from AED 187,500. Registered businesses must charge VAT, file returns and can reclaim input VAT.",
  },
  {
    q: "How do I remove VAT from a VAT-inclusive price?",
    a: "Divide by 1.05 — not subtract 5%. An AED 105 inclusive price is AED 100 net + AED 5 VAT. Subtracting 5% of 105 (5.25) gives the wrong answer; the 'remove' mode here does the correct division.",
  },
  {
    q: "Do prices in the UAE have to be shown including VAT?",
    a: "Consumer-facing advertised prices must generally be VAT-inclusive under FTA rules, with limited exceptions. B2B quotes commonly state net + VAT — say clearly which yours is.",
  },
];

export default function VatCalculatorUaePage() {
  const schemas = [
    toolSchema("UAE VAT Calculator", "/vat-calculator-uae", "Free UAE VAT calculator: add 5% VAT or extract it from an inclusive AED amount."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "UAE VAT Calculator", path: "/vat-calculator-uae" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb="/vat-calculator-uae"
        eyebrow="Free VAT Calculator"
        title={
          <>
            UAE VAT, calculated <span className="text-gradient">instantly</span>.
          </>
        }
        lead="Add 5% VAT to a net price, or split the VAT out of an inclusive one — the arithmetic UAE invoices and quotes need, done right."
        wide
        tool={<TaxCalculator taxName="VAT" currency="AED" rates={[5]} defaultRate={5} />}
        faqs={faqs}
        faqTitle="Fair questions about UAE VAT."
      />
    </>
  );
}
