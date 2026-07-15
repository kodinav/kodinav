"use client";

import { useState } from "react";

/**
 * Legal pages suite v2 — privacy policy, terms of service, refund policy
 * and cookie policy from one form. The multi-document coverage services
 * like Termly paywall, generated entirely in the visitor's browser.
 * Templates, not legal advice — and the output says so.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";

const COLLECT = [
  { id: "forms", label: "Contact / enquiry forms" },
  { id: "analytics", label: "Analytics (Google Analytics or similar)" },
  { id: "ads", label: "Ad pixels (Meta, Google Ads)" },
  { id: "payments", label: "Online payments" },
  { id: "newsletter", label: "Email newsletter" },
  { id: "accounts", label: "Customer accounts" },
] as const;

const LAWS: Record<string, string> = {
  IN: "the Digital Personal Data Protection Act, 2023 (India)",
  AE: "UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data",
  US: "applicable U.S. state privacy laws (such as the CCPA/CPRA for California residents)",
  EU: "the EU General Data Protection Regulation (GDPR)",
  OTHER: "the data protection laws applicable in our jurisdiction",
};
const LAW_NAMES: Record<string, string> = {
  IN: "India",
  AE: "the United Arab Emirates",
  US: "the United States",
  EU: "the business's home jurisdiction in the EU",
  OTHER: "the business's home jurisdiction",
};

type Doc = "privacy" | "terms" | "refund" | "cookies";
const DOCS: { id: Doc; label: string }[] = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Service" },
  { id: "refund", label: "Refund Policy" },
  { id: "cookies", label: "Cookie Policy" },
];

export function PrivacyPolicyGenerator() {
  const [business, setBusiness] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("IN");
  const [collect, setCollect] = useState<Set<string>>(new Set(["forms", "analytics"]));
  const [sells, setSells] = useState<"services" | "goods" | "both">("services");
  const [refundDays, setRefundDays] = useState("7");
  const [doc, setDoc] = useState<Doc>("privacy");
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) =>
    setCollect((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const has = (id: string) => collect.has(id);
  const name = business.trim() || "[Business Name]";
  const site = website.trim() || "[yourwebsite.com]";
  const mail = email.trim() || "[contact email]";
  const today = new Date().toISOString().slice(0, 10);
  const days = Math.max(0, parseInt(refundDays, 10) || 0);

  /* ---------- Privacy ---------- */
  const privacySections: string[] = [
    `PRIVACY POLICY — ${name}\nLast updated: ${today}\n\nThis policy explains what personal information ${name} ("we", "us") collects through ${site}, why we collect it, and the choices you have. We collect only what we need to respond to you and to run our business, and we do not sell personal information.`,
  ];
  const collected: string[] = [];
  if (has("forms")) collected.push("- Information you send us through forms: typically your name, contact details and the content of your message. We use it to reply to you and to provide what you asked for.");
  if (has("accounts")) collected.push("- Account information: the details you provide when creating an account, used to operate that account and provide our services.");
  if (has("newsletter")) collected.push("- Newsletter subscription: your email address, used only to send the newsletter you signed up for. Every email includes an unsubscribe link.");
  if (has("payments")) collected.push("- Payment information: payments are processed by our payment provider; we do not store your card details on our servers. We keep records of transactions (amount, date, what was purchased) as required for accounting.");
  if (has("analytics")) collected.push("- Usage data: we use analytics tools (such as Google Analytics) to understand how visitors use the site — pages visited, approximate location, device type. This data is aggregated and does not identify you personally to us.");
  if (has("ads")) collected.push("- Advertising data: we use advertising pixels (such as the Meta Pixel or Google Ads tag) that set cookies to measure our ad campaigns and to show relevant ads. You can control ad personalisation in your Google and Meta account settings.");
  if (collected.length) privacySections.push(`WHAT WE COLLECT\n\n${collected.join("\n")}`);
  const third: string[] = [];
  if (has("analytics")) third.push("analytics providers (e.g. Google Analytics)");
  if (has("ads")) third.push("advertising platforms (e.g. Meta, Google)");
  if (has("payments")) third.push("payment processors");
  third.push("our website hosting provider");
  privacySections.push(`WHO WE SHARE DATA WITH\n\nWe share data only with service providers needed to run the website and our business: ${third.join(", ")}. Each processes data under its own privacy policy and our instructions. We do not sell personal information to anyone.`);
  privacySections.push(`HOW LONG WE KEEP DATA\n\nWe keep enquiries and correspondence for as long as needed to serve you and for our legitimate business records, then delete them. You can ask us to delete your information at any time (see below).`);
  privacySections.push(`YOUR RIGHTS\n\nSubject to ${LAWS[country]}, you can ask us: what information we hold about you, to correct it, or to delete it. Write to ${mail} and we will respond within a reasonable time. If you believe we have mishandled your data, you also have the right to complain to your local data protection authority.`);
  privacySections.push(`CHANGES & CONTACT\n\nIf this policy changes, the new version will be posted on this page with an updated date. Questions about privacy: ${mail}.`);

  /* ---------- Terms ---------- */
  const offering = sells === "both" ? "products and services" : sells === "goods" ? "products" : "services";
  const termsSections: string[] = [
    `TERMS OF SERVICE — ${name}\nLast updated: ${today}\n\nThese terms govern your use of ${site} and your purchase of ${offering} from ${name}. By using the website or placing an order, you accept them.`,
    `USING THE WEBSITE\n\nThe content of ${site} is provided in good faith and for general information. We work to keep it accurate and available, but we do not guarantee it is error-free or uninterrupted. You agree not to misuse the website, attempt to breach its security, or use it for unlawful purposes.`,
    `ORDERS & PAYMENT\n\nPrices are as stated at the time of ordering${has("payments") ? ", and payments are processed securely by our payment provider" : ""}. If we cannot fulfil an order we will tell you promptly and refund any payment taken for it. Obvious pricing errors may be corrected before fulfilment.`,
    `INTELLECTUAL PROPERTY\n\nThe content of ${site} — text, images, design and code — belongs to ${name} or its licensors. You may not copy or reuse it commercially without permission.`,
    `LIABILITY\n\nTo the maximum extent permitted by law, ${name} is not liable for indirect or consequential losses arising from use of this website. For paid ${offering}, our liability is limited to the amount you paid. Nothing in these terms limits liability that cannot lawfully be limited.`,
    `GOVERNING LAW & CONTACT\n\nThese terms are governed by the laws of ${LAW_NAMES[country]}. If they change, the new version will be posted here with an updated date. Questions: ${mail}. See also our Privacy Policy${days > 0 ? " and Refund Policy" : ""}.`,
  ];

  /* ---------- Refund ---------- */
  const refundSections: string[] = [
    `REFUND POLICY — ${name}\nLast updated: ${today}`,
    sells === "services"
      ? `REFUNDS ON SERVICES\n\nIf you cancel before work has started, you receive a full refund. Once work has begun, refunds are proportional to the work not yet delivered, as agreed in writing for your engagement. If we fail to deliver what was agreed, you are entitled to a refund for the undelivered part.`
      : `RETURNS & REFUNDS\n\nYou may request a return or refund within ${days} days of ${sells === "goods" ? "delivery" : "purchase"}. Items should be unused and in their original condition${sells === "both" ? "; for services, cancellation before work starts qualifies for a full refund" : ""}. Once we receive and check the return, the refund is issued to your original payment method within a reasonable time.`,
    `HOW TO REQUEST\n\nWrite to ${mail} with your order details and the reason. We respond to every refund request — including the ones we have to decline — with an explanation.`,
    `EXCEPTIONS\n\nWhere the law of ${LAW_NAMES[country]} gives you stronger rights than this policy, the law prevails.`,
  ];

  /* ---------- Cookies ---------- */
  const cookieList: string[] = [];
  if (has("analytics")) cookieList.push("- Analytics cookies (e.g. Google Analytics): help us understand how the site is used. Aggregated; they do not identify you to us.");
  if (has("ads")) cookieList.push("- Advertising cookies (e.g. Meta Pixel, Google Ads): measure our ad campaigns and may be used to show you relevant ads.");
  if (has("accounts")) cookieList.push("- Functional cookies: keep you signed in to your account.");
  const cookiesSections: string[] = [
    `COOKIE POLICY — ${name}\nLast updated: ${today}\n\nCookies are small files a website stores in your browser. This page lists the ones ${site} uses and why.`,
    cookieList.length
      ? `COOKIES WE USE\n\n${cookieList.join("\n")}`
      : `COOKIES WE USE\n\n${site} does not set cookies of its own beyond what is strictly necessary for the site to function.`,
    `YOUR CHOICES\n\nYou can block or delete cookies in your browser settings at any time; the website keeps working without them. ${has("ads") ? "You can also control ad personalisation in your Google and Meta account settings. " : ""}Questions: ${mail}.`,
  ];

  const docs: Record<Doc, string> = {
    privacy: privacySections.join("\n\n"),
    terms: termsSections.join("\n\n"),
    refund: refundSections.join("\n\n"),
    cookies: cookiesSections.join("\n\n"),
  };
  const output = docs[doc];
  const filled = Boolean(business.trim() && email.trim());

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="pp-name" className={labelCls}>Business name *</label>
          <input id="pp-name" className={inputCls} value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Sunrise Dental Clinic" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pp-site" className={labelCls}>Website</label>
            <input id="pp-site" className={inputCls} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="sunrisedental.com" />
          </div>
          <div>
            <label htmlFor="pp-mail" className={labelCls}>Contact email *</label>
            <input id="pp-mail" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@sunrisedental.com" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pp-country" className={labelCls}>Where is the business based?</label>
            <select id="pp-country" className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="IN">India</option>
              <option value="AE">UAE</option>
              <option value="US">United States</option>
              <option value="EU">European Union</option>
              <option value="OTHER">Elsewhere</option>
            </select>
          </div>
          <div>
            <label htmlFor="pp-sells" className={labelCls}>What do you sell?</label>
            <select id="pp-sells" className={inputCls} value={sells} onChange={(e) => setSells(e.target.value as typeof sells)}>
              <option value="services">Services</option>
              <option value="goods">Physical products</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
        {sells !== "services" && (
          <div>
            <label htmlFor="pp-days" className={labelCls}>Return window (days)</label>
            <input id="pp-days" inputMode="numeric" className={inputCls} value={refundDays} onChange={(e) => setRefundDays(e.target.value)} placeholder="7" />
          </div>
        )}
        <fieldset>
          <legend className={labelCls}>What does your website do?</legend>
          <div className="flex flex-col gap-2">
            {COLLECT.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={has(c.id)}
                onClick={() => toggle(c.id)}
                className={`border px-4 py-2.5 text-left font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  has(c.id)
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                <span aria-hidden className="mr-2 text-accent">{has(c.id) ? "■" : "□"}</span>
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="ink relative h-fit self-start p-7 sm:p-8">
        <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
        <div className="mb-4 flex flex-wrap gap-2">
          {DOCS.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={doc === d.id}
              onClick={() => setDoc(d.id)}
              className={`border px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] transition-colors ${
                doc === d.id ? "border-accent text-accent" : "border-line text-faint hover:border-foreground hover:text-foreground"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        {filled ? (
          <>
            <pre className="max-h-100 overflow-auto border border-line p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
              {output}
            </pre>
            <button
              type="button"
              onClick={copy}
              className="mt-4 inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5"
            >
              {copied ? "Copied ✓" : `Copy ${DOCS.find((d) => d.id === doc)!.label.toLowerCase()}`}
            </button>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              All four documents update together as you change the form.
              Templates, not legal advice — for sensitive data or regulated
              industries, have a lawyer review them. Generated in your
              browser; nothing you type is stored.
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Fill in your business name and contact email and all four
            documents — privacy policy, terms of service, refund policy and
            cookie policy — appear here, built from what your website actually
            does. The full legal-pages set other platforms charge a
            subscription for.
          </p>
        )}
      </div>
    </div>
  );
}
