import { Geist_Mono, Instrument_Serif, Roboto } from "next/font/google";

/**
 * The typefaces behind the site's frozen font variables. The variable names
 * never change (40 pages and the zh stylesheets bind to them); only the faces
 * bound here do.
 *
 *   --font-archivo    = Roboto, the body face.
 *   --font-anton      = Instrument Serif (roman + italic), the display serif:
 *                       every headline, the italic word, the footer headings.
 *   --font-space-mono = Geist Mono, for small figures and file-like detail.
 */
const sans = Roboto({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-archivo" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-anton" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-space-mono" });

export const fontVariables = `${sans.variable} ${serif.variable} ${mono.variable}`;
