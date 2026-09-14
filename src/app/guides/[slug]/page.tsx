import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, getGuide } from "@/lib/guides";
import { getTool, site } from "@/lib/site";
import { renderGuideBlock } from "@/components/GuideBlocks";
import Breadcrumbs from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const url = `${site.url}/guides/${guide.slug}`;
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url,
      type: "article",
      publishedTime: guide.updated,
    },
    twitter: { card: "summary_large_image", title: guide.metaTitle, description: guide.metaDescription },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = `${site.url}/guides/${guide.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.metaDescription,
      url,
      dateModified: guide.updated,
      author: { "@type": "Organization", name: site.name, url: site.url },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
      <div className="container" style={{ padding: "var(--space-7) var(--space-5)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ name: "Guides", href: "/guides" }, { name: guide.title }]} />
      <article className="prose guide-body">
        <header style={{ marginBottom: "var(--space-5)" }}>
          <span className="eyebrow">Guide</span>
          <h1>{guide.title}</h1>
          <p className="text-muted" style={{ fontSize: "1.08rem", fontFamily: "var(--font-sans)" }}>{guide.description}</p>
          <div className="guide-meta">
            <span className="badge">{guide.readingMinutes} min read</span>
            <span>Reviewed and updated {new Date(guide.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </header>

        {guide.body.map(renderGuideBlock)}

        <h2>Frequently asked questions</h2>
        {guide.faqs.map((f) => (
          <div key={f.q} style={{ marginBottom: "var(--space-4)" }}>
            <h3 style={{ fontSize: "1.05rem" }}>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <h2>Tools for this</h2>
        <ul>
          {guide.relatedTools.map((s) => {
            const t = getTool(s);
            return t ? (
              <li key={s}>
                <Link href={`/calculators/${t.slug}`}>{t.name}</Link>
              </li>
            ) : null;
          })}
        </ul>

        <h2>Keep reading</h2>
        <ul>
          {guide.relatedGuides.map((s) => {
            const g = getGuide(s);
            return g ? (
              <li key={s}>
                <Link href={`/guides/${g.slug}`}>{g.title}</Link>
              </li>
            ) : null;
          })}
        </ul>
      </article>
    </div>
  );
}
