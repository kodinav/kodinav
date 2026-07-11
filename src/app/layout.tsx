import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Instrument_Serif, Space_Mono } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

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
    default: `${site.name} — ${site.tagline} | Websites, Web Apps & Mobile Apps`,
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
  slogan: "We build software that helps businesses grow.",
  founder: {
    "@type": "Person",
    name: site.founder,
    jobTitle: "Founder & Software Engineer",
  },
  foundingDate: "2024",
  areaServed: { "@type": "Country", name: "India" },
  availableLanguage: ["English", "Hindi"],
  priceRange: "₹₹₹",
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  knowsAbout: [
    "Web Development",
    "Custom Software Development",
    "Mobile App Development",
    "Learning Management Systems",
    "E-Commerce Development",
    "AI Integration",
    "CRM Development",
    "ERP Development",
  ],
  makesOffer: [
    "Business Websites",
    "Custom Web Applications",
    "Mobile Apps",
    "Learning Management Systems",
    "E-Commerce",
    "AI Integrations",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
