/**
 * Local-currency equivalents for the Hong Kong and Taiwan markets.
 *
 * Studio pricing is set in USD (see CostCalculator and site.priceFloorUsd);
 * these helpers derive the HK$ / NT$ figures shown to those markets so every
 * page quotes the same numbers. Amounts round UP to the nearest thousand, so
 * a displayed "from" price never undercuts the USD floor.
 *
 * HKD is pegged (7.75–7.85), so its rate is effectively fixed. TWD floats:
 * review TWD_PER_USD every quarter and adjust if it moves more than ~5%.
 */
export const HKD_PER_USD = 7.8;
export const TWD_PER_USD = 31; // reviewed 2026-09

const ceilTo = (n: number, step: number) => Math.ceil(n / step) * step;

export const toHkd = (usd: number) => ceilTo(usd * HKD_PER_USD, 1000);
export const toTwd = (usd: number) => ceilTo(usd * TWD_PER_USD, 1000);

export const fmtHkd = (usd: number) => `HK$${toHkd(usd).toLocaleString("en-US")}`;
export const fmtTwd = (usd: number) => `NT$${toTwd(usd).toLocaleString("en-US")}`;

/** "$2,000" → 2000. Returns NaN for strings without a number. */
export const parseUsd = (usd: string) => Number(usd.replace(/[^0-9.]/g, ""));

/**
 * Real studio price bands in USD — the same bases the website cost
 * calculator uses, so market pages and the calculator never disagree.
 */
export const priceBands = {
  landing: [2000, 3000],
  business: [2000, 4000],
  bilingual: [500, 1200], // add-on: a second language (e.g. English + Traditional Chinese)
  ecommerce: [4000, 8000],
  webapp: [8000, 15000],
} as const satisfies Record<string, readonly [number, number]>;

/** "HK$16,000 – 32,000" for a USD band. */
export const rangeHkd = ([lo, hi]: readonly [number, number]) =>
  `HK$${toHkd(lo).toLocaleString("en-US")} – ${toHkd(hi).toLocaleString("en-US")}`;

/** "NT$62,000 – 124,000" for a USD band. */
export const rangeTwd = ([lo, hi]: readonly [number, number]) =>
  `NT$${toTwd(lo).toLocaleString("en-US")} – ${toTwd(hi).toLocaleString("en-US")}`;

/** "US$2,000 – 4,000" for a USD band. */
export const rangeUsd = ([lo, hi]: readonly [number, number]) =>
  `US$${lo.toLocaleString("en-US")} – ${hi.toLocaleString("en-US")}`;
