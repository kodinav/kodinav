import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { Reveal } from "@/components/motion";
import { Chip } from "@/components/ui";
import { getPost, posts } from "@/data/posts";
import { getService } from "@/data/services";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [site.founder],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const relatedServiceLinks = (post.relatedServices ?? [])
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: site.founder },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  const crumbs = breadcrumbSchema([
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  const related = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <article className="bg-noise relative overflow-hidden pt-40 pb-8 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal className="flex flex-col gap-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> All articles
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-xs text-faint">
              <Chip>{post.tag}</Chip>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTime} read</span>
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-muted">
              {post.excerpt}
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col gap-10 border-t border-line pt-12">
            {post.sections.map((section, i) => (
              <Reveal key={i} y={16}>
                <section>
                  {section.heading && (
                    <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className="mb-4 text-pretty text-[1.06rem] leading-relaxed text-muted"
                    >
                      {p}
                    </p>
                  ))}
                </section>
              </Reveal>
            ))}
          </div>

          {relatedServiceLinks.length > 0 && (
            <Reveal className="mt-12 border-t border-line pt-8">
              <p className="annotation mb-4">Related services</p>
              <div className="flex flex-wrap gap-2.5">
                {relatedServiceLinks.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="border border-line-strong px-4 py-2 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-accent hover:text-accent"
                  >
                    {s.name} →
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal className="mt-12 border-t border-line pt-8">
            <p className="text-sm text-faint">
              Written by{" "}
              <span className="text-foreground">{site.founder}</span>, founder
              of {site.name}, an independent software studio. Need this built
              properly?{" "}
              <Link href="/contact" className="u-draw text-accent">
                Book a free discovery call
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </article>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-faint">
          Keep reading
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card-hover glass block rounded-2xl p-6"
            >
              <p className="mb-2 text-xs text-faint">{p.tag}</p>
              <h3 className="font-semibold tracking-tight">{p.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
