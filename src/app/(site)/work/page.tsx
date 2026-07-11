import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Work — Case Studies of Real Software Projects",
  description:
    "Real software built by Kodinav: Lighthouse Classes (language-learning LMS), Achiever's Hive (EdTech platform), Triplipi (travel discovery platform) and Trinket (e-commerce store). Each case study covers the problem, the build and the outcome.",
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
    description:
      "Real, running software built end-to-end — education platforms, a travel product and an online store.",
    url: `${site.url}/work`,
    type: "website",
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="bg-noise relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Featured Work — Fig. 00</Eyebrow>
            <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl">
              Real, running <span className="text-gradient">software</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Four projects you can actually open — a language-learning platform,
              an EdTech library, a travel product and an online store. Every case
              study follows the same honest structure: the business problem, what
              was built, and what changed.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 0.05, 0.15)}>
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection
        title="Your project could be next."
        lead="Every project above started with a discovery call and an honest scope. Yours can start the same way."
      />
    </>
  );
}
