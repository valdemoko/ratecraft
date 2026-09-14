import type { MetadataRoute } from "next";
import { tools, categories, site } from "@/lib/site";
import { guides } from "@/lib/guides";

/**
 * Only URLs we actually want indexed: home, calculators hub, tool pages,
 * category pages, guides hub + guide articles, and legal/informational pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    "", "/calculators", "/guides", "/about", "/contact",
    "/privacy", "/terms", "/cookies", "/disclaimer",
  ].map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1.0 : 0.5,
  }));

  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${site.url}/calculators/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${site.url}/${c.slug}`,
    lastModified: now,
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
