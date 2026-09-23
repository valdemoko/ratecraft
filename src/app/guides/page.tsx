import type { Metadata } from "next";
import Link from "next/link";
import { guides, guideSections } from "@/lib/guides";
import { site } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contractor Pricing & Estimating Guides",
  description:
    "Practical guides on contractor pricing: markup vs margin, how to price a job, labor burden, billable hours, discounts and job costing — with worked examples.",
  alternates: { canonical: `${site.url}/guides` },
};

export default function GuidesIndex() {
  const sections = guideSections();

  return (
    <div className="container page-pad">
      <Breadcrumbs items={[{ name: "Guides" }]} />
      <div className="prose">
        <span className="eyebrow eyebrow-rule">Guides</span>
        <h1>Guides</h1>
        <p className="text-muted">
          {guides.length} guides on the numbers behind a price — what work costs, what it must
          earn, and what happens to the margin after the quote goes out. Each one pairs with a
          calculator, uses worked figures, and states the assumptions behind them.
        </p>
      </div>

      <div style={{ display: "grid", gap: "var(--space-7)", marginTop: "var(--space-6)" }}>
        {sections.map((section, si) => {
          const sectionGuides = section.slugs
            .map((slug) => guides.find((g) => g.slug === slug))
            .filter((g): g is (typeof guides)[number] => Boolean(g));
          if (sectionGuides.length === 0) return null;
          return (
            <section key={section.title} aria-labelledby={`guide-group-${si}`}>
              <div className="group-head">
                <span className="group-index">0{si + 1}</span>
                <h2 id={`guide-group-${si}`} style={{ fontSize: "1.25rem" }}>{section.title}</h2>
              </div>
              <p className="group-blurb text-small">{section.blurb}</p>
              <div
                style={{
                  display: "grid",
                  gap: "var(--space-4)",
                  marginTop: "var(--space-4)",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
                }}
              >
                {sectionGuides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="card"
                    style={{ padding: "var(--space-5)", color: "inherit", textDecoration: "none", display: "block" }}
                  >
                    <h3 style={{ fontSize: "1.1rem" }}>{g.title}</h3>
                    <p className="text-small text-muted" style={{ margin: 0 }}>{g.description}</p>
                    <p className="text-small" style={{ color: "var(--color-ink-faint)", margin: "var(--space-3) 0 0" }}>
                      {g.readingMinutes} min read
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="card card-pad mt-7" style={{ borderLeft: "3px solid var(--color-brass)" }}>
        <div className="calc-eyebrow-row">
          <div>
            <h2 style={{ fontSize: "var(--text-h3)", margin: 0 }}>Prefer to work with the numbers?</h2>
            <p className="text-muted text-small" style={{ margin: "var(--space-2) 0 0" }}>
              Every guide has a calculator that does the arithmetic with your own figures — free,
              no signup, and nothing leaves your browser.
            </p>
          </div>
          <Link href="/calculators" className="btn btn-secondary">All calculators →</Link>
        </div>
      </section>
    </div>
  );
}
