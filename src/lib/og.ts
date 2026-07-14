import { site } from "@/data/site";

/**
 * Branded OG card for a page. Next merges metadata shallowly, so any page
 * that sets its own `openGraph` block replaces the root one entirely and
 * loses the file-convention image — every such page must pass images
 * explicitly or its social shares render as bare links.
 */
export function ogImage(title: string, tag?: string) {
  const params = new URLSearchParams({ title });
  if (tag) params.set("tag", tag);
  return [
    {
      url: `/og?${params.toString()}`,
      width: 1200,
      height: 630,
      alt: `${title} — ${site.name}`,
    },
  ];
}
