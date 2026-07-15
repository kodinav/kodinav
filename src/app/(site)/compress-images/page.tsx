import type { Metadata } from "next";
import Link from "next/link";
import { ImageCompressor } from "@/components/ImageCompressor";
import { ToolShell } from "@/components/ToolShell";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema, faqSchema, toolSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free Image Compressor — In Your Browser, No Upload",
  description:
    "Compress images free with your choice of quality, size and format (WebP/JPEG), downloaded singly or as a ZIP — all on your device, nothing uploads.",
  keywords: [
    "image compressor",
    "compress image",
    "compress image for website",
    "reduce image size",
    "image compressor no upload",
    "webp converter",
    "compress jpg",
  ],
  alternates: { canonical: "/compress-images" },
  openGraph: {
    title: "Free Image Compressor — In Your Browser, No Upload",
    description:
      "Images compressed on your own device — nothing uploads. WebP output sized for the web, up to 20 at once, free.",
    url: `${site.url}/compress-images`,
    type: "website",
    images: ogImage("Compress images without uploading them", "Free Compressor"),
  },
};

const faqs = [
  {
    q: "Why compress images at all?",
    a: "Images are usually most of a page's weight. A photo straight off a phone is 3–8 MB; on a mid-range phone over mobile data that is seconds of staring at a blank space. Properly sized web images are 50–200 KB — twenty times lighter with no visible difference on screen.",
  },
  {
    q: "Are my photos uploaded to your server?",
    a: "No — that is the point of this tool. The resizing and compression run in your own browser using its built-in canvas engine. Your images never leave your device, which also makes it safe for photos you would not put on someone else's server.",
  },
  {
    q: "What does the compressor actually do?",
    a: "Two honest things: scales the image down to a maximum of 1920 pixels (larger is wasted on virtually every screen), and re-encodes it as WebP at 80% quality — a modern format every current browser supports that is dramatically smaller than JPEG at the same visual quality.",
  },
  {
    q: "Will I see a quality difference?",
    a: "On screen, at web sizes — no, for photos. Where you should keep originals: images for print, and graphics with hard edges or text, which sometimes prefer PNG. The tool tells you when a file was already small enough to keep as-is.",
  },
  {
    q: "My site is still slow after compressing images. What else is it?",
    a: "Then the weight is elsewhere: page-builder JavaScript, too many scripts, or slow hosting. Run the free speed test to see exactly where the seconds go.",
  },
];

export default function CompressImagesPage() {
  const schemas = [
    toolSchema("Image Compressor", "/compress-images", "Free in-browser image compressor: resize and WebP re-encode with no upload — images never leave the device."),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Free Tools", path: "/free-tools" },
      { name: "Image Compressor", path: "/compress-images" },
    ]),
  ];
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ToolShell
        eyebrow="Free Image Compressor"
        title={
          <>
            Compress images — without <span className="text-gradient">uploading them</span>.
          </>
        }
        lead="Heavy photos are the number one reason business websites load slowly. Drop yours here: resized for the web and re-encoded as WebP on your own device. Nothing is uploaded, ever."
        tool={<ImageCompressor />}
        middle={
          <section className="border-t border-line">
            <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
              <p className="text-center text-sm leading-relaxed text-muted">
                Compressed everything and still slow?{" "}
                <Link href="/website-speed-test" className="u-draw text-accent">
                  The free speed test
                </Link>{" "}
                shows where the remaining seconds go.
              </p>
            </div>
          </section>
        }
        faqs={faqs}
      />
    </>
  );
}
