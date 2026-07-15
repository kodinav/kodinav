import type { Metadata } from "next";
import { SslChecker } from "@/components/SslChecker";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "SSL Certificate Checker — Expiry Date & Trust Test",
  description:
    "Check any SSL certificate free: expiry, issuer, chain trust — and download a calendar reminder so renewal never catches you out. Instant, no signup.",
  keywords: [
    "ssl checker",
    "ssl certificate checker",
    "check ssl expiry",
    "ssl certificate expiry date",
    "https checker",
    "certificate chain check",
  ],
  alternates: { canonical: "/ssl-checker" },
  openGraph: {
    title: "SSL Certificate Checker — Expiry Date & Trust Test",
    description:
      "Expiry date, days remaining, issuer, chain trust — checked live. Free.",
    url: `${site.url}/ssl-checker`,
    type: "website",
    images: ogImage("Is your padlock about to expire?", "Free SSL Checker"),
  },
};

const faqs = [
  {
    q: "What happens when an SSL certificate expires?",
    a: "Browsers replace your website with a full-screen security warning that most visitors will not click through. Practically, an expired certificate takes your site down — and it happens silently on a schedule, which is why checking the expiry date matters.",
  },
  {
    q: "What does \"not trusted\" mean if the certificate exists?",
    a: "The certificate was presented but browsers cannot verify it — typically a self-signed certificate, a certificate for a different domain name, or a missing intermediate certificate in the chain. Visitors see the same scary warning as an expired one.",
  },
  {
    q: "Why does my certificate expire every 90 days?",
    a: "Providers like Let's Encrypt issue short-lived certificates by design and expect automated renewal. Ninety-day expiry with working automation is healthier than a one-year certificate renewed by a human who might forget.",
  },
  {
    q: "Does SSL affect Google rankings?",
    a: "HTTPS has been a lightweight ranking signal since 2014, and Chrome labels plain-http pages \"Not secure\" — which costs trust with visitors regardless of rankings. There is no good reason for a business site to be on http in 2026.",
  },
  {
    q: "Is this check read-only?",
    a: "Yes — it opens one TLS connection to port 443, reads the certificate the server presents (exactly what every browser does) and disconnects. Nothing is changed or stored.",
  },
];

export default function SslCheckerPage() {
  const schemas = [
    toolSchema("SSL Certificate Checker", "/ssl-checker", "Free SSL checker: expiry date, days remaining, issuer and browser trust for any domain."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "SSL Checker", path: "/ssl-checker" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb="/ssl-checker"
        eyebrow="Free SSL Checker"
        title={
          <>
            Is your padlock about to <span className="text-gradient">expire</span>?
          </>
        }
        lead="Expiry date, days remaining, issuer, and whether browsers actually trust the chain — checked live against your server."
        tool={<SslChecker />}
        faqs={faqs}
      />
    </>
  );
}
