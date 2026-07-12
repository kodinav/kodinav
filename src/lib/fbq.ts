// Meta (Facebook) Pixel helpers. Safe no-ops until the pixel is loaded.
// Deliberately plain: no global type augmentation, no client component, no
// React hooks. The pixel base code is rendered server-side in layout.tsx,
// the same pattern the (working) GA4 tag uses.

/** Meta Pixel ID. Public by design (ships in page HTML). Empty = pixel off. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ""; // TODO: paste Pixel ID to activate

type Fbq = (...args: unknown[]) => void;

/** Fire a standard Lead conversion event, tagged by where it came from. */
export function trackLead(source: string) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") {
    fbq("track", "Lead", { content_category: source });
  }
}
