import type { Metadata } from "next";
import { SchemaGenerator } from "@/components/SchemaGenerator";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Schema Markup Generator — Free JSON-LD Builder",
  description:
    "Generate LocalBusiness, FAQ, Service and Organization schema markup from a simple form. Free JSON-LD generator — copy, paste, validate. No signup.",
  keywords: [
    "schema markup generator",
    "json-ld generator",
    "local business schema generator",
    "faq schema generator",
    "structured data generator",
    "schema.org generator",
  ],
  alternates: { canonical: "/schema-markup-generator" },
  openGraph: {
    title: "Schema Markup Generator — Free JSON-LD Builder",
    description:
      "LocalBusiness, FAQ, Service and Organization JSON-LD from a simple form. Copy, paste, validate — free.",
    url: `${site.url}/schema-markup-generator`,
    type: "website",
    images: ogImage("Schema markup, without the syntax", "Free Generator"),
  },
};

const faqs = [
  {
    q: "What is schema markup and why does it matter?",
    a: "Schema markup (JSON-LD) is a machine-readable description of your business embedded in the page. Google reads it to understand what you are — a clinic, a shop, a service — and uses it to power rich results: star ratings, FAQ dropdowns, business panels. Pages with correct markup are eligible for those; pages without are not.",
  },
  {
    q: "Where do I paste the generated code?",
    a: "Anywhere inside your page's <head> (or before </body>). On WordPress, a header-scripts plugin or your theme's custom-code box works. It is invisible to visitors — only crawlers read it.",
  },
  {
    q: "Which schema type should I pick?",
    a: "A business customers visit or call locally — clinic, salon, institute, restaurant — is LocalBusiness. A company without a walk-in premise is Organization. Use Service for a page describing one specific offering, and FAQPage for any page with a question-and-answer section.",
  },
  {
    q: "Will schema markup improve my rankings?",
    a: "Not directly — Google says it is not a ranking factor. What it changes is how your result looks (rich results earn more clicks) and how confidently Google understands your business, which matters for local and entity search. It is cheap, standards-based and worth doing on every serious website.",
  },
  {
    q: "How do I check it works?",
    a: "Paste your page URL or the code itself into validator.schema.org or Google's Rich Results Test. The generator here emits only valid, minimal JSON-LD — empty fields are omitted rather than shipped as blank noise.",
  },
];

export default function SchemaMarkupGeneratorPage() {
  const schemas = [
    toolSchema("Schema Markup Generator", "/schema-markup-generator", "Free JSON-LD generator for LocalBusiness, Organization, Service and FAQPage schema markup."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Schema Markup Generator", path: "/schema-markup-generator" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        eyebrow="Free Schema Generator"
        title={
          <>
            Schema markup, without the <span className="text-gradient">syntax</span>.
          </>
        }
        lead="Tell the form what your business is; get valid JSON-LD to paste into your site. The vocabulary Google reads, written for you."
        wide
        tool={<SchemaGenerator />}
        faqs={faqs}
      />
    </>
  );
}
