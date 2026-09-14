import type { Metadata } from "next";
import Link from "next/link";
import { tools, site } from "@/lib/site";
import {
  IconMarkup,
  IconSheet,
  IconClock,
  IconPercent,
  IconHardHat,
  IconLayers,
  IconScale,
  IconArrow,
} from "@/components/icons";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "All Calculators for Contractors & Service Businesses",
  description:
    "Every free RateCraft calculator in one place: markup, margin, job pricing, labor burden, hourly rate, overhead and break-even tools for contractors.",
  alternates: { canonical: `${site.url}/calculators` },
};

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "markup-calculator": IconMarkup,
  "margin-calculator": IconPercent,
  "job-pricing-calculator": IconSheet,
  "flat-rate-calculator": IconSheet,
  "labor-burden-calculator": IconHardHat,
  "hourly-rate-calculator": IconClock,
  "overhead-calculator": IconLayers,
  "break-even-calculator": IconScale,
};

/** Problem-first organization: "which tool do I actually need?" */
const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Price the job",
    blurb:
      "You have costs and need a number to send to the customer. These four build or check a price — from a full job breakdown to a single flat rate for a service call.",
    slugs: ["job-pricing-calculator", "flat-rate-calculator", "markup-calculator", "margin-calculator"],
  },
  {
    title: "Understand your costs",
    blurb:
      "Before you can price anything, you need to know what an hour of your labor and a month of your business truly cost. These tools find the honest numbers.",
    slugs: ["labor-burden-calculator", "hourly-rate-calculator", "overhead-calculator"],
  },
  {
    title: "Protect the business",
    blurb:
      "Pricing decisions are business decisions. This one shows whether the work you're pricing can actually keep the lights on.",
    slugs: ["break-even-calculator"],
  },
];

export default function CalculatorsIndex() {
  return (
    <div className="container page-pad">
      <Breadcrumbs items={[{ name: "Calculators" }]} />
      <div className="prose">
        <span className="eyebrow eyebrow-rule">Calculators</span>
        <h1>Every RateCraft calculator</h1>
        <p className="text-muted">
          Free, browser-based tools for contractors and service businesses — organized by
          the problem you&apos;re solving. No signup, nothing stored, and every tool shows
          the formula behind its results.
        </p>
      </div>

      <div style={{ display: "grid", gap: "var(--space-7)", marginTop: "var(--space-6)" }}>
        {GROUPS.map((g, gi) => (
          <section key={g.title} aria-labelledby={`grp-${gi}`}>
            <div className="group-head">
              <span className="group-index">0{gi + 1}</span>
              <h2 id={`grp-${gi}`} style={{ fontSize: "1.25rem" }}>{g.title}</h2>
            </div>
            <p className="group-blurb text-small">{g.blurb}</p>
            <div className="grid-cards" style={{ marginTop: "var(--space-4)" }}>
              {g.slugs.map((slug) => {
                const t = tools.find((x) => x.slug === slug)!;
                const Icon = ICONS[slug] ?? IconSheet;
                const formulaCount = t.formulas.length;
                return (
                  <Link key={slug} href={`/calculators/${slug}`} className="card card-pad card-link tool-card">
                    <span className="tool-icon"><Icon /></span>
                    <h3 style={{ fontSize: "1.02rem" }}>{t.name}</h3>
                    <p>{t.intro.split(":")[0].split("—")[0]}.</p>
                    <p className="text-faint text-small">
                      {formulaCount} formula{formulaCount === 1 ? "" : "s"} shown
                      {t.faqs.length ? ` · ${t.faqs.length} FAQs` : ""}
                    </p>
                    <span className="card-cta">Open calculator →</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="card card-pad mt-7" style={{ borderLeft: "3px solid var(--color-brass)" }} aria-labelledby="calc-guide-h">
        <div className="calc-eyebrow-row">
          <div>
            <h2 id="calc-guide-h" style={{ fontSize: "var(--text-h3)", margin: 0 }}>
              Not sure which one you need?
            </h2>
            <p className="text-muted text-small" style={{ margin: "var(--space-2) 0 0" }}>
              The pricing guide walks the full chain from labor cost to profitable price.
            </p>
          </div>
          <Link href="/guides/how-to-price-a-job" className="btn btn-secondary">
            Read how to price a job <IconArrow className="btn-arrow" />
          </Link>
        </div>
      </section>
    </div>
  );
}
