/**
 * Geo-aware price. Renders both the INR and USD value; CSS (driven by the
 * data-region attribute the inline script sets on <html> before paint) shows
 * exactly one, so there is no flash and no hydration mismatch. India sees INR,
 * everyone else sees USD.
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
  return (
    <>
      <span className={`price-in ${className}`}>{inr}</span>
      <span className={`price-intl ${className}`}>{usd}</span>
    </>
  );
}
