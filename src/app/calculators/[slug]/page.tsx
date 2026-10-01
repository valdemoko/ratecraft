import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  tools,
  getTool,
  getCategory,
  site,
  workedExamples,
  moreExamples,
  continueWith,
  isIndexable,
  indexableRobots,
} from "@/lib/site";
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
import JobProfitabilityCalculator from "@/components/calculators/JobProfitabilityCalculator";
import DiscountImpactCalculator from "@/components/calculators/DiscountImpactCalculator";
import HireVsSubcontractCalculator from "@/components/calculators/HireVsSubcontractCalculator";
import EffectiveHourlyRateCalculator from "@/components/calculators/EffectiveHourlyRateCalculator";
import ChangeOrderCalculator from "@/components/calculators/ChangeOrderCalculator";
import TargetMarginCalculator from "@/components/calculators/TargetMarginCalculator";
import MaterialsMarkupCalculator from "@/components/calculators/MaterialsMarkupCalculator";
import PriceIncreaseCalculator from "@/components/calculators/PriceIncreaseCalculator";
import OvertimeCalculator from "@/components/calculators/OvertimeCalculator";
import TripCostCalculator from "@/components/calculators/TripCostCalculator";
import WarrantyCostCalculator from "@/components/calculators/WarrantyCostCalculator";
import QuoteWinRateCalculator from "@/components/calculators/QuoteWinRateCalculator";
import BuyVsRentCalculator from "@/components/calculators/BuyVsRentCalculator";
import PaymentTermsCalculator from "@/components/calculators/PaymentTermsCalculator";

import { guides } from "@/lib/guides";
import ExamplePrefill from "@/components/calculator/ExamplePrefill";
import ExampleLink from "@/components/ExampleLink";

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
    // Setting `robots` here replaces the layout's value, so the sitewide draft
    // guard has to be restated — otherwise calculator pages alone would be
    // indexable on a preview deployment.
    robots: isIndexable ? indexableRobots : { index: false, follow: false },
    openGraph: { title: tool.metaTitle, description: tool.metaDescription, url, type: "website" },
    twitter: { card: "summary_large_image", title: tool.metaTitle, description: tool.metaDescription },
  };
}

/** Calculator bodies, each wrapped so ?e= prefill links resolve client-side (pages stay static). */
function CalculatorSlot({ slug }: { slug: string }) {
  const Calc = CALC_COMPONENTS[slug];
  if (!Calc) return null;
  return <ExamplePrefill calculator={Calc} />;
}

