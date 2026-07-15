import type { Metadata } from "next";
import { TaxCalculator } from "@/components/TaxCalculator";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "GST Calculator India — Add or Remove GST (5–28%)",
  description:
    "Free GST calculator for India: add GST to a price or split it out of a GST-inclusive amount, with the CGST/SGST breakdown. All slabs, instant.",
  keywords: [
    "gst calculator",
    "gst calculator india",
    "gst inclusive calculator",
    "remove gst calculator",
    "cgst sgst calculator",
    "18% gst calculator",
  ],
  alternates: { canonical: "/gst-calculator-india" },
  openGraph: {
    title: "GST Calculator India — Add or Remove GST (5–28%)",
    description:
      "All slabs, both directions, with the CGST/SGST split. Free and instant.",
    url: `${site.url}/gst-calculator-india`,
    type: "website",
    images: ogImage("GST, calculated instantly", "Free GST Calculator"),
  },
};

const faqs = [
  {
    q: "What are the GST slabs in India?",
    a: "The main rates are 5%, 12%, 18% and 28%, plus 0% for exempt items. Most services — including software and professional services — fall under 18%. Which slab applies to your specific goods or services is defined by the GST rate schedules; confirm with your CA.",
  },
  {
    q: "What is the CGST/SGST split shown here?",
    a: "For sales within a state, GST is collected as two equal halves: Central GST and State GST — an 18% invoice shows 9% + 9%. For inter-state sales the same total is charged as a single IGST instead. The split matters for how your invoice must be drawn up.",
  },
  {
    q: "How do I remove GST from an inclusive price?",
    a: "Divide by 1 + rate — an ₹1,180 inclusive price at 18% is ₹1,000 net + ₹180 GST. Subtracting 18% of the inclusive figure gives the wrong number; the 'remove' mode here divides correctly.",
  },
  {
    q: "When is GST registration required?",
    a: "Broadly: annual turnover above ₹40 lakh for goods (₹20 lakh in special-category states) or ₹20 lakh for services (₹10 lakh in special-category states), and always for inter-state supply and e-commerce sellers. Thresholds have exceptions — check with your CA.",
  },
];

export default function GstCalculatorIndiaPage() {
  const schemas = [
    toolSchema("GST Calculator India", "/gst-calculator-india", "Free Indian GST calculator: add or remove GST at any slab with the CGST/SGST breakdown."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "GST Calculator India", path: "/gst-calculator-india" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb="/gst-calculator-india"
        eyebrow="Free GST Calculator"
        title={
          <>
            GST, calculated <span className="text-gradient">instantly</span>.
          </>
        }
        lead="Add GST to a base price or split it out of an inclusive one — every slab, with the CGST/SGST breakdown your invoice needs."
        wide
        tool={<TaxCalculator taxName="GST" currency="₹" rates={[5, 12, 18, 28]} defaultRate={18} splitLabel="CGST + SGST" />}
        faqs={faqs}
        faqTitle="Fair questions about GST."
      />
    </>
  );
}
