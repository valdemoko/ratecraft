"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import ResultRow from "@/components/calculator/ResultRow";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULTS = {
  jobsMonth: "12", avgPrice: "1200", avgCost: "750", increase: "8",
};

/**
 * Price increase calculator. Math (verified in tests/math-verification.mjs, section 18):
 *   newPrice      = avgPrice × (1 + increase/100)
 *   profitBefore  = avgPrice − avgCost
 *   profitAfter   = newPrice − avgCost
 *   extraPerJob   = profitAfter − profitBefore
 *   jobsBreakEven = profitBefore ÷ profitAfter  (volume you can lose and still earn the same)
 *   customers who must accept it: 1 − jobsBreakEven... shown as "% you can lose".
 * A price increase is the only lever that raises profit with zero extra work,
 * materials or overhead — the catch is customer attrition, which this quantifies.
 */
export default function PriceIncreaseCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [jobsMonth, setJobsMonth] = useState(prefill?.jobsMonth ?? DEFAULTS.jobsMonth);
  const [avgPrice, setAvgPrice] = useState(prefill?.avgPrice ?? DEFAULTS.avgPrice);
  const [avgCost, setAvgCost] = useState(prefill?.avgCost ?? DEFAULTS.avgCost);
  const [increase, setIncrease] = useState(prefill?.increase ?? DEFAULTS.increase);

  const n = num(jobsMonth);
  const price = num(avgPrice);
  const cost = num(avgCost);
  const inc = num(increase);

  const newPrice = price * (1 + inc / 100);
  const profitBefore = price - cost;
  const profitAfter = newPrice - cost;
  const extraPerJob = profitAfter - profitBefore;
  const extraMonth = n * extraPerJob;
  const extraYear = extraMonth * 12;
  const marginBefore = price > 0 ? (profitBefore / price) * 100 : NaN;
  const marginAfter = newPrice > 0 ? (profitAfter / newPrice) * 100 : NaN;
  // Jobs you can lose and still earn the same total profit:
  const survivableJobs = profitAfter > 0 ? n - (profitBefore * n) / profitAfter : NaN;
  const survivablePct = n > 0 && Number.isFinite(survivableJobs) ? (survivableJobs / n) * 100 : NaN;
  // Volume increase a discount would need, for the comparison row:
  const discountEquiv = profitBefore > 0 && profitAfter > 0 ? (profitBefore / profitAfter) * 100 : NaN;
  const losing = profitBefore <= 0 && price > 0;

  const reset = () => {
    setJobsMonth(DEFAULTS.jobsMonth); setAvgPrice(DEFAULTS.avgPrice);
    setAvgCost(DEFAULTS.avgCost); setIncrease(DEFAULTS.increase);
  };

  const copyText = [
    "RateCraft — Price Increase Impact",
    `Jobs per month: ${fmt.num(n)} · Average price: ${fmt.money(price)} · Average cost: ${fmt.money(cost)}`,
    `Increase: ${fmt.pct(inc)} → new average price ${fmt.money(newPrice)}`,
    `Profit per job: ${fmt.money(profitBefore)} → ${fmt.money(profitAfter)} (+ ${fmt.money(extraPerJob)})`,
    `Extra profit per month: ${fmt.money(extraMonth)} · per year: ${fmt.money(extraYear)}`,
    `Margin: ${fmt.pct(marginBefore)} → ${fmt.pct(marginAfter)}`,
    `You could lose ${fmt.pct(survivablePct)} of jobs (${fmt.num(survivableJobs)}/month) and still earn the same total profit`,
  ].join("\n");

  return (
    <section aria-label="Price increase calculator">
      <LiveRegion
        message={
          Number.isFinite(extraMonth) && profitBefore > 0
            ? `An ${fmt.pct(inc)} increase adds ${fmt.money(extraMonth)} of profit per month, and you could lose ${fmt.pct(survivablePct)} of jobs and still earn the same.`
            : losing
              ? "The average job makes no profit at this cost, so there is nothing for an increase to improve — fix the price-to-cost gap first."
              : "Enter your average job economics to see what an increase is worth."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Your typical month</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="pi-jobs" label="Jobs per month" value={jobsMonth} onChange={setJobsMonth} />
            <Field id="pi-price" label="Average job price" value={avgPrice} onChange={setAvgPrice} unit="$" />
            <Field id="pi-cost" label="Variable cost per job" value={avgCost} onChange={setAvgCost} unit="$" hint="Labor, materials, subs — what each job costs you to deliver" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The increase</h2>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <Field id="pi-increase" label="Price increase" value={increase} onChange={setIncrease} unit="%" hint="5–15% is the common range for a working-price correction" />
          </div>
          {losing && (
            <p role="alert" className="callout callout-warning text-small" style={{ marginBottom: 0, marginTop: "var(--space-3)" }}>
              At this price and cost the average job makes no profit, so an increase isn&apos;t a
              tuning decision — it&apos;s how the business stays alive. The results below show the
              arithmetic anyway.
            </p>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Extra profit per year</div>
          <div
            className="result-primary"
            style={{ color: extraYear > 0 ? "var(--color-success)" : "var(--color-danger)" }}
          >
            {Number.isFinite(extraYear) ? fmt.money(extraYear) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Price", value: fmt.money(price) },
              { label: `+ ${fmt.pct(inc)}`, value: fmt.money(newPrice) },
              { label: "Profit/job", value: fmt.money(profitAfter), highlight: profitAfter > 0 },
              { label: `× ${fmt.num(n)} jobs`, value: `${fmt.money(extraMonth)}/mo` },
              { label: "× 12", value: `${fmt.money(extraYear)}/yr`, highlight: true },
            ]}
          />

          <YourCalculation
            formula="Extra profit/year = Jobs × (New price − Cost) × 12 − current profit"
            substitution={
              Number.isFinite(extraPerJob)
                ? `${fmt.num(n)} × (${fmt.money(newPrice)} − ${fmt.money(cost)}) × 12 − current = ${fmt.money(extraYear)}`
                : "Enter a price above the job's variable cost"
            }
            note="Every dollar of the increase lands in profit: no extra hours, materials, subs or overhead — it's the only lever that works that way."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="New average price" value={fmt.money(newPrice)} hint={`${fmt.money(price)} → ${fmt.money(newPrice)}`} />
            <ResultRow label="Extra profit per job" value={fmt.money(extraPerJob)} hint={`${fmt.money(profitBefore)} → ${fmt.money(profitAfter)} (${fmt.pct(marginBefore)} → ${fmt.pct(marginAfter)} margin)`} strong />
            <ResultRow label="Extra profit per month" value={fmt.money(extraMonth)} hint={`Across ${fmt.num(n)} jobs`} />
            <ResultRow label="Extra profit per year" value={fmt.money(extraYear)} strong />
            <ResultRow
              label="Jobs you can afford to lose"
              value={Number.isFinite(survivablePct) ? `${fmt.pct(survivablePct)} (${fmt.num(survivableJobs)}/mo)` : "—"}
              hint="And still earn the same total profit as today"
              tone="success"
              strong
            />
          </div>

          <ResultActions text={copyText} label="Price increase calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            Compare that with the <strong>Discount Impact Calculator</strong> running in reverse:
            a discount of the same size moves profit the other way, and demands{" "}
            {Number.isFinite(discountEquiv) ? fmt.pct(discountEquiv - 100) : "more"} volume to
            compensate. Price increases buy back profit; discounts sell it.
          </p>
        </div>
      </div>
    </section>
  );
}
