"use client";

import { useState } from "react";

/**
 * Add/remove tax calculator, shared by the UAE VAT and India GST pages.
 * Rates come in as props from the (server) page so each market page stays
 * the single source of truth for its own rates.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

export type TaxCalculatorLabels = {
  mode: string;
  add: string;
  remove: string;
  amount: string;
  rate: string;
  breakdown: string;
  net: string;
  /** The component appends " (5%)" */
  tax: string;
  total: string;
  empty: string;
  disclaimer: string;
};

export function TaxCalculator({
  taxName,
  currency,
  rates,
  defaultRate,
  splitLabel,
  wholeUnits = false,
  labels,
}: {
  taxName: string;
  currency: string;
  rates: number[];
  defaultRate: number;
  /** e.g. "CGST + SGST" — renders a 50/50 split of the tax when set. */
  splitLabel?: string;
  /**
   * Round to whole currency units the way the market invoices (Taiwan's
   * uniform invoices use whole NT dollars): the tax is rounded when added,
   * and when splitting an inclusive price the net is rounded and the tax is
   * the remainder, so net + tax always equals the total exactly.
   */
  wholeUnits?: boolean;
  /** Translated copy; defaults are English, built from taxName/currency. */
  labels?: Partial<TaxCalculatorLabels>;
}) {
  const t: TaxCalculatorLabels = {
    mode: "What do you have?",
    add: `Price before ${taxName} — add it`,
    remove: `Price including ${taxName} — split it out`,
    amount: `Amount (${currency})`,
    rate: `${taxName} rate`,
    breakdown: "The breakdown",
    net: `Net (before ${taxName})`,
    tax: taxName,
    total: `Total (including ${taxName})`,
    empty: `Enter an amount and the net / ${taxName} / total breakdown appears here — both directions: add ${taxName} to a base price, or split it out of a tax-inclusive one.`,
    disclaimer: "Arithmetic only — which rate applies to your goods or services is a question for your accountant.",
    ...labels,
  };
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(defaultRate);
  const [mode, setMode] = useState<"add" | "remove">("add");

  const n = parseFloat(amount.replace(/,/g, ""));
  const valid = Number.isFinite(n) && n > 0;

  let net = 0, tax = 0, gross = 0;
  if (valid) {
    if (mode === "add") {
      net = wholeUnits ? Math.round(n) : n;
      tax = wholeUnits ? Math.round((net * rate) / 100) : (net * rate) / 100;
      gross = net + tax;
    } else {
      gross = wholeUnits ? Math.round(n) : n;
      net = wholeUnits ? Math.round(gross / (1 + rate / 100)) : gross / (1 + rate / 100);
      tax = gross - net;
    }
  }
  const digits = wholeUnits ? 0 : 2;
  const fmt = (v: number) =>
    `${currency} ${v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <fieldset>
          <legend className="annotation mb-3">{t.mode}</legend>
          <div className="flex gap-2.5">
            {(
              [
                ["add", t.add],
                ["remove", t.remove],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={mode === id}
                onClick={() => setMode(id)}
                className={`border px-4 py-2.5 text-left font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                  mode === id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="tax-amount" className="annotation mb-2 block">
            {t.amount}
          </label>
          <input
            id="tax-amount"
            inputMode="decimal"
            className={inputCls}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1,000"
          />
        </div>
        <fieldset>
          <legend className="annotation mb-3">{t.rate}</legend>
          <div className="flex flex-wrap gap-2.5">
            {rates.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={rate === r}
                onClick={() => setRate(r)}
                className={`border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  rate === r
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="ink relative h-fit self-start p-7 sm:p-8">
        <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
        <p className="annotation mb-5">{t.breakdown}</p>
        {valid ? (
          <dl className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
              <dt className="text-sm text-muted">{t.net}</dt>
              <dd className="font-mono text-lg text-foreground">{fmt(net)}</dd>
            </div>
            {splitLabel ? (
              <>
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="text-sm text-muted">{splitLabel.split("+")[0].trim()} ({(rate / 2).toFixed(1)}%)</dt>
                  <dd className="font-mono text-sm text-foreground/90">{fmt(tax / 2)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
                  <dt className="text-sm text-muted">{splitLabel.split("+")[1].trim()} ({(rate / 2).toFixed(1)}%)</dt>
                  <dd className="font-mono text-sm text-foreground/90">{fmt(tax / 2)}</dd>
                </div>
              </>
            ) : (
              <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
                <dt className="text-sm text-muted">
                  {t.tax} ({rate}%)
                </dt>
                <dd className="font-mono text-lg text-foreground/90">{fmt(tax)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-6">
              <dt className="text-sm text-foreground">{t.total}</dt>
 <dd className="font-display text-3xl text-accent">{fmt(gross)}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm leading-relaxed text-muted">{t.empty}</p>
        )}
        <p className="mt-5 text-xs leading-relaxed text-faint">{t.disclaimer}</p>
      </div>
    </div>
  );
}
