"use client";

import { useState } from "react";

/**
 * Hong Kong profits tax under the two-tiered regime (years of assessment
 * from 2018/19): corporations 8.25% on the first HK$2m of assessable profits
 * and 16.5% on the rest; unincorporated businesses 7.5% / 15%. A connected
 * entity that is not the nominated one pays the standard rate on everything.
 *
 * One-off Budget reductions change every year, so they are an optional input
 * rather than a hard-coded figure that would silently go stale.
 */

const TIER = 2_000_000;
const RATES = {
  corporation: { low: 0.0825, standard: 0.165 },
  unincorporated: { low: 0.075, standard: 0.15 },
} as const;

type Entity = keyof typeof RATES;

export type ProfitsTaxLabels = {
  profits: string;
  entity: string;
  corporation: string;
  unincorporated: string;
  twoTier: string;
  twoTierHint: string;
  reduction: string;
  reductionHint: string;
  breakdown: string;
  firstTier: string;
  remainder: string;
  standardAll: string;
  taxBefore: string;
  reductionApplied: string;
  payable: string;
  effective: string;
  empty: string;
  disclaimer: string;
};

export const profitsTaxLabelsEn: ProfitsTaxLabels = {
  profits: "Assessable profits (HK$)",
  entity: "Type of business",
  corporation: "Corporation (limited company)",
  unincorporated: "Unincorporated (sole proprietor / partnership)",
  twoTier: "Use the two-tiered rates",
  twoTierHint: "Untick for a connected entity that is not the one nominated for two-tiered rates.",
  reduction: "One-off tax reduction cap (HK$, optional)",
  reductionHint: "Only if the Budget announced a reduction for the year you are calculating.",
  breakdown: "The breakdown",
  firstTier: "Profits up to HK$2m",
  remainder: "Remaining profits",
  standardAll: "All profits at the standard rate",
  taxBefore: "Tax before reduction",
  reductionApplied: "Less one-off reduction",
  payable: "Profits tax payable",
  effective: "Effective rate",
  empty:
    "Enter your assessable profits to see the tax at each tier, the one-off reduction if any, and your effective rate.",
  disclaimer:
    "Arithmetic on published rates, rounded to the nearest dollar. Assessable profits, deductions and connected-entity status are questions for your accountant.",
};

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";

const hkd = (v: number) => `HK$${Math.round(v).toLocaleString("en-US")}`;
const pct = (v: number) => `${+(v * 100).toFixed(2)}%`;

export function ProfitsTaxCalculator({ labels = profitsTaxLabelsEn }: { labels?: ProfitsTaxLabels }) {
  const t = labels;
  const [profits, setProfits] = useState("");
  const [entity, setEntity] = useState<Entity>("corporation");
  const [twoTier, setTwoTier] = useState(true);
  const [cap, setCap] = useState("");

  const p = parseFloat(profits.replace(/,/g, ""));
  const valid = Number.isFinite(p) && p > 0;
  const rates = RATES[entity];

  const tier1 = valid && twoTier ? Math.min(p, TIER) : 0;
  const tier2 = valid && twoTier ? Math.max(p - TIER, 0) : 0;
  const tax = !valid ? 0 : twoTier ? tier1 * rates.low + tier2 * rates.standard : p * rates.standard;
  const capValue = parseFloat(cap.replace(/,/g, ""));
  const reduction = Number.isFinite(capValue) && capValue > 0 ? Math.min(tax, capValue) : 0;
  const payable = tax - reduction;

  const row = (label: string, value: string, strong = false) => (
    <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
      <dt className={`text-sm ${strong ? "text-foreground" : "text-muted"}`}>{label}</dt>
      <dd className="font-mono text-base text-foreground">{value}</dd>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="pt-profits" className="annotation mb-2 block">
            {t.profits}
          </label>
          <input
            id="pt-profits"
            inputMode="decimal"
            className={inputCls}
            value={profits}
            onChange={(e) => setProfits(e.target.value)}
            placeholder="2,500,000"
          />
        </div>

        <fieldset>
          <legend className="annotation mb-3">{t.entity}</legend>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            {(["corporation", "unincorporated"] as const).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={entity === id}
                onClick={() => setEntity(id)}
                className={`border px-4 py-2.5 text-left text-sm transition-colors ${
                  entity === id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                {t[id]}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={twoTier}
            onChange={(e) => setTwoTier(e.target.checked)}
            className="mt-1 size-4 accent-(--accent)"
          />
          <span>
            <span className="block text-sm text-foreground">{t.twoTier}</span>
            <span className="mt-1 block text-xs leading-relaxed text-faint">{t.twoTierHint}</span>
          </span>
        </label>

        <div>
          <label htmlFor="pt-cap" className="annotation mb-2 block">
            {t.reduction}
          </label>
          <input
            id="pt-cap"
            inputMode="decimal"
            className={inputCls}
            value={cap}
            onChange={(e) => setCap(e.target.value)}
            placeholder="0"
          />
          <p className="mt-2 text-xs leading-relaxed text-faint">{t.reductionHint}</p>
        </div>
      </div>

      <div className="ink relative h-fit self-start p-7 sm:p-8">
        <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
        <p className="annotation mb-5">{t.breakdown}</p>
        {valid ? (
          <dl className="flex flex-col gap-3">
            {twoTier ? (
              <>
                {row(`${t.firstTier} (${hkd(tier1)}) × ${pct(rates.low)}`, hkd(tier1 * rates.low))}
                {tier2 > 0 && row(`${t.remainder} (${hkd(tier2)}) × ${pct(rates.standard)}`, hkd(tier2 * rates.standard))}
              </>
            ) : (
              row(`${t.standardAll} × ${pct(rates.standard)}`, hkd(tax))
            )}
            {reduction > 0 && (
              <>
                {row(t.taxBefore, hkd(tax))}
                {row(t.reductionApplied, `− ${hkd(reduction)}`)}
              </>
            )}
            <div className="flex items-baseline justify-between gap-6">
              <dt className="text-sm text-foreground">{t.payable}</dt>
              <dd className="font-display text-3xl text-accent">{hkd(payable)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6">
              <dt className="text-xs text-muted">{t.effective}</dt>
              <dd className="font-mono text-sm text-foreground/90">{((payable / p) * 100).toFixed(2)}%</dd>
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
