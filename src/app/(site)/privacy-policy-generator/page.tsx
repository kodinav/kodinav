import type { Metadata } from "next";
import { PrivacyPolicyGenerator } from "@/components/PrivacyPolicyGenerator";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Privacy Policy Generator — + Terms, Refund & Cookies",
  description:
    "Generate all four legal pages in one minute: privacy policy, terms of service, refund policy and cookie policy — plain language, free, no signup.",
  keywords: [
    "privacy policy generator",
    "free privacy policy generator",
    "privacy policy for website",
    "privacy policy template",
    "GDPR privacy policy generator",
    "website legal pages",
  ],
  alternates: { canonical: "/privacy-policy-generator" },
  openGraph: {
    title: "Free Privacy Policy Generator for Websites",
    description:
      "A plain-language privacy policy built from what your website actually does. Free, no signup, nothing stored.",
    url: `${site.url}/privacy-policy-generator`,
    type: "website",
    images: ogImage("A privacy policy in plain language", "Free Generator"),
  },
};

const faqs = [
  {
    q: "Do I really need a privacy policy?",
    a: "If your website has a contact form, analytics, an ad pixel or payments — yes. Privacy laws in most jurisdictions require disclosure, and the practical enforcers are even stricter: Google Ads and Meta both require a privacy policy on landing pages, and payment providers require one before issuing payment links.",
  },
  {
    q: "Is this legal advice?",
    a: "No. It is an honest, plain-language template that covers the common cases correctly — forms, analytics, pixels, payments, newsletters. For sensitive data (health, finance, children) or regulated industries, have a lawyer review the result. The generator gives you a strong starting point instead of a blank page.",
  },
  {
    q: "Which laws does the template reference?",
    a: "It adapts the rights section to where your business is based: India's DPDP Act 2023, the UAE's Personal Data Protection Law, US state laws like the CCPA/CPRA, or the GDPR for EU businesses. The obligations described — disclose, respond, delete on request — are the common core of all of them.",
  },
  {
    q: "Where do I put the policy?",
    a: "Create a /privacy-policy page and link it from your footer on every page — that placement is what ad platforms and app stores check for. Keep the 'last updated' date current when your practices change.",
  },
  {
    q: "What happens to what I type here?",
    a: "Nothing — the policy is assembled entirely in your browser. Fitting, for a privacy tool.",
  },
];

export default function PrivacyPolicyGeneratorPage() {
  const schemas = [
    toolSchema("Privacy Policy Generator", "/privacy-policy-generator", "Free plain-language privacy policy template generator for business websites."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Privacy Policy Generator", path: "/privacy-policy-generator" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        eyebrow="Free Policy Generator"
        title={
          <>
            A privacy policy in <span className="text-gradient">plain language</span>.
          </>
        }
        lead="Answer what your website actually does and get all four documents — privacy policy, terms of service, refund policy and cookie policy — drafted in language a human can read. The full set other platforms charge a subscription for."
        wide
        tool={<PrivacyPolicyGenerator />}
        faqs={faqs}
      />
    </>
  );
}
