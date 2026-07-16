"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Google review link + QR generator. Built on the documented
 * search.google.com/local/writereview?placeid= format, so it needs no API
 * key and nothing the visitor types ever leaves their browser.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

const ASK_TEMPLATES = (business: string, link: string) => [
  {
    id: "whatsapp",
    label: "WhatsApp / SMS",
    text: `Thank you for choosing ${business || "us"}! If you had a good experience, a Google review takes 30 seconds and helps us more than you know: ${link}`,
  },
  {
    id: "email",
    label: "Email",
    text: `Subject: A small favour?\n\nHi!\n\nThank you for choosing ${business || "us"} — it was a pleasure serving you.\n\nIf you were happy with your experience, would you leave us a short Google review? It takes about 30 seconds and genuinely helps other people find us:\n\n${link}\n\nThank you!\n${business || ""}`,
  },
  {
    id: "after-service",
    label: "After a visit",
    text: `Hope everything went well today! If you have half a minute, we'd be grateful for a Google review — it's the biggest way to support a small business: ${link}`,
  },
];

export function ReviewLinkGenerator() {
  const [placeId, setPlaceId] = useState("");
  const [business, setBusiness] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedTpl, setCopiedTpl] = useState("");
  // Keyed by the link it encodes, so a stale QR is never shown for a new link
  const [qrFor, setQrFor] = useState<{ link: string; dataUrl: string } | null>(null);

  const id = placeId.trim();
  const valid = /^[A-Za-z0-9_-]{16,}$/.test(id);
  const link = valid
    ? `https://search.google.com/local/writereview?placeid=${id}`
    : "";
  const qr = qrFor && qrFor.link === link ? qrFor.dataUrl : "";

  useEffect(() => {
    if (!link) return;
    let cancelled = false;
    QRCode.toDataURL(link, {
      width: 480,
      margin: 1,
      color: { dark: "#14201a", light: "#f3f1e9" },
    }).then((dataUrl) => {
      if (!cancelled) setQrFor({ link, dataUrl });
    });
    return () => {
      cancelled = true;
    };
  }, [link]);

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const copyTpl = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTpl(id);
    setTimeout(() => setCopiedTpl(""), 1600);
  };

  /** Print-ready A5 counter sign with the QR — the thing print shops charge for. */
  const printSign = () => {
    if (!qr) return;
    const esc = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const html = `<!DOCTYPE html><html><head><title>Review sign</title><style>
      @page{size:A5;margin:0}
      body{font-family:Georgia,serif;color:#14201a;margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh}
      .card{text-align:center;padding:40px;border:3px solid #14201a;margin:24px;max-width:420px}
      h1{font-size:30px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px}
      .stars{font-size:26px;letter-spacing:6px;margin:10px 0 4px}
      p{color:#444;font-size:15px;line-height:1.5;margin:8px 0 20px}
      img{width:220px;height:220px}
      .biz{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-top:18px}
    </style></head><body><div class="card">
      <h1>How did we do?</h1>
      <div class="stars">★★★★★</div>
      <p>Scan to leave us a Google review —<br/>it takes 30 seconds and means the world.</p>
      <img src="${qr}" alt="QR code to review us on Google"/>
      ${business.trim() ? `<div class="biz">${esc(business.trim())}</div>` : ""}
    </div><script>window.print()</script></body></html>`;
    const w = window.open("", "_blank", "width=700,height=800");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="rv-business" className="annotation mb-2 block">
            Business name (for the sign &amp; message templates)
          </label>
          <input
            id="rv-business"
            type="text"
            placeholder="Sunrise Dental Clinic"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="rv-place" className="annotation mb-2 block">
            Your Google Place ID
          </label>
          <input
            id="rv-place"
            type="text"
            placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            className={`${inputCls} font-mono`}
          />
          {id && !valid && (
            <p className="mt-2 text-xs text-muted">
              That doesn&apos;t look like a Place ID yet — most start with
              &ldquo;ChIJ&rdquo; and are around 27 characters.
            </p>
          )}
        </div>

        <div className="border border-line p-5">
          <p className="annotation mb-3">How to find your Place ID — 30 seconds</p>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-muted">
            <li>
              Open Google&apos;s free{" "}
              <a
                href="https://developers.google.com/maps/documentation/places/web-service/place-id#find-id"
                target="_blank"
                rel="noopener noreferrer"
                className="u-draw text-accent"
              >
                Place ID Finder
              </a>{" "}
              (scroll to the map on that page).
            </li>
            <li>Type your business name exactly as it appears on Google Maps.</li>
            <li>Click your business — the Place ID appears. Copy it and paste it above.</li>
          </ol>
        </div>
      </div>

      {/* Result card */}
      <div className="ink relative h-fit self-start p-7 sm:p-8">
        <div
          aria-hidden
          className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background"
        />
        <p className="annotation mb-5">Your review link</p>
        {link ? (
          <>
            <p className="break-all border border-line px-4 py-3 font-mono text-xs leading-relaxed text-foreground/90">
              {link}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5"
              >
                {copied ? "Copied ✓" : "Copy link"}
              </button>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs tracking-[0.14em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent"
              >
                Test it →
              </a>
            </div>
            {qr && (
              <div className="mt-6 border-t border-line pt-6">
                <p className="annotation mb-4">QR code — for the counter, receipts, packaging</p>
                {/* eslint-disable-next-line @next/next/no-img-element -- data URI generated client-side */}
                <img
                  src={qr}
                  alt="QR code opening your Google review form"
                  className="w-40 border border-line-strong"
                  width={160}
                  height={160}
                />
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  <a
                    href={qr}
                    download="google-review-qr.png"
                    className="u-draw font-mono text-xs uppercase tracking-[0.14em] text-accent"
                  >
                    Download PNG →
                  </a>
                  <button
                    type="button"
                    onClick={printSign}
                    className="u-draw font-mono text-xs uppercase tracking-[0.14em] text-accent"
                  >
                    Print a counter sign →
                  </button>
                </div>
              </div>
            )}
            <div className="mt-6 border-t border-line pt-6">
              <p className="annotation mb-4">Ready-to-send ask messages</p>
              <div className="flex flex-col gap-2.5">
                {ASK_TEMPLATES(business.trim(), link).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => copyTpl(t.id, t.text)}
                    className="border border-line-strong px-4 py-2.5 text-left transition-colors hover:border-accent"
                  >
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent">
                      {copiedTpl === t.id ? "Copied ✓" : `Copy — ${t.label}`}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted">{t.text}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-faint">
                The moment to send one: right after a good visit, delivery or
                result — while the experience is fresh.
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Paste your Place ID and your one-tap review link and QR code appear
            here. When a customer opens it, Google shows your business with the
            five stars already on screen — no searching, no scrolling.
          </p>
        )}
      </div>
    </div>
  );
}
