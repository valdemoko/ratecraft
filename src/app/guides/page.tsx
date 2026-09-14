import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { site } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contractor Pricing & Estimating Guides",
  description:
    "Practical guides on contractor pricing: markup vs margin, how to price a job, labor burden, overhead recovery and estimating — with worked examples.",
  alternates: { canonical: `${site.url}/guides` },
};

export default function GuidesIndex() {
  return (
    <div className="container page-pad">
      <Breadcrumbs items={[{ name: "Guides" }]} />
      <div className="prose">
        <h1>Guides</h1>
        <p>
          Deep dives on contractor pricing and estimating — worked examples, real numbers, and
          links to the calculator for each decision.
        </p>
      </div>
      <div style={{ display: "grid", gap: "var(--space-4)", marginTop: "var(--space-6)", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}>
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="card"
            style={{ padding: "var(--space-5)", color: "inherit", textDecoration: "none", display: "block" }}
          >
            <h2 style={{ fontSize: "1.1rem" }}>{g.title}</h2>
            <p className="text-small text-muted" style={{ margin: 0 }}>{g.description}</p>
            <p className="text-small" style={{ color: "var(--color-ink-faint)", margin: "var(--space-3) 0 0" }}>
              {g.readingMinutes} min read
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
