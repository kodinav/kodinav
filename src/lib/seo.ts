/**
 * Title and description helpers.
 *
 * Google truncates a result title at roughly 60 Latin characters' worth of
 * pixels, and a CJK glyph is about twice as wide as a Latin one. The site's
 * title template appends " — Kodinav" (10 characters), which on a long title
 * spends the tail of the headline on a brand name nobody sees, because it is
 * cut off. These helpers keep the brand where it fits and drop it where it
 * would cost the reader actual words.
 */

const BRAND_WIDTH = 10; // " — Kodinav"
const TITLE_BUDGET = 60;
const DESCRIPTION_BUDGET = 155;

/** SERP width: CJK glyphs count double. */
export const serpWidth = (text: string) =>
  [...text].reduce((total, char) => total + ((char.codePointAt(0) ?? 0) > 0x2e7f ? 2 : 1), 0);

/**
 * A page title for Next's `metadata.title`. Returns the bare string (so the
 * " — Kodinav" template applies) when it fits, or an absolute title when the
 * brand suffix would push it past the limit.
 */
export function pageTitle(title: string): string | { absolute: string } {
  return serpWidth(title) + BRAND_WIDTH <= TITLE_BUDGET ? title : { absolute: title };
}

/**
 * Trim a description to the length Google actually shows, cutting at a
 * sentence end where possible and a word boundary otherwise — never
 * mid-word, and never with a dangling comma.
 */
export function metaDescription(text: string, budget = DESCRIPTION_BUDGET): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (serpWidth(clean) <= budget) return clean;

  // Prefer whole sentences.
  let out = "";
  for (const sentence of clean.split(/(?<=[.!?。！？])\s+/)) {
    if (serpWidth(out + sentence) > budget) break;
    out += (out ? " " : "") + sentence;
  }
  if (serpWidth(out) >= budget * 0.6) return out;

  // Otherwise cut at a word boundary and mark the elision.
  let cut = "";
  for (const word of clean.split(" ")) {
    if (serpWidth(cut + word) > budget - 1) break;
    cut += (cut ? " " : "") + word;
  }
  return `${cut.replace(/[,;:—-]$/, "")}…`;
}
