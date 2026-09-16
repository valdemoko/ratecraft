import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tools, getTool, getCategory, site, workedExamples, moreExamples, continueWith } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import MarkupCalculator from "@/components/calculators/MarkupCalculator";
import MarginCalculator from "@/components/calculators/MarginCalculator";
import JobPricingCalculator from "@/components/calculators/JobPricingCalculator";
import LaborBurdenCalculator from "@/components/calculators/LaborBurdenCalculator";
import HourlyRateCalculator from "@/components/calculators/HourlyRateCalculator";
import OverheadCalculator from "@/components/calculators/OverheadCalculator";
import BreakEvenCalculator from "@/components/calculators/BreakEvenCalculator";
import FlatRateCalculator from "@/components/calculators/FlatRateCalculator";

import { guides } from "@/lib/guides";

export const dynamicParams = false;

/** Guide slug → display title for related-guide cards. */
const GUIDE_TITLES: Record<string, string> = Object.fromEntries(
  guides.map((g) => [`guides/${g.slug}`, g.title]),
);

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const url = `${site.url}/calculators/${tool.slug}`;
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: tool.metaTitle, description: tool.metaDescription, url, type: "website" },
    twitter: { card: "summary_large_image", title: tool.metaTitle, description: tool.metaDescription },
  };
}

const calculators: Record<string, React.ComponentType<{ prefill?: Record<string, string> }>> = {
  "markup-calculator": MarkupCalculator,
  "margin-calculator": MarginCalculator,
  "job-pricing-calculator": JobPricingCalculator,
  "labor-burden-calculator": LaborBurdenCalculator,
  "hourly-rate-calculator": HourlyRateCalculator,
  "overhead-calculator": OverheadCalculator,
  "break-even-calculator": BreakEvenCalculator,
  "flat-rate-calculator": FlatRateCalculator,
};

