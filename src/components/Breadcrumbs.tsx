import Link from "next/link";

/**
 * Visible breadcrumb trail for interior pages. Pairs with the
 * BreadcrumbList JSON-LD already emitted on these pages — this is the
 * on-screen half, which helps orientation and gives Google anchor-text
 * context between the hub and its spokes.
 */
export function Breadcrumbs({
  items,
  home = { name: "Home", href: "/" },
}: {
  items: { name: string; href?: string }[];
  /** Root crumb — translated pages point this at their own language home. */
  home?: { name: string; href: string };
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
        <li>
          <Link href={home.href} className="transition-colors hover:text-accent">
            {home.name}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-x-2">
            <span aria-hidden>/</span>
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="transition-colors hover:text-accent">
                {item.name}
              </Link>
            ) : (
              <span className="text-muted" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
