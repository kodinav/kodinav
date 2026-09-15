import type { ReactNode } from "react";

const HAN = /[㐀-鿿豈-﫿]/;
const OPENING = /^[「『（《〈【〔“‘(]+$/;

/**
 * Chinese has no spaces, so browsers may break a heading between any two
 * characters, splitting words like 開｜發 across lines. This segments the
 * text into words with ICU's dictionary word segmenter (at build time, on
 * the server) and makes each word an unbreakable inline-block, so lines
 * break only between words. Closing punctuation (，。：) sticks to the word
 * before it and opening brackets to the word after, so no line starts with
 * a comma or ends with an opening bracket.
 *
 * Text without Han characters (English pages) is returned untouched.
 */
export function cjkWords(text: string, locale = "zh-Hant"): ReactNode {
  if (!HAN.test(text) || typeof Intl.Segmenter !== "function") return text;

  const parts: string[] = [];
  let prefix = "";
  for (const { segment, isWordLike } of new Intl.Segmenter(locale, { granularity: "word" }).segment(text)) {
    if (!isWordLike && OPENING.test(segment)) {
      prefix += segment;
    } else if (!isWordLike && segment.trim() !== "" && parts.length > 0) {
      parts[parts.length - 1] += segment;
    } else {
      parts.push(prefix + segment);
      prefix = "";
    }
  }
  if (prefix) parts.push(prefix);

  return parts.map((part, i) =>
    part.trim() === "" ? (
      part
    ) : (
      <span key={i} className="inline-block">
        {part}
      </span>
    )
  );
}
