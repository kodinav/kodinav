import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Chip, Eyebrow } from "@/components/ui";
import { WorkList } from "@/components/WorkList";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { metaDescription } from "@/lib/seo";
import { capitalize, numberWord } from "@/lib/words";

export const metadata: Metadata = {
  title: "Work — Case Studies of Real Software Projects",
  description: metaDescription(
    "Real software built by Kodinav: Lighthouse Classes (language-learning LMS), Achiever's Hive (EdTech platform), Triplipi (travel discovery platform) and Trinket (e-commerce store). Each case study covers the problem, the build and the outcome.",
  ),
  keywords: [
    "software development case studies",
    "web development portfolio India",
    "custom LMS case study",
    "e-commerce development case study",
    "Next.js portfolio",
    ...projects.map((p) => p.name),
  ],
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work — Case Studies | Kodinav",
    description: "Real, running software built end to end: education platforms, a travel product and an online store.",
    url: `${site.url}/work`,
    type: "website",
    images: ogImage("Real projects, real outcomes", "Selected Work"),
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Work — Kodinav Case Studies",
  url: `${site.url}/work`,
  hasPart: projects.map((p) => ({
    "@type": "CreativeWork",
    name: p.name,
    about: p.industry,
    url: `${site.url}/work/${p.slug}`,
    description: p.summary,
  })),
};

export default function WorkPage() {
  const items = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    industry: p.industry.split(" · ")[0],
    year: p.year,
    summary: p.summary,
    cover: p.images.cover,
    url: p.url,
  }));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <section className="mx-auto max-w-[1440px] px-5 pt-36 pb-12 sm:px-8 sm:pt-44">
        <div className="max-w-4xl" data-reveal>
          <Eyebrow>Featured Work — No. 00</Eyebrow>
          <h1 className="mt-6 text-balance text-[clamp(2.6rem,6.4vw,6.6rem)] leading-[0.95]">
            Real, running <span className="text-gradient">software</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
            {capitalize(numberWord(projects.length))} projects you can actually open: a publishing house with its own
            bookstore and research platform, two learning platforms, a travel product, an online store, a dental clinic,
            an enterprise logistics platform and a consumer web app. Every case study follows the same honest structure:
            the business problem, what was built, and what changed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2" data-reveal>
          {projects.map((p, i) => (
            <article key={p.slug} className={`cover-card ${i % 3 === 0 ? "md:col-span-2" : ""}`}>
              <Link href={`/work/${p.slug}`} className="cover group">
                <Image
                  src={p.images.cover.src}
                  alt={p.images.cover.alt}
                  width={1600}
                  height={1000}
                  sizes={i % 3 === 0 ? "(max-width: 768px) 92vw, 90vw" : "(max-width: 768px) 92vw, 45vw"}
                  priority={i < 2}
                />
                <span className="cover-cap">
                  <span>
                    File {String(i + 1).padStart(3, "0")} · {p.name}
                  </span>
                  <span className="annotation">
                    {p.industry} · {p.year}
                  </span>
                </span>
              </Link>
              <div className="grid gap-4 px-1 pt-5 pb-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <div>
                  <h2 className="text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.02]">{p.name}</h2>
                  <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted">{p.summary}</p>
                </div>
                <div className="grid gap-3 text-sm">
                  <p>
                    <span className="annotation mb-1 block">Challenge</span>
                    <span className="text-muted">{p.challenge}</span>
                  </p>
                  <p>
                    <span className="annotation mb-1 block">Solution</span>
                    <span className="text-muted">{p.solution}</span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {p.stack.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-5">
                    <Link href={`/work/${p.slug}`} className="u-draw font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
                      View case study →
                    </Link>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="u-draw font-mono text-[0.6875rem] tracking-[0.16em] uppercase"
                      >
                        Visit live site ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 border-t border-line pt-12" data-reveal>
          <Eyebrow className="mb-8">Index · {projects.length} case files</Eyebrow>
          <WorkList items={items} />
        </div>
      </section>

      <CtaSection
        title="Your project could be next."
        lead="Every project above started with a discovery call and an honest scope. Yours can start the same way."
      />
    </>
  );
}
