"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Chip } from "./ui";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Blog listing with tag filters — 26 posts is too many for one long scroll. */
export function BlogList({ posts }: { posts: PostSummary[] }) {
  const [activeTag, setActiveTag] = useState<string>("All");

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) counts.set(p.tag, (counts.get(p.tag) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [posts]);

  const filtered =
    activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);

  return (
    <>
      {/* Tag filter — horizontally scrollable on small screens */}
      <div
        role="tablist"
        aria-label="Filter articles by topic"
        className="scrollbar-none -mx-6 mb-10 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {["All", ...tags].map((tag) => (
          <button
            key={tag}
            role="tab"
            aria-selected={activeTag === tag}
            onClick={() => setActiveTag(tag)}
            className={`shrink-0 border px-3.5 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors ${
              activeTag === tag
                ? "border-foreground bg-foreground text-background"
                : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {tag}
            {tag === "All" && (
              <span className="ml-1.5 text-faint">{posts.length}</span>
            )}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {filtered.length} articles
        {activeTag !== "All" ? ` about ${activeTag}` : ""}
      </p>

      <div className="flex flex-col gap-4">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card-hover glass group block rounded-md p-7 sm:p-8"
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
        ))}
      </div>
    </>
  );
}