const CALC_COMPONENTS: Record<string, React.ComponentType<{ prefill?: Record<string, string> }>> = {
  "markup-calculator": MarkupCalculator,
  "margin-calculator": MarginCalculator,
  "job-pricing-calculator": JobPricingCalculator,
  "labor-burden-calculator": LaborBurdenCalculator,
  "hourly-rate-calculator": HourlyRateCalculator,
  "overhead-calculator": OverheadCalculator,
  "break-even-calculator": BreakEvenCalculator,
  "flat-rate-calculator": FlatRateCalculator,
  "job-profitability-calculator": JobProfitabilityCalculator,
  "discount-impact-calculator": DiscountImpactCalculator,
  "hire-vs-subcontract-calculator": HireVsSubcontractCalculator,
  "effective-hourly-rate-calculator": EffectiveHourlyRateCalculator,
  "change-order-calculator": ChangeOrderCalculator,
  "target-margin-calculator": TargetMarginCalculator,
  "materials-markup-calculator": MaterialsMarkupCalculator,
  "price-increase-calculator": PriceIncreaseCalculator,
  "overtime-calculator": OvertimeCalculator,
  "trip-cost-calculator": TripCostCalculator,
  "warranty-cost-calculator": WarrantyCostCalculator,
  "quote-win-rate-calculator": QuoteWinRateCalculator,
  "buy-vs-rent-calculator": BuyVsRentCalculator,
  "payment-terms-calculator": PaymentTermsCalculator,
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
      "Stopping at break-even and calling it a plan: covering the bills is not the same as earning a profit.",
    ],
  },
  "job-profitability-calculator": {
    meaning:
      "The actual margin is what the job really earned, measured on the price you were paid. Compare it against the planned margin: the difference in margin points is how much of your intended profit the cost overrun consumed, and the final row shows the price the real cost would have required.",
    whenToUse:
      "Use it on every completed job while your estimating data is thin — and on any job that felt like it went sideways. It's the only feedback loop that tells you which input in your estimates is wrong.",
    mistakes: [
      "Never checking actuals at all, so the same optimistic assumption survives in every future estimate.",
      "Comparing the overrun percentage to the margin: a 17% cost overrun on a 35%-margin job took 32% of the profit.",
      "Counting unpaid owner hours as free labor — that hides part of the overrun in a place you never look.",
    ],
  },
  "discount-impact-calculator": {
    meaning:
      "The profit after the discount is real money you keep once the job's costs are paid. The erased share and the volume multiplier are the same fact stated twice: a discount is taken out of the smallest number in the job, so it costs far more profit percentage than price percentage.",
    whenToUse:
      "Use it before agreeing to any discount, to see what it costs in profit and how much extra work would be needed to replace it. It's also the honest answer to 'can you do better on price?' when the answer is scope, not price.",
    mistakes: [
      "Comparing a discount to a markup as if they were symmetric — they aren't; costs don't discount themselves.",
      "Discounting the same scope instead of removing a line of work, which lowers the price and the margin at the same time.",
      "Treating 'we'll make it up on volume' as arithmetic: check the volume multiplier before believing it.",
    ],
  },
  "hire-vs-subcontract-calculator": {
    meaning:
      "The headline number is the workload at which hiring and subcontracting cost the same. Below it, a subcontractor who only bills the hours you have is cheaper; above it, the fixed annual cost of an employee is spread over enough sellable hours to win. The two per-hour figures show what unused capacity does to the employee's real cost.",
    whenToUse:
      "Use it before hiring, before renewing a subcontractor arrangement, or when a quiet quarter makes you wonder whether the payroll is still the right shape.",
    mistakes: [
      "Comparing the wage to the subcontractor's invoice instead of the fully burdened annual cost.",
      "Assuming 2,080 billable hours — nobody sells every paid hour.",
      "Treating the cash answer as the whole answer: control, scheduling and employee-versus-contractor rules sit outside the arithmetic.",
    ],
  },
  "effective-hourly-rate-calculator": {
    meaning:
      "The effective rate divides the job's gross profit by every hour the job takes from you — on-site work plus the quoting, pickups, travel and invoicing it causes. The gap between it and the on-site rate is what the unpaid time costs; the final row judges the job against the per-hour target you set.",
    whenToUse:
      "Use it on any job you can repeat — maintenance contracts, service calls, similar installs — to find which kinds of work actually pay per real hour, and which just look busy.",
    mistakes: [
      "Counting only on-site hours — that's the flattering number, not the effective one.",
      "Costing your hours at $0: your time has a real cost even when no payroll runs.",
      "Judging jobs by margin instead of by effective rate — a fat margin on a small, trip-heavy job can pay less per hour than a thin one on a dense day.",
    ],
  },
  "change-order-calculator": {
    meaning:
      "The change order amount reprices the whole new cost base to the job's original margin, so the contract keeps earning what it was designed to earn. The margin-after row confirms the job's overall percentage is intact; the last row shows the profit given away if the extra work were done for cost alone.",
    whenToUse:
      "Use it the moment scope changes — before the extra work starts, so the number goes into a signed change order rather than a later negotiation.",
    mistakes: [
      "Billing just the extra cost and calling it fair — that donates the margin on the change work.",
      "Pricing the change with a different (usually thinner) margin than the original contract.",
      "Starting the extra work before the change order is signed.",
    ],
  },
  "target-margin-calculator": {
    meaning:
      "The required gross margin is overhead plus owner income plus net profit, each as a share of expected revenue. It's the floor every job price has to clear for the business to end the year where you planned — and the gap row shows what today's pricing is missing.",
    whenToUse:
      "Use it once a year and after any cost shock, to reset the target margin you use in the job pricing and flat rate tools.",
    mistakes: [
      "Copying a target margin from a forum instead of deriving it from your own overhead and income.",
      "Leaving your own income out of the calculation entirely — the most common way owners end up working for free.",
      "Double-counting a owner salary that's already inside overhead.",
    ],
  },
  "materials-markup-calculator": {
    meaning:
      "The price is built from net cost — list price less your trade discount plus freight — marked up on purpose. The effective multiplier shows what your price looks like as a simple multiple of list, which is how customers and competitor quotes usually describe it.",
    whenToUse:
      "Use it when pricing any material line: to claim your discount, price freight honestly, and check what your markup really produces as a margin.",
    mistakes: [
      "Marking up list price while leaving the trade discount unclaimed — the discount pays for the markup.",
      "Eating freight instead of pricing it — delivery is a real cost of having the material on site.",
      "Stacking a materials markup under a whole-job margin — profit gets counted twice on the same parts.",
    ],
  },
  "price-increase-calculator": {
    meaning:
      "The extra profit is pure: no additional hours, materials or overhead — every dollar of the increase lands in profit. The survivable-loss row is the honest risk measure: how many customers could decline the new price before total profit falls below today's.",
    whenToUse:
      "Use it when costs have moved and quotes no longer carry the margin the business needs — and to set expectations for how much customer pushback the increase can absorb.",
    mistakes: [
      "Raising prices without knowing the margin the business actually requires — fix the target first.",
      "Repricing signed work instead of new quotes only.",
      "Comparing the increase to a discount as if they were symmetric — the discount costs more profit than the increase gains.",
    ],
  },
  "overtime-calculator": {
    meaning:
      "The burdened OT rate is the wage plus burden, multiplied — because taxes and comp ride on overtime pay exactly as on straight pay. The premium row isolates what the multiplier alone costs beyond the same hours at straight time: the number to weigh against hiring or against passing to the customer on rush work.",
    whenToUse:
      "Use it during seasonal peaks, before approving an overtime-heavy schedule, and whenever someone quotes '1.5 times the wage' as the cost of an extra hour.",
    mistakes: [
      "Costing overtime at the bare wage times 1.5 — burden rides on OT pay too.",
      "Letting a seasonal premium become the normal schedule without re-running the hire comparison.",
      "Passing OT costs to customers on work that's only overtime because the estimate slipped.",
    ],
  },
  "trip-cost-calculator": {
    meaning:
      "The trip cost splits into the vehicle's share of the day and the drive time each call carries at your burdened rate. The labor half is the one fuel receipts hide — and the reason the true roll cost is usually double the gas money.",
    whenToUse:
      "Use it to set call-out minimums, to fill the trip line in the Flat Rate Calculator, and to price what denser routing would save at your volume.",
    mistakes: [
      "Costing a trip at the fuel receipt only — drive time is unpaid labor the job must carry.",
      "Setting a minimum charge below the true trip cost — a canceled call then loses money.",
      "Treating drive time as free when comparing dense days against cross-town jobs.",
    ],
  },
  "warranty-cost-calculator": {
    meaning:
      "The annual cost is the callback rate applied to the cost of redoing a job; the margin drag converts it to points every quote loses. A callback job earns a fraction of a clean job's profit — that gap is what rework really takes.",
    whenToUse:
      "Use it to size a warranty allowance from your own rate, to justify fixing a systematic cause, and to write warranty terms that match what the work can carry.",
    mistakes: [
      "Adding a blanket warranty cushion without knowing your actual callback rate.",
      "Hunting the symptom on the callback while the systematic cause produces the next one.",
      "Leaving the warranty term verbal and unbounded — a blank check drawn on this number.",
    ],
  },
  "quote-win-rate-calculator": {
    meaning:
      "The win rate is a diagnosis, not a grade: very high with thin revenue means prices are too low; very low with good prices means wrong leads or slow follow-up. The cost-per-win row is a customer-acquisition cost hiding in admin time.",
    whenToUse:
      "Use it monthly while your pipeline data is thin, then quarterly — and always split value won from count won before deciding what to fix.",
    mistakes: [
      "Reading only the count win rate — the value split shows whether big jobs specifically are being lost.",
      "Improving win rate by cutting prices instead of qualifying leads and following up faster.",
      "Quoting everything: every junk lead quoted costs your hourly rate times the hours.",
    ],
  },
  "buy-vs-rent-calculator": {
    meaning:
      "The break-even is where capital recovery plus per-day wear equals the rental rate: above it, owning wins; below it, renting does. The owned-day row shows what a day of use truly costs at your volume — the rental rate is constant, the owned day isn't.",
    whenToUse:
      "Use it before any tool purchase over a few hundred dollars — and again when usage patterns change, because the break-even moves with them.",
    mistakes: [
      "Charging the whole purchase to year one instead of spreading it over the working life.",
      "Counting storage and insurance per day here and again in overhead — pick one place.",
      "Buying for the excitement of new kit when the usage honestly sits below break-even.",
    ],
  },
  "payment-terms-calculator": {
    meaning:
      "The financing cost treats the delay as a loan at your cost of money, because that's what it is. The margin-equivalent row shows the share of the invoice the wait eats, and the float row totals what customers owe you at any moment.",
    whenToUse:
      "Use it to price what your slow payers cost, to decide on deposits and completion terms, and to check whether an early-payment discount actually pays.",
    mistakes: [
      "Treating slow payment as free because no invoice says so — the cost is real and measured here.",
      "Offering 2/10 net 30 without computing the ~37% implied annual rate.",
      "Letting a stated late fee exist on paper and never applying it.",
    ],
  },
};

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool || !CALC_COMPONENTS[slug]) notFound();

  const category = getCategory(tool.category);
  const url = `${site.url}/calculators/${tool.slug}`;
  const extra = support[slug];

  // Worked example: the page's canonical one. Example links (?example=<key>) used to
  // be resolved server-side via searchParams, which silently forced the whole page into
  // per-request SSR and off the static prerender. Now they encode the prefill in a
  // query param parsed client-side (ExampleLink + ExamplePrefill), so every calculator
  // page is fully prerendered to static HTML at build time — Googlebot gets complete
  // HTML on first fetch, with no runtime render to postpone.
  const canonicalExample = workedExamples[slug];
  const extraExamples = moreExamples[slug] ?? [];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any (web browser)",
      description: tool.metaDescription,
      dateModified: tool.updated,
      isAccessibleForFree: true,
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
        <p className="text-muted" style={{ fontSize: "1.08rem", marginBottom: "var(--space-3)" }}>{tool.intro}</p>
        <p className="text-small text-faint" style={{ margin: 0 }}>
          Method and content reviewed {new Date(tool.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} ·
          formulas checked against a test suite · runs entirely in your browser
        </p>
      </header>

      <div className="calc-shell">
        <CalculatorSlot slug={slug} />
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
              <ExampleLink href={`/calculators/${slug}`} prefill={canonicalExample.prefill} className="btn btn-secondary">
                Load this example into the calculator
              </ExampleLink>
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
              <ExampleLink
                key={e.key}
                href={`/calculators/${slug}`}
                prefill={e.prefill}
                className="card card-pad card-link tool-card"
              >
                <div style={{ fontWeight: 600 }}>{e.trade}</div>
                <div className="text-small text-muted">{e.result}</div>
                <div className="card-cta">Load this example →</div>
              </ExampleLink>
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
