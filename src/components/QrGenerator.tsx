"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

/**
 * QR generator v2 — the features competitors paywall, free and client-side:
 * nine content types (incl. WiFi login, vCard and UPI payment), logo
 * embedding, error-correction control, and custom colours with a real
 * contrast check so the code actually scans. Nothing typed here leaves
 * the visitor's browser.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";

type Kind = "url" | "text" | "wifi" | "vcard" | "email" | "sms" | "tel" | "whatsapp" | "upi";

const KINDS: { id: Kind; label: string }[] = [
  { id: "url", label: "Link" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "vcard", label: "Contact card" },
  { id: "upi", label: "UPI payment" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
  { id: "tel", label: "Phone call" },
];

/** Relative luminance for the scan-contrast check. */
function luminance(hex: string): number {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const escWifi = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

export function QrGenerator() {
  const [kind, setKind] = useState<Kind>("url");
  // Per-kind fields
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSec, setWifiSec] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [vName, setVName] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [vEmail, setVEmail] = useState("");
  const [vOrg, setVOrg] = useState("");
  const [vSite, setVSite] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  // Appearance
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#ffffff");
  const [ec, setEc] = useState<"M" | "Q" | "H">("M");
  const [logo, setLogo] = useState<string>(""); // object URL
  const [size, setSize] = useState(960);
  // Output — keyed so a stale code never shows
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [out, setOut] = useState<{ key: string; png: string; svg: string } | null>(null);

  // Encode the payload for the selected type
  let value = "";
  switch (kind) {
    case "url": {
      const t = url.trim();
      value = t ? (/^[a-z]+:/i.test(t) ? t : `https://${t}`) : "";
      break;
    }
    case "text":
      value = text.trim();
      break;
    case "wifi":
      value = ssid.trim()
        ? `WIFI:T:${wifiSec};S:${escWifi(ssid.trim())};${wifiSec === "nopass" ? "" : `P:${escWifi(wifiPass)};`};`
        : "";
      break;
    case "vcard":
      value = vName.trim()
        ? [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${vName.trim()}`,
            vOrg.trim() && `ORG:${vOrg.trim()}`,
            vPhone.trim() && `TEL;TYPE=CELL:${vPhone.trim()}`,
            vEmail.trim() && `EMAIL:${vEmail.trim()}`,
            vSite.trim() && `URL:${/^https?:/i.test(vSite.trim()) ? vSite.trim() : `https://${vSite.trim()}`}`,
            "END:VCARD",
          ]
            .filter(Boolean)
            .join("\n")
        : "";
      break;
    case "email":
      value = email.trim()
        ? `mailto:${email.trim()}${emailSubject.trim() ? `?subject=${encodeURIComponent(emailSubject.trim())}` : ""}`
        : "";
      break;
    case "sms":
      value = phone.trim()
        ? `SMSTO:${phone.trim().replace(/[^\d+]/g, "")}:${smsBody.trim()}`
        : "";
      break;
    case "tel":
      value = phone.trim() ? `tel:${phone.trim().replace(/[^\d+]/g, "")}` : "";
      break;
    case "whatsapp": {
      const digits = phone.replace(/\D/g, "");
      value = digits.length >= 8
        ? `https://wa.me/${digits}${waMsg.trim() ? `?text=${encodeURIComponent(waMsg.trim())}` : ""}`
        : "";
      break;
    }
    case "upi": {
      const pa = upiId.trim();
      if (pa && pa.includes("@")) {
        const p = new URLSearchParams({ pa, pn: upiName.trim() || pa, cu: "INR" });
        const amt = parseFloat(upiAmount);
        if (Number.isFinite(amt) && amt > 0) p.set("am", amt.toFixed(2));
        value = `upi://pay?${p.toString()}`;
      }
      break;
    }
  }
  if (value.length > 1200) value = "";

  const ratio = contrastRatio(dark, light);
  const lowContrast = ratio < 4;
  const inverted = luminance(dark) > luminance(light);
  // Logo needs headroom to stay scannable
  const effEc = logo ? "H" : ec;
  const key = value ? [kind, value, dark, light, effEc, logo, size].join("|") : "";

  useEffect(() => {
    if (!key || !value) return;
    let cancelled = false;
    const opts = {
      margin: 2,
      width: size,
      color: { dark, light },
      errorCorrectionLevel: effEc,
    } as const;
    (async () => {
      const [baseUrl, svg] = await Promise.all([
        QRCode.toDataURL(value, opts),
        QRCode.toString(value, { margin: 2, color: { dark, light }, errorCorrectionLevel: effEc, type: "svg" }),
      ]);
      let png = baseUrl;
      if (logo) {
        // Draw logo (with a quiet-zone pad) at 20% — safe with EC level H
        png = await new Promise<string>((resolve) => {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d")!;
          const qr = new Image();
          qr.onload = () => {
            ctx.drawImage(qr, 0, 0, size, size);
            const lg = new Image();
            lg.onload = () => {
              const box = size * 0.24;
              const inner = size * 0.2;
              ctx.fillStyle = light;
              ctx.fillRect((size - box) / 2, (size - box) / 2, box, box);
              ctx.drawImage(lg, (size - inner) / 2, (size - inner) / 2, inner, inner);
              resolve(canvas.toDataURL("image/png"));
            };
            lg.onerror = () => resolve(baseUrl);
            lg.src = logo;
          };
          qr.src = baseUrl;
        });
      }
      if (!cancelled) setOut({ key, png, svg });
    })();
    return () => {
      cancelled = true;
    };
    // key encodes every input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const current = out && out.key === key ? out : null;
  const svgHref = current
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(current.svg)}`
    : "";

  const onLogo = (files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    if (logo) URL.revokeObjectURL(logo);
    setLogo(URL.createObjectURL(f));
  };

  const field = (id: string, label: string, val: string, set: (v: string) => void, placeholder: string, type = "text") => (
    <div>
      <label htmlFor={id} className={labelCls}>{label}</label>
      <input id={id} type={type} className={inputCls} value={val} onChange={(e) => set(e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div className="flex flex-col gap-7">
        <fieldset>
          <legend className={labelCls}>What should the code do?</legend>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                aria-pressed={kind === k.id}
                onClick={() => setKind(k.id)}
                className={`border px-3.5 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] transition-colors ${
                  kind === k.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </fieldset>

        {kind === "url" && field("qr-url", "Link", url, setUrl, "https://yourwebsite.com/menu")}
        {kind === "text" && (
          <div>
            <label htmlFor="qr-text" className={labelCls}>Text</label>
            <textarea id="qr-text" rows={3} maxLength={1000} className={`${inputCls} resize-y`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Any text — a note, a code, a serial number…" />
          </div>
        )}
        {kind === "wifi" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {field("qr-ssid", "Network name (SSID)", ssid, setSsid, "CafeSunrise_Guest")}
            {field("qr-wpass", "Password", wifiPass, setWifiPass, "————", "text")}
            <div>
              <label htmlFor="qr-wsec" className={labelCls}>Security</label>
              <select id="qr-wsec" className={inputCls} value={wifiSec} onChange={(e) => setWifiSec(e.target.value as typeof wifiSec)}>
                <option value="WPA">WPA / WPA2 / WPA3 (most networks)</option>
                <option value="WEP">WEP (old routers)</option>
                <option value="nopass">Open network — no password</option>
              </select>
            </div>
            <p className="self-end pb-1 text-xs leading-relaxed text-faint">
              Guests scan and connect — no more spelling out the password.
            </p>
          </div>
        )}
        {kind === "vcard" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {field("qr-vname", "Full name *", vName, setVName, "Aisha Khan")}
            {field("qr-vorg", "Company", vOrg, setVOrg, "Sunrise Dental")}
            {field("qr-vphone", "Phone", vPhone, setVPhone, "+971 50 123 4567")}
            {field("qr-vemail", "Email", vEmail, setVEmail, "aisha@sunrise.ae")}
            {field("qr-vsite", "Website", vSite, setVSite, "sunrisedental.ae")}
            <p className="self-end pb-1 text-xs leading-relaxed text-faint">
              Scanning opens &ldquo;Add contact&rdquo; with everything filled in.
            </p>
          </div>
        )}
        {kind === "email" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {field("qr-email", "Email address", email, setEmail, "hello@yourbusiness.com")}
            {field("qr-esub", "Subject (optional)", emailSubject, setEmailSubject, "Enquiry")}
          </div>
        )}
        {(kind === "sms" || kind === "tel" || kind === "whatsapp") && (
          <div className="grid gap-4 sm:grid-cols-2">
            {field("qr-phone", kind === "whatsapp" ? "WhatsApp number (with country code)" : "Phone number", phone, setPhone, "+971501234567", "tel")}
            {kind === "sms" && field("qr-smsbody", "Pre-filled message (optional)", smsBody, setSmsBody, "Hi, I'd like to book…")}
            {kind === "whatsapp" && field("qr-wamsg", "Pre-filled message (optional)", waMsg, setWaMsg, "Hi! I scanned your QR…")}
          </div>
        )}
        {kind === "upi" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {field("qr-upiid", "UPI ID *", upiId, setUpiId, "shopname@okhdfcbank")}
            {field("qr-upiname", "Payee name", upiName, setUpiName, "Sunrise Stores")}
            {field("qr-upiamt", "Amount ₹ (optional — blank lets the customer type it)", upiAmount, setUpiAmount, "499")}
            <p className="self-end pb-1 text-xs leading-relaxed text-faint">
              Works with GPay, PhonePe, Paytm and every UPI app.
            </p>
          </div>
        )}

        <fieldset className="border-t border-line pt-6">
          <legend className="sr-only">Appearance</legend>
          <div className="flex flex-wrap items-end gap-6">
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-9 w-11 cursor-pointer border border-line-strong bg-transparent" />
              Code
            </label>
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="h-9 w-11 cursor-pointer border border-line-strong bg-transparent" />
              Background
            </label>
            <div>
              <label htmlFor="qr-ec" className={labelCls}>Toughness</label>
              <select id="qr-ec" className={inputCls} value={ec} onChange={(e) => setEc(e.target.value as typeof ec)} disabled={Boolean(logo)}>
                <option value="M">Standard (M)</option>
                <option value="Q">Robust (Q) — for print</option>
                <option value="H">Maximum (H) — damaged/small print</option>
              </select>
            </div>
            <div>
              <label htmlFor="qr-size" className={labelCls}>PNG size</label>
              <select id="qr-size" className={inputCls} value={size} onChange={(e) => setSize(Number(e.target.value))}>
                <option value={480}>480 px — screens</option>
                <option value={960}>960 px — flyers</option>
                <option value={1920}>1920 px — posters</option>
              </select>
            </div>
            <div>
              <span className={labelCls}>Logo in the centre</span>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer border border-line-strong px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent">
                  {logo ? "Change logo" : "Add logo"}
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => onLogo(e.target.files)} />
                </label>
                {logo && (
                  <button type="button" onClick={() => { URL.revokeObjectURL(logo); setLogo(""); }} className="font-mono text-xs uppercase tracking-[0.14em] text-faint hover:text-accent">
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          {lowContrast && (
            <p className="mt-3 text-xs text-accent">
              Contrast is {ratio.toFixed(1)}:1 — below 4:1 many cameras fail to scan. Darken the code or lighten the background.
            </p>
          )}
          {!lowContrast && inverted && (
            <p className="mt-3 text-xs text-muted">
              Light-on-dark codes fail on some older scanners — dark-on-light is the safe choice for print.
            </p>
          )}
          {logo && (
            <p className="mt-3 text-xs text-muted">
              Logo mode locks toughness to Maximum (H) so the code stays scannable — test with your phone before mass printing.
            </p>
          )}
        </fieldset>
      </div>

      {/* Result */}
      <div className="ink relative h-fit self-start p-7 sm:p-8 lg:sticky lg:top-28">
        <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
        <p className="annotation mb-5">Your QR code — never expires</p>
        {current ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- data URI generated client-side */}
            <img src={current.png} alt="Generated QR code" className="w-52 border border-line-strong" width={208} height={208} />
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={current.png} download={`qr-${kind}.png`} className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5">
                PNG — {size}px
              </a>
              <a href={svgHref} download={`qr-${kind}.svg`} className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs tracking-[0.14em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent">
                SVG — print, any size
              </a>
            </div>
            {logo && (
              <p className="mt-3 text-xs text-faint">SVG exports without the logo; the PNG includes it.</p>
            )}
            <p className="mt-5 text-xs leading-relaxed text-muted">
              Static code: the content lives inside the pattern, so it works
              forever, offline, with no account and no expiry. Scan it with
              your phone camera now to test it.
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Fill the form and the code appears here instantly — with the
            print-quality SVG and logo embedding other generators charge for.
            Everything happens in your browser; Wi-Fi passwords, contact
            details and UPI IDs are never sent to us or stored.
          </p>
        )}
      </div>
    </div>
  );
}
