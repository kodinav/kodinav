"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * QR code generator. Static codes rendered entirely in the browser: they
 * never expire, carry no watermark, and nothing typed here leaves the page.
 * PNG for screens, SVG for print — the vector download most tools paywall.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

const SCHEMES = [
  { id: "classic", label: "Classic (print-safe)", dark: "#000000", light: "#ffffff" },
  { id: "draftsman", label: "Studio ink on paper", dark: "#16140f", light: "#efeae0" },
] as const;

export function QrGenerator() {
  const [text, setText] = useState("");
  const [scheme, setScheme] = useState<(typeof SCHEMES)[number]["id"]>("classic");
  // Keyed by content+scheme so a stale code is never shown
  const [qrFor, setQrFor] = useState<{ key: string; dataUrl: string; svg: string } | null>(null);

  const value = text.trim();
  const ok = value.length > 0 && value.length <= 1000;
  const colors = SCHEMES.find((s) => s.id === scheme)!;
  const key = ok ? `${scheme}:${value}` : "";
  const current = qrFor && qrFor.key === key ? qrFor : null;

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    const opts = {
      margin: 2,
      color: { dark: colors.dark, light: colors.light },
      errorCorrectionLevel: "M" as const,
    };
    Promise.all([
      QRCode.toDataURL(value, { ...opts, width: 960 }),
      QRCode.toString(value, { ...opts, type: "svg" }),
    ]).then(([dataUrl, svg]) => {
      if (!cancelled) setQrFor({ key, dataUrl, svg });
    });
    return () => {
      cancelled = true;
    };
    // colors/value derive from key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const svgHref = current
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(current.svg)}`
    : "";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="qr-text" className="annotation mb-2 block">
            Link or text to encode
          </label>
          <textarea
            id="qr-text"
            rows={3}
            maxLength={1000}
            placeholder="https://yourwebsite.com — or any text, phone number, Wi-Fi note…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`${inputCls} resize-y`}
          />
          <p className="mt-2 text-xs text-faint">
            Shorter content scans faster from further away. A short link beats
            a long one.
          </p>
        </div>
        <fieldset>
          <legend className="annotation mb-3">Colours</legend>
          <div className="flex flex-wrap gap-2.5">
            {SCHEMES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={scheme === s.id}
                onClick={() => setScheme(s.id)}
                className={`border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  scheme === s.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                <span
                  aria-hidden
                  className="mr-2 inline-block size-2.5 border border-line-strong align-middle"
                  style={{ background: s.dark }}
                />
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-faint">
            Scanners want dark-on-light with contrast — both options keep that.
          </p>
        </fieldset>
      </div>

      {/* Result card */}
      <div className="ink relative h-fit self-start p-7 sm:p-8">
        <div
          aria-hidden
          className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background"
        />
        <p className="annotation mb-5">Your QR code — never expires</p>
        {current ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- data URI generated client-side */}
            <img
              src={current.dataUrl}
              alt="Generated QR code"
              className="w-48 border border-line-strong"
              width={192}
              height={192}
            />
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={current.dataUrl}
                download="qr-code.png"
                className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5"
              >
                PNG — screens
              </a>
              <a
                href={svgHref}
                download="qr-code.svg"
                className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs tracking-[0.18em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent"
              >
                SVG — print, any size
              </a>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              This is a static code: the content lives inside the pattern
              itself, so it works forever, offline, with no account and no
              expiry. Test it with your phone camera before printing a
              thousand stickers.
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Type a link or text and the code appears here instantly — with a
            print-quality SVG download most generators charge for. Generated
            in your browser; nothing is sent to us or stored.
          </p>
        )}
      </div>
    </div>
  );
}
