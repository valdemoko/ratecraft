import type { Metadata } from "next";
import Link from "next/link";
import { tools, site } from "@/lib/site";
import { guides } from "@/lib/guides";
import {
  IconMarkup,
  IconSheet,
  IconClock,
  IconArrow,
  IconPercent,
  IconHardHat,
  IconLayers,
  IconScale,
} from "@/components/icons";
import HeroStream from "@/components/HeroStream";

export const metadata: Metadata = {
  title: "RateCraft — Contractor Pricing, Estimating & Profit Tools",
  description:
    "Free calculators for contractors and service businesses: markup, margin, job pricing, labor burden, overhead and break-even — with the formula behind every number.",
  alternates: { canonical: site.url },
};

/** Site-level structured data: what the site is and who stands behind it. */
const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description:
      "Independent publisher of free contractor pricing and estimating tools. Every calculator shows the formulas behind its results.",
    founder: {
      "@type": "Person",
      name: "Miguel Iglesias Valenzuela",
      sameAs: ["https://www.linkedin.com/in/miguel-iglesias-valenzuela-14069b367"],
    },
  },
];

const ESSENTIAL_SLUGS = ["markup-calculator", "job-pricing-calculator", "hourly-rate-calculator"];

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

const ESSENTIALS_COPY: Record<string, { who: string; get: string }> = {
  "markup-calculator": {
    who: "You know your costs and think in markup.",
    get: "Get the selling price, the profit in dollars, and what that markup really means as a margin.",
  },
  "job-pricing-calculator": {
    who: "You're pricing a whole job — labor, materials, subs, the lot.",
    get: "Get a recommended price built from a full cost breakdown plus your target margin.",
  },
  "hourly-rate-calculator": {
    who: "You work solo and set your own rate.",
    get: "Get the hourly rate that covers your income goal, your expenses and the hours you can actually bill.",
  },
};

const TOOLKIT_GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Price the job",
    blurb: "Turn job costs into a price that carries your margin.",
    slugs: ["markup-calculator", "margin-calculator", "job-pricing-calculator", "flat-rate-calculator"],
  },
  {
    title: "Understand your costs",
    blurb: "Know what an hour of work truly costs before you quote it.",
    slugs: ["labor-burden-calculator", "overhead-calculator", "hourly-rate-calculator"],
  },
  {
    title: "Protect the business",
    blurb: "See the numbers that decide whether the business itself works.",
    slugs: ["break-even-calculator"],
  },
];

const WORKSHEET: [string, string, string?][] = [
  ["Materials", "$1,000.00"],
  ["Labor", "$500.00"],
  ["Overhead", "$150.00"],
  ["Total cost", "$1,650.00", "strong"],
  ["Markup", "+25%"],
  ["Recommended price", "$2,062.50", "price"],
  ["Profit", "$412.50"],
  ["Margin", "20.0%"],
];

const TRADES = [
  "General contractors", "Electricians", "Plumbers", "HVAC contractors",
  "Roofers", "Painters", "Landscapers", "Handymen",
];

