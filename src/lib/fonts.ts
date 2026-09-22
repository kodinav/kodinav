import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

/**
 * The typefaces behind the site's frozen font variables. The variable names
 * never change (40 pages and the zh stylesheets bind to them); only the faces
 * bound here do.
 *
 *   --font-archivo    = Geist, the working grotesk: body and every headline.
 *   --font-anton      = Instrument Serif (italic), the editorial accent — one
 *                       word in a headline, a pull quote, a caption.
 *   --font-space-mono = Geist Mono, for labels, figures and file-like detail.
 *
 * Latin subsets only, no optical-size axes: three small files per page. The
 * rupee sign is served by a local() face in globals.css so it never pulls a
 * latin-ext file.
 */
const sans = Geist({ subsets: ["latin"], variable: "--font-archivo" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-anton" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-space-mono" });

export const fontVariables = `${sans.variable} ${serif.variable} ${mono.variable}`;
