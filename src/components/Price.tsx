import { fmtHkd, fmtTwd, parseUsd } from "@/lib/fx";

/**
 * Geo-aware price. Renders every market's value; CSS (driven by the
 * data-region / data-market attributes the inline script sets on <html>
 * before paint) shows exactly one, so there is no flash and no hydration
 * mismatch. India sees INR, Hong Kong HK$, Taiwan NT$, everyone else USD.
 * The HK$ and NT$ figures derive from the USD value (see lib/fx.ts).
 */
export function Price({
  inr,
  usd,
  className = "",
}: {
  inr: string;
  usd: string;
  className?: string;
}) {
  const usdValue = parseUsd(usd);
  const local = Number.isFinite(usdValue) && usdValue > 0;
  return (
    <>
      <span className={`price-in ${className}`}>{inr}</span>
      <span className={`price-intl ${className}`}>{usd}</span>
      {local && (
        <>
          <span className={`price-hk ${className}`}>{fmtHkd(usdValue)}</span>
          <span className={`price-tw ${className}`}>{fmtTwd(usdValue)}</span>
        </>
      )}
    </>
  );
}
