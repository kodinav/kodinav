import type { Metadata } from "next";
import { SignatureGenerator } from "@/components/SignatureGenerator";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Email Signature Generator — Gmail & Outlook",
  description:
    "Create a clean, professional email signature that renders correctly in Gmail and Outlook. Copy and paste in one click — free, no signup.",
  keywords: [
    "email signature generator",
    "free email signature generator",
    "gmail signature generator",
    "outlook signature generator",
    "professional email signature",
    "html email signature",
  ],
  alternates: { canonical: "/email-signature-generator" },
  openGraph: {
    title: "Free Email Signature Generator — Gmail & Outlook",
    description:
      "A clean signature that renders correctly everywhere. Copy, paste into Gmail or Outlook, done. Free.",
    url: `${site.url}/email-signature-generator`,
    type: "website",
    images: ogImage("Sign every email like a business", "Free Signature Maker"),
  },
};

const faqs = [
  {
    q: "How do I add the signature to Gmail?",
    a: "Press 'Copy signature', then in Gmail: Settings (gear) → See all settings → Signature → Create new → paste → Save. It arrives formatted — no code involved.",
  },
  {
    q: "And Outlook?",
    a: "Copy the signature, then in Outlook: Settings → Mail → Compose and reply → paste into the signature box → Save. Desktop Outlook: File → Options → Mail → Signatures.",
  },
  {
    q: "Why is the generated signature so plain?",
    a: "Deliberately. Email clients disagree about almost everything — images get blocked, fancy CSS gets stripped, columns collapse. A table-based signature with text, one accent colour and working links renders identically everywhere, which is what actually looks professional in an inbox.",
  },
  {
    q: "Should I put my logo in the signature?",
    a: "Image files in signatures frequently show as broken icons or paperclip attachments, and many clients block remote images by default. Text-first is the reliable choice; if you want a logo, host it at a public URL and expect mixed results.",
  },
  {
    q: "Is anything I type stored?",
    a: "No. The signature is built in your browser; your details are never sent to this server.",
  },
];

export default function EmailSignatureGeneratorPage() {
  const schemas = [
    toolSchema("Email Signature Generator", "/email-signature-generator", "Free email signature generator producing table-based HTML that renders correctly in Gmail and Outlook."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Email Signature Generator", path: "/email-signature-generator" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        eyebrow="Free Signature Generator"
        title={
          <>
            Sign every email like a <span className="text-gradient">business</span>.
          </>
        }
        lead="A clean, professional signature that renders correctly in Gmail, Outlook and everything else — because it is built the boring way that works."
        wide
        tool={<SignatureGenerator />}
        faqs={faqs}
      />
    </>
  );
}
