"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Invoice generator v2 — the paid-tier features, free and on-device:
 * logo, a business profile that persists in localStorage (never on a
 * server), discounts, amount-in-words (Indian lakh/crore system for ₹),
 * auto-incrementing numbers, and a scannable UPI payment QR printed on
 * the invoice itself.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent";
const labelCls = "annotation mb-1.5 block";

type Line = { desc: string; qty: string; rate: string };

const CURRENCIES = [
  { sym: "₹", words: "Rupees", indian: true },
  { sym: "$", words: "Dollars", indian: false },
  { sym: "AED", words: "Dirhams", indian: false },
  { sym: "€", words: "Euros", indian: false },
  { sym: "£", words: "Pounds", indian: false },
];

const STORE_KEY = "kodinav-invoice-profile";

function esc(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/* Amount in words — Indian (lakh/crore) or Western (thousand/million) */
const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function below1000(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? " " + ONES[n % 10] : ""}`;
  return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? " " + below1000(n % 100) : ""}`;
}

function inWords(n: number, indian: boolean): string {
  n = Math.floor(n);
  if (n === 0) return "Zero";
  if (n >= 1e15) return "";
  const parts: string[] = [];
  if (indian) {
    const units: [number, string][] = [[1e7, "Crore"], [1e5, "Lakh"], [1e3, "Thousand"]];
    for (const [div, name] of units) {
      const q = Math.floor(n / div);
      if (q) {
        parts.push(`${inWords(q, true)} ${name}`);
        n %= div;
      }
    }
  } else {
    const units: [number, string][] = [[1e9, "Billion"], [1e6, "Million"], [1e3, "Thousand"]];
    for (const [div, name] of units) {
      const q = Math.floor(n / div);
      if (q) {
        parts.push(`${below1000(q)} ${name}`);
        n %= div;
      }
    }
  }
  if (n) parts.push(below1000(n));
  return parts.join(" ");
}

