// Meta (Facebook) Pixel helpers. Safe no-ops until the pixel is loaded.
// Deliberately plain: no global type augmentation, no client component, no
// React hooks. The pixel base code is rendered server-side in layout.tsx,
// the same pattern the (working) GA4 tag uses.

/** Meta Pixel ID. Public by design (ships in page HTML). Empty = pixel off. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ""; // TODO: paste Pixel ID to activate

type Fbq = (...args: unknown[]) => void;
type Gtag = (...args: unknown[]) => void;

/**
 * Fire lead conversion events on every ad/analytics pipe we have:
 *  - Meta Pixel "Lead" (activates once META_PIXEL_ID is set)
 *  - GA4 "generate_lead" — importable into Google Ads as a conversion with
 *    zero further code, which is all a Google Ads campaign needs to optimise.
 */
export function trackLead(source: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: Fbq; gtag?: Gtag };
  if (typeof w.fbq === "function") {
    w.fbq("track", "Lead", { content_category: source });
  }
  if (typeof w.gtag === "function") {
    w.gtag("event", "generate_lead", { lead_source: source });
  }
}
