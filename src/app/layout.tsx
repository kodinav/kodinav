import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Instrument_Serif, Space_Mono } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

// Re-generate prerendered pages at most every 5 minutes. This caps the
// s-maxage sent to Hostinger's CDN, so a fresh deploy stops being masked by
// year-long cached HTML that references deleted asset chunks.
export const revalidate = 300;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Extend the paper background under the iPhone notch / Dynamic Island;
  // fixed elements pad themselves with env(safe-area-inset-*).
  viewportFit: "cover",
  themeColor: "#efeae0",
};

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Website Development & Custom Web Apps | Independent Software Studio`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.founder, url: site.url }],
  creator: site.founder,
  publisher: site.name,
  alternates: { canonical: "/" },
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (and _BING) as env vars to verify
  // Search Console / Bing Webmaster Tools without touching code.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#studio`,
  name: site.name,
  alternateName: `${site.name} ${site.tagline}`,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.phoneRaw,
  image: `${site.url}/founder.jpg`,
  slogan: "We build software that helps businesses grow.",
  founder: { "@id": `${site.url}/#founder` },
  foundingDate: "2024",
  areaServed: [
    ...site.serviceAreas.map((name) => ({ "@type": "City", name })),
    { "@type": "Country", name: "India" },
    "Worldwide",
  ],
  availableLanguage: ["English", "Hindi"],
  priceRange: "₹₹₹",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Delhi NCR",
    addressCountry: "IN",
  },
  sameAs: ["https://github.com/kodinav"],
  knowsAbout: [
    "Website Development",
    "Custom Website Development",
    "Web Application Development",
    "Landing Page Development",
    "E-Commerce Development",
    "Mobile App Development",
    "React Development",
    "Next.js Development",
    "SEO-Friendly Website Development",
    "Learning Management Systems",
    "CRM Development",
    "ERP Development",
    "AI Integration",
  ],
  makesOffer: [
    "Business Website Development",
    "Custom Web Applications",
    "Landing Page Development",
    "E-Commerce Development",
    "Mobile Apps",
    "Website Redesign",
    "Website Maintenance",
    "Performance & SEO Optimization",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#founder`,
  name: site.founder,
  jobTitle: "Founder & Software Engineer",
  description:
    "Freelance web developer and full stack engineer in Delhi NCR, India. Founder of Kodinav. Builds websites, web applications and mobile apps with React, Next.js, Node.js and Flutter.",
  url: `${site.url}/about`,
  image: `${site.url}/founder.jpg`,
  email: site.email,
  telephone: site.phoneRaw,
  worksFor: { "@id": `${site.url}/#studio` },
  address: {
    "@type": "PostalAddress",
    addressRegion: "Delhi NCR",
    addressCountry: "IN",
  },
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Flutter",
    "PostgreSQL",
    "Website Development",
    "Full Stack Development",
  ],
  sameAs: ["https://github.com/kodinav"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  description: site.description,
  publisher: { "@id": `${site.url}/#studio` },
  inLanguage: "en-IN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${instrument.variable} ${spaceMono.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
        {/* GA4 — activates only when NEXT_PUBLIC_GA_ID is set (e.g. G-XXXXXXX) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
