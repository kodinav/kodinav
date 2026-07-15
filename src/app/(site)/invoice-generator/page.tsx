import type { Metadata } from "next";
import { InvoiceGenerator } from "@/components/InvoiceGenerator";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Invoice Generator — GST & VAT Ready, Print to PDF",
  description:
    "Professional invoices in your browser: logo, GST/VAT, discounts, amount in words, a scannable UPI payment QR, and details that save on your device. Free.",
  keywords: [
    "invoice generator",
    "free invoice generator",
    "gst invoice generator",
    "vat invoice generator",
    "invoice maker online free",
    "invoice template",
  ],
  alternates: { canonical: "/invoice-generator" },
  openGraph: {
    title: "Free Invoice Generator — GST & VAT Ready, Print to PDF",
    description:
      "Line items, GST/VAT, any currency, save as PDF. Free, no signup, and your invoice data never leaves your device.",
    url: `${site.url}/invoice-generator`,
    type: "website",
    images: ogImage("A clean invoice in two minutes", "Free Invoice Generator"),
  },
};

const faqs = [
  {
    q: "Is this really free, and where does my invoice data go?",
    a: "Free, no account, no watermark — and the data goes nowhere. The invoice is assembled and printed entirely in your browser; client names and amounts are never sent to this server or stored. Refresh the page and it is gone, so save your PDF.",
  },
  {
    q: "How do I save it as a PDF?",
    a: "Press 'Print / save as PDF' — a clean print view opens, and in the print dialog choose 'Save as PDF' as the destination. Every operating system has this built in.",
  },
  {
    q: "Does it handle GST and VAT?",
    a: "Yes — set the tax label and rate (GST 18%, VAT 5%, or anything else) and the invoice shows the tax line and total. Put your GSTIN or TRN in your business details block. For the formal requirements of a full GST tax invoice — HSN codes, place of supply — follow your CA's format.",
  },
  {
    q: "What must an invoice include?",
    a: "The reliable core: who issued it, who it bills, a unique number, a date, what was supplied with amounts, tax if applicable, the total, and how to pay. The notes field covers payment details and terms like 'due within 14 days'.",
  },
  {
    q: "I invoice every week. Is a generator enough?",
    a: "For occasional invoicing, absolutely. When you need numbering that increments itself, payment tracking, reminders and GST reports, that is billing software — the kind of custom system this studio builds when off-the-shelf tools stop fitting.",
  },
];

export default function InvoiceGeneratorPage() {
  const schemas = [
    toolSchema("Invoice Generator", "/invoice-generator", "Free in-browser invoice generator with GST/VAT support, any currency, and print-to-PDF output."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Invoice Generator", path: "/invoice-generator" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb="/invoice-generator"
        eyebrow="Free Invoice Generator"
        title={
          <>
            A clean invoice in <span className="text-gradient">two minutes</span>.
          </>
        }
        lead="Logo, GST or VAT, discounts, the amount in words, and a scannable UPI payment QR printed on the invoice. Your details save on your own device and the invoice number increments itself — no account, no watermark."
        wide
        tool={<InvoiceGenerator />}
        faqs={faqs}
      />
    </>
  );
}
