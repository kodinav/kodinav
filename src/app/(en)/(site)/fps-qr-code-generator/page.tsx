import type { Metadata } from "next";
import { FpsQrGenerator } from "@/components/FpsQrGenerator";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";
import { SPEC_ROWS } from "./spec";

const path = "/fps-qr-code-generator";

export const metadata: Metadata = {
  title: "FPS QR Code Generator — Hong Kong 轉數快",
  description:
    "Free FPS (轉數快) QR code generator: turn your FPS ID, mobile or email into a payment QR, with or without a fixed amount. Runs entirely in your browser.",
  keywords: [
    "fps qr code generator",
    "轉數快 qr code",
    "轉數快 qr code 生成",
    "fps qr code hong kong",
    "fps qr code format",
    "fps qr code specification",
    "hong kong payment qr code",
    "hkicl qr code",
  ],
  alternates: localeAlternates("fpsQr", path),
  openGraph: {
    title: "FPS QR Code Generator — Hong Kong 轉數快",
    description:
      "Turn your FPS ID, mobile or email into a payment QR code. Free, and generated in your browser.",
    url: `${site.url}${path}`,
    type: "website",
    locale: "en_HK",
    images: ogImage("FPS QR code generator", "Free Hong Kong Tool"),
  },
};

const faqs = [
  {
    q: "What is an FPS QR code?",
    a: "It is a payment QR code for Hong Kong's Faster Payment System. A customer opens their banking app, scans it, and the payee details — and the amount, if you set one — are filled in for them. The format is the HKMA and HKICL Common QR Code Specification, which is EMVCo's merchant-presented QR with a Hong Kong payee template.",
  },
  {
    q: "How does a customer pay with it?",
    a: "They open their bank's mobile app, choose its scan or FPS QR option, and point the camera at the code. Most Hong Kong banking apps support scanning FPS QR codes. Print it for a counter, put it on an invoice, or send it as an image.",
  },
  {
    q: "Should I set an amount or leave it blank?",
    a: "Leave it blank for a reusable code — the payer types the amount, which suits a shop counter or a tip jar. Set an amount for a specific invoice, and the payer sees the figure already filled in. The code records which of the two it is (11 for any amount, 12 for a fixed amount).",
  },
  {
    q: "Does the code expire?",
    a: "No. The payload has no expiry, so a printed code keeps working until your FPS registration changes. If you deregister an FPS ID, mobile or email from your bank, codes carrying it stop working.",
  },
  {
    q: "Is it safe to print and display?",
    a: "The code contains only what a payer needs to send you money: your FPS identifier, the currency, an optional amount, a display name and an optional invoice number. It carries no password, no login and no bank account number, and nothing here is uploaded — the code is built in your browser.",
  },
  {
    q: "Do I need a business account or business registration?",
    a: "Any FPS identifier registered with your bank works, personal or business. Whether your particular business needs a business account, a business registration or a merchant agreement is a question for your bank and the Inland Revenue Department, not for this tool.",
  },
  {
    q: "Are there fees?",
    a: "FPS transfers are generally free for personal customers, though banks set their own terms and business accounts can differ. Check your own bank's charges before you rely on it for takings.",
  },
  {
    q: "Is this an official HKICL or bank tool?",
    a: "No. It is a free tool built by Kodinav from the published specification, with no affiliation to HKICL, the HKMA or any bank. Scan your own code with your banking app and confirm the payee details before you give it to a customer.",
  },
];

export default function FpsQrPage() {
  const schemas = [
    toolSchema(
      "FPS QR Code Generator",
      path,
      "Free Hong Kong FPS (轉數快) payment QR code generator for an FPS ID, mobile number or email."
    ),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "FPS QR Code Generator", path },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        crumb={path}
        eyebrow="Free FPS QR Generator"
        title={
          <>
            Your FPS payment QR, <span className="text-gradient">in seconds</span>.
          </>
        }
        lead="Turn your FPS ID, mobile number or email into a 轉數快 payment QR code customers can scan in their banking app. Set an amount or leave it open. Nothing is uploaded."
        wide
        tool={<FpsQrGenerator />}
        middle={
          <section className="border-t border-line-strong">
            <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
              <h2 className="text-2xl sm:text-3xl">What the code contains</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                The payload follows the HKMA / HKICL Common QR Code Specification for Retail Payments in Hong Kong —
                EMVCo merchant-presented QR with the Hong Kong payee template. Every field below is written by this
                generator; the checksum is CRC-16/CCITT-FALSE over the whole payload.
              </p>
              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line-strong">
                      <th className="annotation py-3 pr-4 font-normal">ID</th>
                      <th className="annotation py-3 pr-4 font-normal">Field</th>
                      <th className="annotation py-3 font-normal">Value written</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPEC_ROWS.map((row) => (
                      <tr key={row.id} className="border-b border-line">
                        <th scope="row" className="py-3 pr-4 font-mono text-xs font-normal text-foreground">
                          {row.id}
                        </th>
                        <td className="py-3 pr-4 text-foreground">{row.field}</td>
                        <td className="py-3 text-muted">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        }
        faqs={faqs}
        faqTitle="Fair questions about FPS QR codes."
      />
    </>
  );
}
