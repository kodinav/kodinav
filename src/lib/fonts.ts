import { Geist, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

/* "Workbench" (v5) type stack. The CSS variable names are frozen across
   redesigns (globals.css and older tooling reference them) — only the
   typefaces bound to them change: display = Schibsted Grotesk, body = Geist,
   numerals/annotations/readouts = JetBrains Mono.

   The serif italic accent of v4 is gone on purpose. On a workbench the accent
   is a measured value set in mono, not an italic word; three variable files
   also ship fewer bytes than v4's four families.

   Declared once here because the site has several root layouts (English,
   Hong Kong Chinese, Taiwan Chinese) that must share one set of font files.
   None of these faces carry CJK glyphs; Chinese text falls through to the
   system Traditional Chinese fonts listed in globals.css. */

const display = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-anton",
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
