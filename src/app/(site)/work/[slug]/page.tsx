import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PhoneShot, ProjectShot } from "@/components/ProjectVisual";
import { Chip, Eyebrow, SectionHeading } from "@/components/ui";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const title = `${project.name} — ${project.category} Case Study`;
  return {
    title,
    description: project.summary,
    keywords: [
      project.name,
      project.category,
      project.industry,
      ...project.stack,
      "case study",
      "Kodinav",
    ],
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description: project.summary,
      url: `${site.url}/work/${project.slug}`,
      images: [{ url: project.images.cover.src, alt: project.images.cover.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.summary,
      images: [project.images.cover.src],
    },
  };
}

const narrativeSections = [
  { key: "problem", label: "The Problem" },
  { key: "research", label: "Research" },
  { key: "planning", label: "Planning" },
  { key: "design", label: "Design" },
  { key: "development", label: "Development" },
] as const;

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const otherProjects = projects.filter((p) => p.slug !== slug).slice(0, 2);

  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${project.name} — Case Study`,
    description: project.summary,
    image: `${site.url}${project.images.cover.src}`,
    mainEntityOfPage: `${site.url}/work/${project.slug}`,
    // Reference the sitewide Person/Organization nodes instead of re-declaring them
    author: { "@id": `${site.url}/#founder` },
    publisher: { "@id": `${site.url}/#studio` },
  };

  const crumbs = breadcrumbSchema([
    { name: "Work", path: "/work" },
    { name: project.name, path: `/work/${project.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      {/* Hero */}
      <section className="bg-noise relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div
          aria-hidden
          className="orb -top-24 left-1/2 h-96 w-160 -translate-x-1/2 opacity-30"
          style={{ background: project.accent }}
        />
        <div className="relative mx-auto max-w-4xl px-6">
          <Reveal className="flex flex-col gap-6">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> All work
            </Link>
            <Eyebrow>
              {project.industry} · {project.year}
            </Eyebrow>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {project.name}
            </h1>
            <p className="prose-justify max-w-2xl text-lg leading-relaxed text-muted">
              {cs.overview}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hero visual */}
      <section className="mx-auto max-w-5xl px-6">
        <Reveal>
          <ProjectShot
            image={project.images.cover}
            caption={project.url ?? project.name}
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        </Reveal>
      </section>

      {/* Results strip */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cs.results.map((r) => (
            <StaggerItem key={r.label}>
              <div className="glass h-full rounded-2xl p-6 text-center">
                <p
                  className="text-3xl font-semibold tracking-tight"
                  style={{ color: project.accent }}
                >
                  {r.metric}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{r.label}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-4 text-center text-xs text-faint">
          Capabilities and figures reflect what was designed and shipped; any
          numbers shown appear on the live product.
        </p>
      </section>

      {/* Narrative */}
      <section className="mx-auto max-w-3xl px-6 pb-8">
        <div className="flex flex-col gap-16">
          {narrativeSections.map((s, i) => (
            <Reveal key={s.key}>
              <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:gap-8">
                <p className="font-mono text-sm text-faint">
                  {String(i + 1).padStart(2, "0")} —{" "}
                  <span className="text-accent-soft">{s.label}</span>
                </p>
                <div>
                  <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                    {s.label}
                  </h2>
                  <p className="prose-justify leading-relaxed text-muted">
                    {cs[s.key]}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Challenges & solutions */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Engineering"
            title="Challenges worth mentioning."
          />
        </Reveal>
        <Stagger className="mt-10 grid gap-4 lg:grid-cols-2">
          {cs.challenges.map((c, i) => (
            <StaggerItem key={i}>
              <div className="glass h-full rounded-2xl p-7">
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-faint">
                  Challenge
                </p>
                <p className="mb-4 font-medium leading-relaxed">{c.challenge}</p>
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-accent-soft">
                  Solution
                </p>
                <p className="text-sm leading-relaxed text-muted">{c.solution}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Gallery — real screenshots */}
      <section className="border-y border-line-strong bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal>
            <SectionHeading eyebrow="Gallery" title="Across every screen." />
          </Reveal>

          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.55fr_1fr]">
            <Reveal>
              <ProjectShot
                image={project.images.desktop[0] ?? project.images.cover}
                caption={`${project.name} — desktop`}
                sizes="(max-width: 1024px) 100vw, 620px"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {project.images.mobile.slice(0, 2).map((img, i) => (
                  <PhoneShot
                    key={img.src}
                    image={img}
                    className={i === 1 ? "mt-8" : ""}
                  />
                ))}
              </div>
            </Reveal>
          </div>

          {project.images.desktop.length > 1 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {project.images.desktop.slice(1).map((img) => (
                <Reveal key={img.src}>
                  <ProjectShot
                    image={img}
                    caption={project.name}
                    sizes="(max-width: 640px) 100vw, 460px"
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Outcome */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <Eyebrow>Business Outcome</Eyebrow>
          <p className="mt-6 text-pretty text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl">
            {cs.outcome}
          </p>
        </Reveal>
      </section>

      {/* More work */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal>
            <SectionHeading eyebrow="More Work" title="Other projects." />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {otherProjects.map((p) => (
              <Reveal key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="card-hover glass group flex h-full flex-col gap-3 rounded-2xl p-7"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-faint">
                    {p.industry}
                  </p>
                  <h3 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                    {p.name}
                    <ArrowUpRight className="size-4 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-soft" />
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{p.summary}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Facing a similar problem?"
        lead="If any part of this case study sounded familiar, a discovery call is the fastest way to find out what a solution would look like for your business."
      />
    </>
  );
}
