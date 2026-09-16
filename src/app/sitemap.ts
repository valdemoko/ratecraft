import type { MetadataRoute } from "next";
import { tools, categories, site } from "@/lib/site";
import { guides } from "@/lib/guides";

/**
 * Only URLs we actually want indexed: home, calculators hub, tool pages,
 * category pages, guides hub + guide articles, and legal/informational pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Static lastmod: a date that changes on every deploy is a low-quality signal.
  // Bumped on meaningful content changes (this one: static prerender + interlinking pass).
  const lastmod = new Date("2026-09-16");

  // Only indexable pages. Legal/utility pages (/privacy, /terms, /cookies,
  // /disclaimer) carry noindex,follow and must NOT appear here.
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: lastmod, changeFrequency: "weekly", priority: 1.0 },
    { url: `${site.url}/calculators`, lastModified: lastmod, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/guides`, lastModified: lastmod, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/about`, lastModified: lastmod, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/contact`, lastModified: lastmod, changeFrequency: "yearly", priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${site.url}/calculators/${t.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${site.url}/${c.slug}`,
    lastModified: lastmod,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    lastModified: new Date(g.updated),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...guidePages];
}