/** Per-tool supporting content. Specific and honest — no filler. */
const support: Record<string, { mistakes: string[]; whenToUse: string; meaning: string }> = {
  "markup-calculator": {
    meaning:
      "The recommended price is the amount that recovers every cost you entered plus the profit your markup implies. The margin next to it is the share of that price you keep — compare it against your overhead as a percentage of revenue to see what's left for net profit.",
    whenToUse:
      "Use it when you know your costs and think in markup — and want to see what that markup really means as a margin before the quote goes out.",
    mistakes: [
      "Treating markup and margin as interchangeable — a 20% markup is a 16.7% margin.",
      "Forgetting overhead entirely: a price that covers only labor and materials loses money on every job.",
      "Copying a competitor's markup without knowing their cost structure is nothing like yours.",
    ],
  },
  "margin-calculator": {
    meaning:
      "The margin is the share of the selling price left after direct costs — the pool that pays overhead before anything becomes net profit. The equivalent markup shows the same profit measured against cost, which is why it's always the bigger number.",
    whenToUse:
      "Use it to sanity-check a quote before sending it, or to back into the right price from a margin goal.",
    mistakes: [
      "Pricing to a margin by multiplying — Cost × (1 + margin) understates the price; divide instead.",
      "Reading the margin off a bid without checking what overhead comes out of it first.",
    ],
  },
  "job-pricing-calculator": {
    meaning:
      "The recommended price is built bottom-up: every direct cost, an overhead allowance, then your target margin applied by division. The gross profit line is what the job leaves for the business before net income.",
    whenToUse:
      "Use it to price a full job from its real parts: labor, materials, subs, travel, overhead and your target margin.",
    mistakes: [
      "Quoting labor at the bare wage instead of the burdened rate.",
      "Leaving out small direct costs — disposal, permits, extra trips — that eat the margin.",
      "Recovering overhead 'when there's profit left over', which is never.",
    ],
  },
  "labor-burden-calculator": {
    meaning:
      "The burdened hourly cost is what one hour of this employee's billable work truly costs the business: wage, taxes, insurance, benefits and non-billable time all spread across the hours that actually produce revenue.",
    whenToUse:
      "Use it before any estimate that includes employee labor, to find the hourly cost you should actually be quoting.",
    mistakes: [
      "Dividing total cost by paid hours instead of billable hours — PTO and admin time quietly inflate the real rate.",
      "Guessing workers' comp instead of checking your actual class code rate.",
    ],
  },
  "hourly-rate-calculator": {
    meaning:
      "The rate is a floor: the revenue per billable hour you need to hit your income goal and cover expenses. Anything below it, and you're paying for the privilege of working.",
    whenToUse:
      "Use it to set or re-check your solo hourly rate from what you need to earn — not from what competitors advertise.",
    mistakes: [
      "Assuming 40 billable hours a week — quoting, admin and supply runs typically cut that to 20–25.",
      "Forgetting that your rate must also cover taxes, insurance and slow months.",
    ],
  },
  "overhead-calculator": {
    meaning:
      "The per-hour rate is the slice of rent, insurance, vehicles and software every billable hour must carry. Add it to your burdened labor rate, or recover it inside your markup — but recover it on purpose.",
    whenToUse:
      "Use it to see what your business costs each month independent of any job, and what every hour must carry.",
    mistakes: [
      "Mixing job-specific costs into overhead (double-counting) or leaving recurring costs out.",
      "Never turning the total into a per-hour or per-job number, so it never gets recovered.",
    ],
  },
  "flat-rate-calculator": {
    meaning:
      "The flat-rate price is what the job costs you — burdened labor, the trip, parts, overhead — divided so the price keeps your target margin. The profit row is real dollars toward net income; the achieved margin is measured on the final rounded price you actually quote, which is why it sits a hair above target.",
    whenToUse:
      "Use it to price recurring service calls and small repairs as one fixed number — water heaters, fan installs, capacitor swaps, TV mounts — where the customer wants the price before you arrive.",
    mistakes: [
      "Using the technician's wage instead of the burdened rate — payroll taxes and comp don't pay themselves.",
      "Marking parts up 2.5× and then applying a margin on top — profit gets double-counted and the price scares customers off.",
      "Letting the trip be free: fuel, van wear and drive time are real costs every call must carry.",
    ],
  },
  "break-even-calculator": {
    meaning:
      "The break-even number is how many jobs of your average size it takes to cover fixed costs. Contribution margin shows what share of each job's price is fighting fixed costs; everything after job N is margin toward profit.",
    whenToUse:
      "Use it to know how many jobs a month keep the lights on — before you set growth or income goals.",
    mistakes: [
      "Counting variable costs as fixed (or vice versa) — the answer moves a lot with that classification.",
      "Using an 'average job' that's really your best job; be honest about the mix.",
    ],
  },
};

