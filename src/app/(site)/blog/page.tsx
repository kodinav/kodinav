import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Chip, Eyebrow } from "@/components/ui";
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <section className="bg-noise relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div
          aria-hidden
          className="orb -top-32 left-1/3 h-96 w-160"
          style={{ background: "var(--glow-blue)", opacity: 0.35 }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <Eyebrow>Blog</Eyebrow>
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
        <Stagger className="flex flex-col gap-4">
          {sorted.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="card-hover glass group block rounded-2xl p-7 sm:p-8"
              >
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-faint">
                  <Chip>{post.tag}</Chip>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingTime} read</span>
                </div>
                <h2 className="flex items-start justify-between gap-4 text-xl font-semibold tracking-tight sm:text-2xl">
                  {post.title}
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-soft" />
                </h2>
                <p className="mt-2 leading-relaxed text-muted">{post.excerpt}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaSection />
    </>
  );
}
