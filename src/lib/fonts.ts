import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";

/* "Meridian" (v4) type stack. The CSS variable names are frozen across
   redesigns (globals.css and older tooling reference them) — only the
   typefaces bound to them change: display = Bricolage Grotesque, body =
   Geist, numerals/annotations = Geist Mono, editorial accent = Instrument
   Serif (the one flash of serif italic in an otherwise grotesk system).

   Declared once here because the site has several root layouts (English,
   Hong Kong Chinese, Taiwan Chinese) that must share one set of font files.
   None of these faces carry CJK glyphs; Chinese text falls through to the
   system Traditional Chinese fonts listed in globals.css. */

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-anton",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
});

// Editorial accent only (headings' accent word, pull quotes) — kept out of the
// preload set since it never carries the LCP text.
const editorial = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-editorial",
  preload: false,
});

export const fontVariables = `${display.variable} ${geistSans.variable} ${geistMono.variable} ${editorial.variable}`;
