"use client";

import { useState } from "react";

/**
 * Privacy policy generator — assembles a plain-language template from what
 * the business actually does. Client-side only. It is a starting template,
 * not legal advice, and the output says so too.
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

export function PrivacyPolicyGenerator() {
  const [business, setBusiness] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("IN");
  const [collect, setCollect] = useState<Set<string>>(new Set(["forms", "analytics"]));
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

  const sections: string[] = [];
  sections.push(
    `PRIVACY POLICY — ${name}\nLast updated: ${today}\n\nThis policy explains what personal information ${name} ("we", "us") collects through ${site}, why we collect it, and the choices you have. We collect only what we need to respond to you and to run our business, and we do not sell personal information.`
  );

  const collected: string[] = [];
  if (has("forms"))
    collected.push(
      "- Information you send us through forms: typically your name, contact details and the content of your message. We use it to reply to you and to provide what you asked for."
    );
  if (has("accounts"))
    collected.push(
      "- Account information: the details you provide when creating an account, used to operate that account and provide our services."
    );
  if (has("newsletter"))
    collected.push(
      "- Newsletter subscription: your email address, used only to send the newsletter you signed up for. Every email includes an unsubscribe link."
    );
  if (has("payments"))
    collected.push(
      "- Payment information: payments are processed by our payment provider; we do not store your card details on our servers. We keep records of transactions (amount, date, what was purchased) as required for accounting."
    );
  if (has("analytics"))
    collected.push(
      "- Usage data: we use analytics tools (such as Google Analytics) to understand how visitors use the site — pages visited, approximate location, device type. This data is aggregated and does not identify you personally to us."
    );
  if (has("ads"))
    collected.push(
      "- Advertising data: we use advertising pixels (such as the Meta Pixel or Google Ads tag) that set cookies to measure our ad campaigns and to show relevant ads. You can control ad personalisation in your Google and Meta account settings."
    );
  if (collected.length)
    sections.push(`WHAT WE COLLECT\n\n${collected.join("\n")}`);

  const third: string[] = [];
  if (has("analytics")) third.push("analytics providers (e.g. Google Analytics)");
  if (has("ads")) third.push("advertising platforms (e.g. Meta, Google)");
  if (has("payments")) third.push("payment processors");
  third.push("our website hosting provider");
  sections.push(
    `WHO WE SHARE DATA WITH\n\nWe share data only with service providers needed to run the website and our business: ${third.join(", ")}. Each processes data under its own privacy policy and our instructions. We do not sell personal information to anyone.`
  );

  if (has("analytics") || has("ads"))
    sections.push(
      `COOKIES\n\nThe site uses cookies${has("ads") ? " for analytics and advertising measurement" : " for analytics"}. You can block or delete cookies in your browser settings; the site keeps working without them.`
    );

  sections.push(
    `HOW LONG WE KEEP DATA\n\nWe keep enquiries and correspondence for as long as needed to serve you and for our legitimate business records, then delete them. You can ask us to delete your information at any time (see below).`
  );

  sections.push(
    `YOUR RIGHTS\n\nSubject to ${LAWS[country]}, you can ask us: what information we hold about you, to correct it, or to delete it. Write to ${mail} and we will respond within a reasonable time. If you believe we have mishandled your data, you also have the right to complain to your local data protection authority.`
  );

  sections.push(
    `CHANGES & CONTACT\n\nIf this policy changes, the new version will be posted on this page with an updated date. Questions about privacy: ${mail}.`
  );

  const policy = sections.join("\n\n");
  const filled = Boolean(business.trim() && email.trim());

  const copy = async () => {
    await navigator.clipboard.writeText(policy);
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
        <div>
          <label htmlFor="pp-site" className={labelCls}>Website</label>
          <input id="pp-site" className={inputCls} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="sunrisedental.com" />
        </div>
        <div>
          <label htmlFor="pp-mail" className={labelCls}>Privacy contact email *</label>
          <input id="pp-mail" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@sunrisedental.com" />
        </div>
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
        <p className="annotation mb-4">Your policy draft</p>
        {filled ? (
          <>
            <pre className="max-h-100 overflow-auto border border-line p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
              {policy}
            </pre>
            <button
              type="button"
              onClick={copy}
              className="mt-4 inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5"
            >
              {copied ? "Copied ✓" : "Copy policy"}
            </button>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              This is a template, not legal advice. It covers the common
              cases honestly, but if you handle sensitive data or operate in a
              regulated industry, have a lawyer review it. Generated in your
              browser; nothing you type is stored.
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Fill in your business name and contact email and a complete,
            plain-language policy draft appears here — built from what your
            website actually does rather than fifty paragraphs of borrowed
            boilerplate.
          </p>
        )}
      </div>
    </div>
  );
}