export default async function CalculatorPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ example?: string }>;
}) {
  const [{ slug }, { example }] = await Promise.all([params, searchParams]);
  const tool = getTool(slug);
  const Calculator = calculators[slug];
  if (!tool || !Calculator) notFound();

  const category = getCategory(tool.category);
  const url = `${site.url}/calculators/${tool.slug}`;
  const extra = support[slug];

  // Worked example: canonical one for the page, plus optional ?example= prefill.
  // Prefill URLs are noindex-fallback safe: canonical stays the clean URL, so no
  // duplicate-URL SEO risk. Values are validated by the calculators themselves.
  const canonicalExample = workedExamples[slug];
  const extraExamples = moreExamples[slug] ?? [];
  const prefill =
    example && canonicalExample && canonicalExample.key === example
      ? canonicalExample.prefill
      : example
        ? extraExamples.find((e) => e.key === example)?.prefill
        : undefined;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any (web browser)",
      description: tool.metaDescription,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const related = [
    ...(continueWith[slug] ? [continueWith[slug]] : []),
    ...tool.related
      .filter((r): r is string => !r.startsWith("guides/"))
      .map((r) => getTool(r))
      .filter((t): t is NonNullable<typeof t> => Boolean(t))
      .map((t) => ({ slug: t.slug, question: t.name, action: `Open ${t.name.replace("Contractor ", "")}` })),
  ]
    // dedupe by slug, keep continueWith first
    .filter((item, i, arr) => arr.findIndex((x) => x.slug === item.slug) === i)
    .slice(0, 3);

  const relatedGuides = tool.related.filter((r) => r.startsWith("guides/"));

  return (
    <div className="container page-pad">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { name: category?.name ?? "Calculators", href: `/${category?.slug}` },
          { name: tool.name },
        ]}
      />

      {/* Print header — only visible in printed output */}
      <div className="print-only">
        {tool.name} — {site.name} · Printed {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} ·
        Estimates are planning figures, see {site.url}/disclaimer
      </div>

      <header className="prose calc-shell" style={{ marginBottom: "var(--space-6)" }}>
        <div className="calc-eyebrow-row">
          <span className="eyebrow eyebrow-rule">{category?.name}</span>
          <span className="badge">{tool.formulas.length} formulas shown</span>
        </div>
        <h1>{tool.name}</h1>
        <p className="text-muted" style={{ fontSize: "1.08rem", marginBottom: 0 }}>{tool.intro}</p>
      </header>

      <div className="calc-shell">
        <Calculator prefill={prefill} />
      </div>

      {/* Worked example */}
      {canonicalExample && (
        <section aria-labelledby="example-h" className="mt-7 calc-shell">
          <span className="eyebrow">Worked example</span>
          <h2 id="example-h">{canonicalExample.trade}: where the number comes from</h2>
          <div className="grid-2">
            <div className="prose" style={{ maxWidth: "none" }}>
              <p>{canonicalExample.scenario}</p>
              <div className="table-wrap card">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Input</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {canonicalExample.inputs.map((i) => (
                      <tr key={i.label}>
                        <td>{i.label}</td>
                        <td className="num">{i.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p><strong>Result: {canonicalExample.result}</strong></p>
              <p className="text-small text-muted">{canonicalExample.explanation}</p>
              <Link
                href={`/calculators/${slug}?example=${canonicalExample.key}`}
                className="btn btn-secondary"
              >
                Load this example into the calculator
              </Link>
            </div>
            <div className="card card-pad">
              <h3 style={{ fontSize: "var(--text-h3)" }}>The calculation</h3>
              <div className="table-wrap">
                <table>
                  <tbody>
                    {canonicalExample.steps.map((s) => (
                      <tr key={s.label}>
                        <td>{s.label}</td>
                        <td className="num">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Additional worked examples, loadable into the calculator */}
      {extraExamples.length > 0 && (
        <section aria-labelledby="more-examples-h" className="mt-6 calc-shell">
          <h2 id="more-examples-h" style={{ fontSize: "var(--text-h3)" }}>
            More worked examples
          </h2>
          <p className="text-small text-muted" style={{ margin: "var(--space-2) 0 var(--space-3)" }}>
            All examples are illustrative — real inputs come from your own costs. Each loads
            into the calculator above.
          </p>
          <div className="grid-cards">
            {extraExamples.map((e) => (
              <Link
                key={e.key}
                href={`/calculators/${slug}?example=${e.key}`}
                className="card card-pad card-link tool-card"
              >
                <div style={{ fontWeight: 600 }}>{e.trade}</div>
                <div className="text-small text-muted">{e.result}</div>
                <div className="card-cta">Load this example →</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <AdSlot format="horizontal" />

      <div className="grid-2 mt-7 calc-shell">
        <section aria-labelledby="how-block">
          <div className="prose" style={{ maxWidth: "none" }}>
            <h2 id="how-block" style={{ fontSize: "var(--text-h3)" }}>How this calculator works</h2>
            <p>
              Every result comes from the formulas below — the math shown is the math used.
              Change any input and results update instantly in your browser; nothing is sent to
              a server.
            </p>
            <ul>
              {tool.formulas.map((f) => (
                <li key={f.label} style={{ marginBottom: "var(--space-3)" }}>
                  <strong>{f.label}:</strong> <code>{f.formula}</code>
                  {f.note && <div className="text-small text-muted">{f.note}</div>}
                </li>
              ))}
            </ul>
            {extra && (
              <>
                <h3 style={{ fontSize: "var(--text-h3)" }}>What the result means</h3>
                <p>{extra.meaning}</p>
                <h3 style={{ fontSize: "var(--text-h3)" }}>When to use it</h3>
                <p>{extra.whenToUse}</p>
              </>
            )}
            {/* Native guide link — rendered in the static markup, so crawlers see it. */}
            {relatedGuides.length > 0 && (
              <p style={{ marginTop: "var(--space-4)" }}>
                Want the concept behind the math in depth? Read{" "}
                {relatedGuides.map((g, i) => (
                  <span key={g}>
                    {i > 0 && " or "}
                    <Link href={`/${g}`}>
                      {GUIDE_TITLES[g] ?? "our contractor pricing guide"}
                    </Link>
                  </span>
                ))}
                .
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="mistakes-block">
          <div className="prose" style={{ maxWidth: "none" }}>
            <h2 id="mistakes-block" style={{ fontSize: "var(--text-h3)" }}>Common mistakes</h2>
            {extra && (
              <ul>
                {extra.mistakes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <section aria-labelledby="faq" className="mt-7 calc-shell">
        <div className="prose">
          <h2 id="faq">Frequently asked questions</h2>
          {tool.faqs.map((f) => (
            <section key={f.q} style={{ marginBottom: "var(--space-4)" }}>
              <h3 style={{ fontSize: "1.05rem" }}>{f.q}</h3>
              <p>{f.a}</p>
            </section>
          ))}
        </div>
      </section>

      {/* Continue the chain */}
      {continueWith[slug] && (
        <section aria-labelledby="next-h" className="mt-7 calc-shell">
          <div className="card card-pad" style={{ background: "var(--color-accent-soft)", borderColor: "var(--color-accent-border)" }}>
            <span className="eyebrow">Next step</span>
            <h2 id="next-h" style={{ fontSize: "var(--text-h3)", marginBottom: "var(--space-2)" }}>
              {continueWith[slug].question}
            </h2>
            <Link
              href={`/calculators/${continueWith[slug].slug}`}
              className="btn btn-primary"
            >
              {continueWith[slug].action} →
            </Link>
          </div>
        </section>
      )}

      <section aria-labelledby="related" className="mt-7 calc-shell">
        <h2 id="related">Related tools and guides</h2>
        <div className="grid-cards" style={{ marginTop: "var(--space-4)" }}>
          {related.map((r) => (
            <Link key={r.slug} href={`/calculators/${r.slug}`} className="card card-pad card-link tool-card">
              <div style={{ fontWeight: 600 }}>{r.question}</div>
              <div className="card-cta">{r.action} →</div>
            </Link>
          ))}
          {relatedGuides.map((g) => (
            <Link key={g} href={`/${g}`} className="card card-pad card-link tool-card">
              <div style={{ fontWeight: 600 }}>
                {GUIDE_TITLES[g] ?? "Contractor pricing guide"}
              </div>
              <div className="card-cta">Read the guide →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card card-pad mt-6 print-hide calc-shell">
        <p className="text-small text-muted" style={{ margin: 0 }}>
          {tool.name} is part of {site.name}, a set of free pricing and estimating tools for
          contractors and service businesses. Results are calculated entirely in your browser
          and are estimates for planning purposes — see our{" "}
          <Link href="/disclaimer">disclaimer</Link> and <Link href="/about">methodology</Link>.
        </p>
      </section>
    </div>
  );
}
