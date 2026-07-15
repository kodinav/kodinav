"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * UTM campaign link builder — client-side, with plain-language hints for
 * people who are not marketers. Pairs with the QR generator's advice to
 * track scans via UTMs.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";

const SOURCES = ["google", "facebook", "instagram", "whatsapp", "linkedin", "newsletter", "qr-code", "youtube"];
const MEDIUMS = ["cpc", "social", "email", "qr", "referral", "sms"];

export function UtmBuilder() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  let link = "";
  let urlError = "";
  const trimmed = url.trim();
  if (trimmed) {
    try {
      const u = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
      const slug = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "_");
      if (source.trim()) u.searchParams.set("utm_source", slug(source));
      if (medium.trim()) u.searchParams.set("utm_medium", slug(medium));
      if (campaign.trim()) u.searchParams.set("utm_campaign", slug(campaign));
      if (content.trim()) u.searchParams.set("utm_content", slug(content));
      link = u.toString();
    } catch {
      urlError = "That does not look like a valid address.";
    }
  }
  const ready = Boolean(link && source.trim() && medium.trim() && campaign.trim());

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const chips = (opts: string[], value: string, set: (v: string) => void) => (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {opts.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => set(o)}
          className={`border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] transition-colors ${
            value === o ? "border-accent text-accent" : "border-line text-faint hover:border-foreground hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="utm-url" className={labelCls}>Landing page URL *</label>
          <input id="utm-url" className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourwebsite.com/offer" />
          {urlError && <p className="mt-2 text-xs text-muted">{urlError}</p>}
        </div>
        <div>
          <label htmlFor="utm-source" className={labelCls}>Source * — where the click comes from</label>
          <input id="utm-source" className={inputCls} value={source} onChange={(e) => setSource(e.target.value)} placeholder="google" />
          {chips(SOURCES, source, setSource)}
        </div>
        <div>
          <label htmlFor="utm-medium" className={labelCls}>Medium * — what kind of channel</label>
          <input id="utm-medium" className={inputCls} value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="cpc" />
          {chips(MEDIUMS, medium, setMedium)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="utm-campaign" className={labelCls}>Campaign * — which push</label>
            <input id="utm-campaign" className={inputCls} value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="diwali_offer" />
          </div>
          <div>
            <label htmlFor="utm-content" className={labelCls}>Content — which ad/button (optional)</label>
            <input id="utm-content" className={inputCls} value={content} onChange={(e) => setContent(e.target.value)} placeholder="blue_banner" />
          </div>
        </div>
      </div>

      <div className="ink relative h-fit self-start p-7 sm:p-8">
        <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
        <p className="annotation mb-4">Your campaign link</p>
        {ready ? (
          <>
            <p className="break-all border border-line px-4 py-3 font-mono text-xs leading-relaxed text-foreground/90">{link}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5"
              >
                {copied ? "Copied ✓" : "Copy link"}
              </button>
              <Link
                href="/qr-code-generator"
                className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs tracking-[0.18em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent"
              >
                Make it a QR code →
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Visits through this link show up in Google Analytics under
              Acquisition, labelled exactly as you tagged them — so you know
              which campaign actually brought the customer.
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Fill the URL, source, medium and campaign, and the tagged link
            appears here. Lower-case with underscores is applied automatically
            — analytics treats &ldquo;Facebook&rdquo; and
            &ldquo;facebook&rdquo; as different sources, which ruins reports.
          </p>
        )}
      </div>
    </div>
  );
}
