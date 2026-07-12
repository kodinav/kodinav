// Meta (Facebook) Pixel helpers. Safe no-ops until the pixel is loaded.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Meta Pixel ID. Public by design (ships in page HTML). Empty = pixel off. */
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || ""; // TODO: paste Pixel ID to activate

/** Fire a standard Lead conversion event, tagged by where it came from. */
export function trackLead(source: string) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_category: source });
  }
}