export default function HomePage() {
  const essentials = ESSENTIAL_SLUGS.map((s) => tools.find((t) => t.slug === s)!).filter(Boolean);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
 />
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <HeroStream />
        <div className="container hero-grid">
          <div className="reveal">
            <span className="eyebrow eyebrow-rule">Contractor pricing tools</span>
            <h1 className="display">
              Price your work with the numbers behind it.
            </h1>
            <p className="hero-sub">
              Burdened labor, overhead, markup, margin — the costs most quotes guess at.
              RateCraft turns them into a price you can defend, and shows the formula
              behind every figure it produces.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-5)" }}>
              <Link href="/calculators" className="btn btn-primary">
                Explore the calculators <IconArrow className="btn-arrow" />
              </Link>
              <Link href="#chain" className="btn btn-secondary">
                How the pricing works
              </Link>
            </div>
            <div className="hero-trust">
              <span><span className="tick">=</span> Every formula shown</span>
              <span><span className="tick">=</span> Runs in your browser</span>
              <span><span className="tick">=</span> No signup</span>
            </div>
          </div>

          {/* Hero visual: the product, as an estimate worksheet */}
          <div className="estimate-card" aria-hidden="true">
            <div className="estimate-head">
              <span>ESTIMATE — JOB #1042</span>
              <span>BATH REFRESH</span>
            </div>
            {WORKSHEET.map(([label, value, variant]) => (
              <div
                key={label}
                className={
                  variant === "price"
                    ? "estimate-row estimate-price"
                    : variant === "strong"
                      ? "estimate-row estimate-strong"
                      : "estimate-row"
                }
              >
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <div className="estimate-foot">
              A 25% markup carries a 20% margin — RateCraft shows both, always.
            </div>
          </div>
        </div>
      </section>

      {/* ── The problem ──────────────────────────────────── */}
      <section className="container section" aria-labelledby="prob-h">
        <div className="prose">
          <span className="eyebrow eyebrow-rule">The problem</span>
          <h2 id="prob-h">Pricing a job is more than adding up materials.</h2>
          <p className="text-muted" style={{ maxWidth: 680 }}>
            A job costs more than the supply-house invoice, and the price has to do more
            than cover it. Most underpriced work isn&apos;t lost on price — it&apos;s lost
            in the estimate.
          </p>
        </div>
        <div className="split-2col mt-6">
          <div className="card card-pad">
            <h3 style={{ fontSize: "var(--text-h3)" }}>What a job really costs</h3>
            <ul className="check-list">
              <li>Labor — at its true burdened rate, not just the wage</li>
              <li>Labor burden — payroll taxes, workers&apos; comp, benefits</li>
              <li>Materials, waste and delivery</li>
              <li>Subcontractors</li>
              <li>Overhead — insurance, trucks, software, office</li>
              <li>Travel, disposal, permits, rental gear</li>
            </ul>
          </div>
          <div className="card card-pad">
            <h3 style={{ fontSize: "var(--text-h3)" }}>What the price has to decide</h3>
            <ul className="check-list">
              <li>Markup vs. margin — they are not the same number</li>
              <li>A final price that survives contact with the customer</li>
              <li>Profit left after overhead takes its share</li>
            </ul>
            <p className="text-small text-muted">
              Miss these quietly and the business stays busy while it goes broke.
              RateCraft makes them visible before the quote goes out.
            </p>
          </div>
        </div>
      </section>

      {/* ── The chain ────────────────────────────────────── */}
      <section className="chain-section" id="chain" aria-labelledby="chain-h">
        <div className="container">
          <span className="eyebrow eyebrow-rule">The system</span>
          <h2 id="chain-h">From labor cost to profitable price</h2>
          <p className="text-muted" style={{ maxWidth: 660 }}>
            Pricing decisions cascade. Each RateCraft tool owns one link in this chain —
            and links to the next, so you can walk a number all the way from a wage to a
            profit.
          </p>
          <div className="math-flow" style={{ marginTop: "var(--space-5)" }}>
            {["Labor", "Burden", "Overhead", "Job cost", "Markup", "Price", "Margin", "Profit"].map((s, i) => (
              <span key={s} style={{ display: "contents" }}>
                {i > 0 && <span className="math-arrow" aria-hidden="true">→</span>}
                <span className={`math-step${i === 5 ? " highlight" : ""}`}>
                  <span className="step-label">{s}</span>
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Worked example ───────────────────────────────── */}
      <section className="container section" aria-labelledby="ex-h">
        <div className="grid-2">
          <div>
            <span className="eyebrow eyebrow-rule">A worked example</span>
            <h2 id="ex-h">See where the price comes from</h2>
            <p className="text-muted">
              A $1,500 bathroom refresh, priced honestly. Materials and labor are only the
              start: overhead rides on every job, and the markup exists to fund the
              business — not to pad the invoice.
            </p>
            <ul className="check-list">
              <li>
                <Link href="/calculators/job-pricing-calculator">Job Pricing Calculator</Link> —
                builds this full breakdown into a recommended price
              </li>
              <li>
                <Link href="/calculators/markup-calculator">Markup Calculator</Link> — what
                that 25% markup means as a margin (20%, not 25%)
              </li>
              <li>
                <Link href="/calculators/margin-calculator">Margin Calculator</Link> — check
                a quote&apos;s margin before the customer ever sees it
              </li>
            </ul>
          </div>
          <div className="estimate-card" aria-label="Worked pricing example">
            <div className="estimate-head"><span>WORKED EXAMPLE</span><span>FROM COST TO PRICE</span></div>
            {WORKSHEET.map(([label, value, variant]) => (
              <div
                key={label}
                className={
                  variant === "price"
                    ? "estimate-row estimate-price"
                    : variant === "strong"
                      ? "estimate-row estimate-strong"
                      : "estimate-row"
                }
              >
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <div className="estimate-foot">Math verified — see the methodology</div>
          </div>
        </div>
      </section>

      {/* ── Essentials ───────────────────────────────────── */}
      <section className="section-band" aria-labelledby="ess-h">
        <div className="container">
          <span className="eyebrow eyebrow-rule">Start here</span>
          <h2 id="ess-h">Start with the essentials</h2>
          <div className="grid-cards" style={{ marginTop: "var(--space-5)" }}>
            {essentials.map((t) => {
              const Icon = ICONS[t.slug] ?? IconSheet;
              const copy = ESSENTIALS_COPY[t.slug];
              return (
                <Link key={t.slug} href={`/calculators/${t.slug}`} className="card card-pad card-link tool-card reveal">
                  <span className="tool-icon"><Icon /></span>
                  <h3>{t.name}</h3>
                  <p><strong>{copy.who}</strong></p>
                  <p>{copy.get}</p>
                  <span className="card-cta">Open calculator →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Full toolkit, grouped by problem ─────────────── */}
      <section className="container section" aria-labelledby="toolkit-h">
        <span className="eyebrow eyebrow-rule">The toolkit</span>
        <h2 id="toolkit-h">Find the tool for your problem</h2>
        <div className="mt-6" style={{ display: "grid", gap: "var(--space-7)" }}>
          {TOOLKIT_GROUPS.map((g, gi) => (
            <div key={g.title}>
              <div className="group-head">
                <span className="group-index">0{gi + 1}</span>
                <h3 style={{ fontSize: "1.2rem" }}>{g.title}</h3>
              </div>
              <p className="group-blurb text-small">{g.blurb}</p>
              <div className="grid-cards" style={{ marginTop: "var(--space-4)" }}>
                {g.slugs.map((slug) => {
                  const t = tools.find((x) => x.slug === slug)!;
                  const Icon = ICONS[slug] ?? IconSheet;
                  return (
                    <Link key={slug} href={`/calculators/${slug}`} className="card card-pad card-link tool-card">
                      <span className="tool-icon"><Icon /></span>
                      <h4>{t.name}</h4>
                      <p>{t.intro.split(":")[0].split("—")[0]}.</p>
                      <span className="card-cta">Open calculator →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────── */}
      <section className="section-band section-band--deep" aria-labelledby="who-h">
        <div className="container">
          <span className="eyebrow eyebrow-rule">Who it&apos;s for</span>
          <h2 id="who-h">Built for service businesses</h2>
          <p className="text-muted" style={{ maxWidth: 700 }}>
            The inputs are the ones these businesses live with — burdened labor,
            workers&apos; comp, truck costs, non-billable hours. Trade-specific tools
            (electrical, plumbing, HVAC and more) are being added over time; the core
            pricing math below applies to every one of them today.
          </p>
          <div className="trade-chips" role="list">
            {TRADES.map((t) => (
              <span key={t} role="listitem" className="badge">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why RateCraft ────────────────────────────────── */}
      <section className="container section" aria-labelledby="why-h">
        <span className="eyebrow eyebrow-rule">Why RateCraft</span>
        <h2 id="why-h">What makes it different</h2>
        <div className="grid-cards mt-6">
          <div className="why-item">
            <h3>Show the math</h3>
            <p className="text-small text-muted">
              Formulas are printed next to results — including the markup-margin conversion
              that quietly costs contractors thousands.
            </p>
          </div>
          <div className="why-item">
            <h3>Understand the full cost</h3>
            <p className="text-small text-muted">
              Labor at its burdened rate, overhead per billable hour — not generic
              &quot;revenue vs. COGS&quot; inputs.
            </p>
          </div>
          <div className="why-item">
            <h3>Price for profit</h3>
            <p className="text-small text-muted">
              Tools don&apos;t stop at cost: they end at a price, a margin and the profit
              you keep.
            </p>
          </div>
          <div className="why-item">
            <h3>Free and practical</h3>
            <p className="text-small text-muted">
              No signup, no email gate, nothing stored. Open a calculator, get your
              number, close the tab.
            </p>
          </div>
        </div>
      </section>

      {/* ── Methodology ──────────────────────────────────── */}
      <section className="container" aria-labelledby="meth-h" style={{ paddingBottom: "var(--space-7)" }}>
        <div className="card card-pad" style={{ borderLeft: "3px solid var(--color-brass)" }}>
          <div className="grid-2">
            <div>
              <span className="eyebrow eyebrow-rule">Methodology</span>
              <h2 id="meth-h" style={{ fontSize: "var(--text-h2)" }}>How we calculate</h2>
              <p className="text-muted">
                Standard accounting definitions of markup, margin, burden and break-even;
                formulas, assumptions and limitations listed on every tool page. Cited
                ranges (like typical burden of 25–40%) are labeled as planning heuristics —
                your own numbers always beat a benchmark.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "var(--space-3)" }}>
              <p className="text-small text-muted" style={{ margin: 0 }}>
                Results are planning estimates, not accounting or tax advice. Nothing you
                type leaves your browser.
              </p>
              <div>
                <Link href="/about" className="btn btn-secondary">Read the methodology</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Guides ───────────────────────────────────────── */}
      <section className="section-band" aria-labelledby="guides-h">
        <div className="container">
          <div className="calc-eyebrow-row">
            <div>
              <span className="eyebrow eyebrow-rule">Learn</span>
              <h2 id="guides-h" style={{ marginBottom: 0 }}>The numbers behind your price</h2>
            </div>
            <Link href="/guides" className="btn btn-ghost">All guides →</Link>
          </div>
          <div className="grid-cards" style={{ marginTop: "var(--space-5)" }}>
            {guides.slice(0, 3).map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-pad card-link tool-card">
                <span className="badge badge-accent">Guide · {g.readingMinutes} min</span>
                <h3 style={{ fontSize: "1.02rem" }}>{g.title}</h3>
                <p>{g.description}</p>
                <span className="card-cta">Read the guide →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="final-cta" aria-labelledby="cta-h">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 id="cta-h" className="display" style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)" }}>
            Stop guessing what a job should cost.
          </h2>
          <p className="text-muted" style={{ maxWidth: 560, margin: "0 auto var(--space-5)" }}>
            Use the numbers behind your work to build a price that covers your costs and
            protects your profit.
          </p>
          <Link href="/calculators" className="btn btn-primary">
            Open a calculator <IconArrow className="btn-arrow" />
          </Link>
        </div>
      </section>
    </div>
  );
}
