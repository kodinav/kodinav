import { Geist_Mono, Inter, Source_Serif_4 } from "next/font/google";

/* "Stage" (v6) type stack. The CSS variable names are frozen across redesigns
   (globals.css and older tooling reference them) — only the typefaces bound to
   them change:

     display  = Source Serif 4, light — a sharp editorial serif for statements.
                Loaded WITHOUT its optical-size axis: that axis alone costs
                ~50 kB, and the default cut is the sturdier one at display size
     body     = Inter, set at 500 with slightly negative tracking
     mono     = Geist Mono, for tracked uppercase labels, chips and buttons

   All three are open-licence faces, chosen by measuring character width
   against the target proportions rather than by eye.

   Declared once here because the site has several root layouts (English,
   Hong Kong Chinese, Taiwan Chinese) that must share one set of font files.
   None of these faces carry CJK glyphs; Chinese text falls through to the
   system Traditional Chinese fonts listed in globals.css. */

const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-anton",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`;
