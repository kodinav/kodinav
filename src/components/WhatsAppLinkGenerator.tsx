"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * wa.me link + QR generator. Everything runs in the visitor's browser —
 * no number or message is ever sent to the server, which is also the
 * honest answer to the privacy FAQ on the page.
 */

const CODES = [
  { code: "1", label: "+1 (US / Canada)" },
  { code: "971", label: "+971 (UAE)" },
  { code: "91", label: "+91 (India)" },
  { code: "44", label: "+44 (UK)" },
  { code: "966", label: "+966 (Saudi Arabia)" },
  { code: "974", label: "+974 (Qatar)" },
  { code: "965", label: "+965 (Kuwait)" },
  { code: "973", label: "+973 (Bahrain)" },
  { code: "968", label: "+968 (Oman)" },
  { code: "61", label: "+61 (Australia)" },
  { code: "49", label: "+49 (Germany)" },
  { code: "33", label: "+33 (France)" },
  { code: "65", label: "+65 (Singapore)" },
  { code: "27", label: "+27 (South Africa)" },
  { code: "234", label: "+234 (Nigeria)" },
];

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

export function WhatsAppLinkGenerator() {
  const [cc, setCc] = useState("971");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  // Keyed by the link it encodes, so a stale QR is never shown for a new link
  const [qrFor, setQrFor] = useState<{ link: string; dataUrl: string } | null>(null);

  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  const valid = digits.length >= 6 && digits.length <= 14;
  const link = valid
    ? `https://wa.me/${cc}${digits}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`
    : "";
  const qr = qrFor && qrFor.link === link ? qrFor.dataUrl : "";

  useEffect(() => {
    if (!link) return;
    let cancelled = false;
    QRCode.toDataURL(link, {
      width: 480,
      margin: 1,
      color: { dark: "#16140f", light: "#efeae0" },
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

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="wa-cc" className="annotation mb-2 block">
            Country code
          </label>
          <select
            id="wa-cc"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            className={inputCls}
          >
            {CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="wa-phone" className="annotation mb-2 block">
            WhatsApp number (without country code)
          </label>
          <input
            id="wa-phone"
            type="tel"
            inputMode="numeric"
            placeholder="e.g. 501234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
          />
          {phone && !valid && (
            <p className="mt-2 text-xs text-muted">
              Enter 6–14 digits, without the country code or leading zero.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="wa-msg" className="annotation mb-2 block">
            Pre-filled message (optional)
          </label>
          <textarea
            id="wa-msg"
            rows={3}
            maxLength={500}
            placeholder="Hi! I found you through your website and I'd like to know more about…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputCls} resize-y`}
          />
          <p className="mt-2 text-xs text-faint">
            The customer sees this typed out and just presses send.
          </p>
        </div>
      </div>

      {/* Result card */}
      <div className="ink relative h-fit self-start p-7 sm:p-8">
        <div
          aria-hidden
          className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background"
        />
        <p className="annotation mb-5">Your WhatsApp link</p>
        {link ? (
          <>
            <p className="break-all border border-line px-4 py-3 font-mono text-xs leading-relaxed text-foreground/90">
              {link}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5"
              >
                {copied ? "Copied ✓" : "Copy link"}
              </button>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs tracking-[0.18em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent"
              >
                Test it →
              </a>
            </div>
            {qr && (
              <div className="mt-6 border-t border-line pt-6">
                <p className="annotation mb-4">QR code — print it, frame it, stick it</p>
                {/* eslint-disable-next-line @next/next/no-img-element -- data URI generated client-side */}
                <img
                  src={qr}
                  alt={`QR code opening a WhatsApp chat with +${cc} ${digits}`}
                  className="w-40 border border-line-strong"
                  width={160}
                  height={160}
                />
                <a
                  href={qr}
                  download={`whatsapp-qr-${cc}${digits}.png`}
                  className="u-draw mt-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-accent"
                >
                  Download PNG →
                </a>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Enter your number and the link and QR code appear here. Generated
            entirely in your browser — your number is never sent to us or
            stored anywhere.
          </p>
        )}
      </div>
    </div>
  );
}
