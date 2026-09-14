import Link from "next/link";
import { site } from "@/lib/site";

export type Crumb = { name: string; href?: string };

/**
 * Visual breadcrumbs + matching BreadcrumbList JSON-LD.
 * JSON-LD uses absolute URLs (schema.org requires full URLs) and matches
 * exactly what is rendered on the page.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${site.url}${c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--space-4)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          listStyle: "none",
          margin: 0,
          padding: 0,
          fontSize: "0.85rem",
          color: "var(--color-ink-muted)",
        }}
      >
        {all.map((c, i) => (
          <li key={i} style={{ display: "flex", gap: 6 }}>
            {c.href ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
            {i < all.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