export function InvoiceGenerator() {
  const [from, setFrom] = useState("");
  const [fromDetails, setFromDetails] = useState("");
  const [logo, setLogo] = useState(""); // data URL so it survives into print + storage
  const [upiId, setUpiId] = useState("");
  const [to, setTo] = useState("");
  const [toDetails, setToDetails] = useState("");
  const [invNo, setInvNo] = useState("001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [currency, setCurrency] = useState("₹");
  const [taxLabel, setTaxLabel] = useState("GST");
  const [taxRate, setTaxRate] = useState("18");
  const [discount, setDiscount] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([{ desc: "", qty: "1", rate: "" }]);
  const [profileSaved, setProfileSaved] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Load the on-device profile once (rAF keeps the linter honest and avoids hydration mismatch)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORE_KEY);
        if (!raw) return;
        const p = JSON.parse(raw);
        setFrom(p.from ?? "");
        setFromDetails(p.fromDetails ?? "");
        setLogo(p.logo ?? "");
        setUpiId(p.upiId ?? "");
        setCurrency(p.currency ?? "₹");
        setTaxLabel(p.taxLabel ?? "GST");
        setTaxRate(p.taxRate ?? "18");
        setNotes(p.notes ?? "");
        if (p.lastInvNo) {
          const n = parseInt(p.lastInvNo, 10);
          if (Number.isFinite(n)) setInvNo(String(n + 1).padStart(String(p.lastInvNo).length, "0"));
        }
        setHasProfile(true);
      } catch {
        /* corrupted storage — start fresh */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const saveProfile = () => {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ from, fromDetails, logo, upiId, currency, taxLabel, taxRate, notes, lastInvNo: invNo })
    );
    setHasProfile(true);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 1800);
  };
  const clearProfile = () => {
    localStorage.removeItem(STORE_KEY);
    setHasProfile(false);
  };

  const onLogo = (files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith("image/") || f.size > 1_000_000) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result));
    reader.readAsDataURL(f);
  };

  const nums = lines.map((l) => ({
    desc: l.desc,
    qty: parseFloat(l.qty) || 0,
    rate: parseFloat(l.rate.replace(/,/g, "")) || 0,
  }));
  const subtotal = nums.reduce((s, l) => s + l.qty * l.rate, 0);
  const disc = Math.min(parseFloat(discount.replace(/,/g, "")) || 0, subtotal);
  const taxable = subtotal - disc;
  const rate = parseFloat(taxRate) || 0;
  const tax = (taxable * rate) / 100;
  const total = taxable + tax;
  const cur = CURRENCIES.find((c) => c.sym === currency) ?? CURRENCIES[0];
  const fmt = (v: number) =>
    `${currency} ${v.toLocaleString(cur.indian ? "en-IN" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const totalWords =
    total > 0 ? `${cur.words} ${inWords(Math.round(total), cur.indian)} Only` : "";
  const ready = Boolean(from.trim() && to.trim() && subtotal > 0);
  const upiActive = currency === "₹" && upiId.trim().includes("@");

  const print = async () => {
    let upiQr = "";
    if (upiActive) {
      const p = new URLSearchParams({ pa: upiId.trim(), pn: from.trim() || upiId.trim(), am: total.toFixed(2), cu: "INR", tn: `Invoice ${invNo}` });
      upiQr = await QRCode.toDataURL(`upi://pay?${p.toString()}`, { width: 240, margin: 1 });
    }
    // Bump the stored last-used number so the next invoice auto-increments
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) localStorage.setItem(STORE_KEY, JSON.stringify({ ...JSON.parse(raw), lastInvNo: invNo }));
    } catch { /* ignore */ }

    const rows = nums
      .filter((l) => l.desc.trim() && l.qty * l.rate > 0)
      .map(
        (l) => `<tr><td>${esc(l.desc)}</td><td class="r">${l.qty}</td><td class="r">${esc(fmt(l.rate))}</td><td class="r">${esc(fmt(l.qty * l.rate))}</td></tr>`
      )
      .join("");
    const html = `<!DOCTYPE html><html><head><title>Invoice ${esc(invNo)}</title><style>
      body{font-family:Georgia,serif;color:#16140f;max-width:720px;margin:40px auto;padding:0 24px}
      h1{font-size:26px;letter-spacing:2px;text-transform:uppercase;margin:0}
      .row{display:flex;justify-content:space-between;gap:24px;margin-top:28px}
      .muted{color:#555;font-size:13px;line-height:1.5;white-space:pre-line}
      .label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:6px}
      table{width:100%;border-collapse:collapse;margin-top:32px;font-size:14px}
      th{font-size:10px;letter-spacing:2px;text-transform:uppercase;text-align:left;color:#888;border-bottom:2px solid #16140f;padding:8px 6px}
      td{border-bottom:1px solid #ddd;padding:10px 6px;vertical-align:top}
      .r{text-align:right}
      .totals{margin-top:16px;margin-left:auto;width:300px;font-size:14px}
      .totals div{display:flex;justify-content:space-between;padding:6px 6px;border-bottom:1px solid #eee}
      .totals .grand{border-top:2px solid #16140f;border-bottom:none;font-weight:bold;font-size:17px;padding-top:10px}
      .words{margin-top:10px;font-size:12px;color:#555;font-style:italic;text-align:right}
      .notes{margin-top:36px;font-size:13px;color:#555;white-space:pre-line}
      .pay{margin-top:32px;display:flex;gap:16px;align-items:center}
      .pay img{width:110px;height:110px;border:1px solid #ddd}
      img.logo{max-height:56px;max-width:180px;object-fit:contain}
      @media print{body{margin:0 auto}}
    </style></head><body>
      <div class="row" style="margin-top:0;align-items:center">
        <div>${logo ? `<img class="logo" src="${logo}" alt=""/><br/>` : ""}<h1>Invoice</h1></div>
        <div class="muted" style="text-align:right">No. ${esc(invNo)}<br/>${esc(date)}</div>
      </div>
      <div class="row">
        <div style="flex:1"><div class="label">From</div><strong>${esc(from)}</strong><div class="muted">${esc(fromDetails)}</div></div>
        <div style="flex:1"><div class="label">Bill to</div><strong>${esc(to)}</strong><div class="muted">${esc(toDetails)}</div></div>
      </div>
      <table><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="totals">
        <div><span>Subtotal</span><span>${esc(fmt(subtotal))}</span></div>
        ${disc > 0 ? `<div><span>Discount</span><span>− ${esc(fmt(disc))}</span></div>` : ""}
        ${rate > 0 ? `<div><span>${esc(taxLabel)} (${rate}%)</span><span>${esc(fmt(tax))}</span></div>` : ""}
        <div class="grand"><span>Total</span><span>${esc(fmt(total))}</span></div>
      </div>
      ${totalWords ? `<div class="words">${esc(totalWords)}</div>` : ""}
      ${upiQr ? `<div class="pay"><img src="${upiQr}" alt="UPI payment QR"/><div class="muted"><div class="label">Pay by UPI</div>Scan with any UPI app —<br/>amount and reference pre-filled.<br/>${esc(upiId.trim())}</div></div>` : ""}
      ${notes.trim() ? `<div class="notes"><div class="label">Notes</div>${esc(notes)}</div>` : ""}
      <script>window.print()</script>
    </body></html>`;
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inv-from" className={labelCls}>Your business *</label>
            <input id="inv-from" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Sunrise Design Studio" />
            <textarea rows={2} className={`${inputCls} mt-2 resize-y`} value={fromDetails} onChange={(e) => setFromDetails(e.target.value)} placeholder="Address, GSTIN/TRN, email…" aria-label="Your business details" />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="cursor-pointer border border-line-strong px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent">
                {logo ? "Change logo" : "Add logo"}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => onLogo(e.target.files)} />
              </label>
              {logo && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- user-provided data URI */}
                  <img src={logo} alt="Your logo" className="h-8 max-w-24 border border-line object-contain" />
                  <button type="button" onClick={() => setLogo("")} className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint hover:text-accent">Remove</button>
                </>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="inv-to" className={labelCls}>Bill to *</label>
            <input id="inv-to" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} placeholder="Client name" />
            <textarea rows={2} className={`${inputCls} mt-2 resize-y`} value={toDetails} onChange={(e) => setToDetails(e.target.value)} placeholder="Client address, GSTIN/TRN…" aria-label="Client details" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="inv-no" className={labelCls}>Invoice no.</label>
            <input id="inv-no" className={inputCls} value={invNo} onChange={(e) => setInvNo(e.target.value)} />
          </div>
          <div>
            <label htmlFor="inv-date" className={labelCls}>Date</label>
            <input id="inv-date" type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="inv-cur" className={labelCls}>Currency</label>
            <select id="inv-cur" className={inputCls} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.sym} value={c.sym}>{c.sym}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="inv-tax" className={labelCls}>Tax</label>
            <div className="flex gap-2">
              <input id="inv-tax" className={inputCls} value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} placeholder="GST" aria-label="Tax label" />
              <input inputMode="decimal" className={`${inputCls} w-20`} value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="18" aria-label="Tax rate percent" />
            </div>
          </div>
        </div>

        <fieldset>
          <legend className={labelCls}>Line items</legend>
          <div className="flex flex-col gap-2.5">
            {lines.map((l, i) => (
              <div key={i} className="grid grid-cols-[1fr_4rem_6.5rem] gap-2">
                <input className={inputCls} value={l.desc} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))} placeholder="Website design & development" aria-label={`Item ${i + 1} description`} />
                <input inputMode="decimal" className={inputCls} value={l.qty} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, qty: e.target.value } : x)))} placeholder="1" aria-label={`Item ${i + 1} quantity`} />
                <input inputMode="decimal" className={inputCls} value={l.rate} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, rate: e.target.value } : x)))} placeholder="Rate" aria-label={`Item ${i + 1} rate`} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-3">
            <button type="button" onClick={() => setLines([...lines, { desc: "", qty: "1", rate: "" }])} className="border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent">
              + Add line
            </button>
            {lines.length > 1 && (
              <button type="button" onClick={() => setLines(lines.slice(0, -1))} className="border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent">
                − Remove last
              </button>
            )}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inv-disc" className={labelCls}>Discount amount (optional)</label>
            <input id="inv-disc" inputMode="decimal" className={inputCls} value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label htmlFor="inv-upi" className={labelCls}>UPI ID — prints a payment QR (₹ only)</label>
            <input id="inv-upi" className={inputCls} value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="shopname@okhdfcbank" />
          </div>
        </div>
        <div>
          <label htmlFor="inv-notes" className={labelCls}>Notes (payment details, terms…)</label>
          <textarea id="inv-notes" rows={2} className={`${inputCls} resize-y`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Bank transfer to… · Due within 14 days" />
        </div>
      </div>

      <div className="ink relative h-fit self-start p-7 sm:p-8 lg:sticky lg:top-28">
        <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
        <p className="annotation mb-5">Totals</p>
        <dl className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
            <dt className="text-sm text-muted">Subtotal</dt>
            <dd className="font-mono text-lg text-foreground">{fmt(subtotal)}</dd>
          </div>
          {disc > 0 && (
            <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
              <dt className="text-sm text-muted">Discount</dt>
              <dd className="font-mono text-lg text-foreground/90">− {fmt(disc)}</dd>
            </div>
          )}
          {rate > 0 && (
            <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
              <dt className="text-sm text-muted">{taxLabel || "Tax"} ({rate}%)</dt>
              <dd className="font-mono text-lg text-foreground/90">{fmt(tax)}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-6">
            <dt className="text-sm text-foreground">Total</dt>
            <dd className="font-display text-3xl uppercase text-accent">{fmt(total)}</dd>
          </div>
        </dl>
        {totalWords && (
          <p className="mt-3 text-right font-serif text-xs italic text-muted">{totalWords}</p>
        )}
        {upiActive && (
          <p className="mt-3 text-xs text-muted">
            <span aria-hidden className="text-accent">■</span> UPI payment QR
            will print on the invoice — amount and reference pre-filled.
          </p>
        )}
        <button
          type="button"
          onClick={print}
          disabled={!ready}
          className="mt-6 inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          Print / save as PDF →
        </button>
        <div className="mt-6 border-t border-line pt-5">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={saveProfile} className="border border-line-strong px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent">
              {profileSaved ? "Saved ✓" : "Save my details on this device"}
            </button>
            {hasProfile && (
              <button type="button" onClick={clearProfile} className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint hover:text-accent">
                Forget me
              </button>
            )}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Saving keeps your business details, logo and last invoice number in{" "}
            <em>your browser&apos;s</em> storage — next visit, everything is
            pre-filled and the number increments itself. Nothing ever reaches
            our server.
          </p>
        </div>
      </div>
    </div>
  );
}
