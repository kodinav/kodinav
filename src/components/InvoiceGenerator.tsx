"use client";

import { useState } from "react";

/**
 * Invoice generator — builds a clean printable invoice in the browser and
 * prints it via a dedicated window (print → save as PDF). GST/VAT aware.
 * Nothing typed here leaves the visitor's device.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent";
const labelCls = "annotation mb-1.5 block";

type Line = { desc: string; qty: string; rate: string };

const CURRENCIES = ["₹", "$", "AED", "€", "£"];

function esc(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function InvoiceGenerator() {
  const [from, setFrom] = useState("");
  const [fromDetails, setFromDetails] = useState("");
  const [to, setTo] = useState("");
  const [toDetails, setToDetails] = useState("");
  const [invNo, setInvNo] = useState("001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [currency, setCurrency] = useState("₹");
  const [taxLabel, setTaxLabel] = useState("GST");
  const [taxRate, setTaxRate] = useState("18");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<Line[]>([{ desc: "", qty: "1", rate: "" }]);

  const nums = lines.map((l) => ({
    desc: l.desc,
    qty: parseFloat(l.qty) || 0,
    rate: parseFloat(l.rate.replace(/,/g, "")) || 0,
  }));
  const subtotal = nums.reduce((s, l) => s + l.qty * l.rate, 0);
  const rate = parseFloat(taxRate) || 0;
  const tax = (subtotal * rate) / 100;
  const total = subtotal + tax;
  const fmt = (v: number) =>
    `${currency} ${v.toLocaleString(currency === "₹" ? "en-IN" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const ready = Boolean(from.trim() && to.trim() && subtotal > 0);

  const print = () => {
    const rows = nums
      .filter((l) => l.desc.trim() && l.qty * l.rate > 0)
      .map(
        (l) => `<tr>
          <td>${esc(l.desc)}</td>
          <td class="r">${l.qty}</td>
          <td class="r">${esc(fmt(l.rate))}</td>
          <td class="r">${esc(fmt(l.qty * l.rate))}</td>
        </tr>`
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
      .totals{margin-top:16px;margin-left:auto;width:280px;font-size:14px}
      .totals div{display:flex;justify-content:space-between;padding:6px 6px;border-bottom:1px solid #eee}
      .totals .grand{border-top:2px solid #16140f;border-bottom:none;font-weight:bold;font-size:17px;padding-top:10px}
      .notes{margin-top:36px;font-size:13px;color:#555;white-space:pre-line}
      @media print{body{margin:0 auto}}
    </style></head><body>
      <div class="row" style="margin-top:0;align-items:baseline">
        <h1>Invoice</h1>
        <div class="muted">No. ${esc(invNo)}<br/>${esc(date)}</div>
      </div>
      <div class="row">
        <div style="flex:1"><div class="label">From</div><strong>${esc(from)}</strong><div class="muted">${esc(fromDetails)}</div></div>
        <div style="flex:1"><div class="label">Bill to</div><strong>${esc(to)}</strong><div class="muted">${esc(toDetails)}</div></div>
      </div>
      <table><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="totals">
        <div><span>Subtotal</span><span>${esc(fmt(subtotal))}</span></div>
        ${rate > 0 ? `<div><span>${esc(taxLabel)} (${rate}%)</span><span>${esc(fmt(tax))}</span></div>` : ""}
        <div class="grand"><span>Total</span><span>${esc(fmt(total))}</span></div>
      </div>
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
                <option key={c} value={c}>{c}</option>
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
        <button
          type="button"
          onClick={print}
          disabled={!ready}
          className="mt-6 inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.18em] text-[#efeae0] uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          Print / save as PDF →
        </button>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Opens a clean print view — choose &ldquo;Save as PDF&rdquo; in the
          print dialog. Generated on your device; no invoice data is sent
          anywhere or stored.
        </p>
      </div>
    </div>
  );
}
