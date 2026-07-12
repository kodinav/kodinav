import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { BlogList, type PostSummary } from "@/components/BlogList";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { posts } from "@/data/posts";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog — Software, Web Development, SEO & Business Growth",
  description:
    "Plain-language writing on software, web development, performance, SEO, AI and business growth. The advice Kodinav gives clients, from the engineer's side of the table.",
  keywords: [
    "software development blog",
    "web development India blog",
    "website performance",
    "SEO for business",
    "custom software advice",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Kodinav",
    description:
      "Writing on software, performance, SEO and business growth from an independent software studio.",
    url: `${site.url}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  // Ship only what the listing needs — not 26 full article bodies
  const summaries: PostSummary[] = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ slug, title, excerpt, date, readingTime, tag }) => ({
      slug,
      title,
      excerpt,
      date,
      readingTime,
      tag,
    }));

  return (
    <>
      <section className="bg-noise relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Blog — {posts.length} articles</Eyebrow>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Notes from the <span className="text-gradient">engineering side</span>.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Plain-language writing on software, performance, SEO and business
              growth. The advice I give clients, published.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <BlogList posts={summaries} />
      </section>

      <CtaSection />
    </>
  );
}
