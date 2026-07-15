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

export function ReviewLinkGenerator() {
  const [placeId, setPlaceId] = useState("");
  const [copied, setCopied] = useState(false);
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
                <p className="annotation mb-4">QR code — for the counter, receipts, packaging</p>
                {/* eslint-disable-next-line @next/next/no-img-element -- data URI generated client-side */}
                <img
                  src={qr}
                  alt="QR code opening your Google review form"
                  className="w-40 border border-line-strong"
                  width={160}
                  height={160}
                />
                <a
                  href={qr}
                  download="google-review-qr.png"
                  className="u-draw mt-4 inline-block font-mono text-xs uppercase tracking-[0.18em] text-accent"
                >
                  Download PNG →
                </a>
              </div>
            )}
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
