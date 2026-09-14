"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import ResultRow from "@/components/calculator/ResultRow";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULTS = { fixed: "4500", avgPrice: "1200", avgCost: "750" };

/**
 * Break-even calculator. Math (Phase 0-verified, unchanged):
 *   contribution = avgPrice − avgCost
 *   jobs = fixed ÷ contribution (requires contribution > 0)
 *   revenue = jobs × avgPrice ; marginPct = contribution ÷ price × 100
 */
export default function BreakEvenCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [fixed, setFixed] = useState(prefill?.fixed ?? DEFAULTS.fixed);
  const [avgPrice, setAvgPrice] = useState(prefill?.avgPrice ?? DEFAULTS.avgPrice);
  const [avgCost, setAvgCost] = useState(prefill?.avgCost ?? DEFAULTS.avgCost);

  const price = num(avgPrice);
  const cost = num(avgCost);
  const contribution = price - cost;
  const jobs = contribution > 0 ? num(fixed) / contribution : NaN;
  const revenue = Number.isFinite(jobs) ? jobs * price : NaN;
  const marginPct = price > 0 ? (contribution / price) * 100 : NaN;

  const reset = () => {
    setFixed(DEFAULTS.fixed); setAvgPrice(DEFAULTS.avgPrice); setAvgCost(DEFAULTS.avgCost);
  };

  const copyText = [
    "RateCraft — Break-Even Calculation",
    `Fixed costs / month: ${fmt.money(num(fixed))}`,
    `Average job price: ${fmt.money(price)}`,
    `Variable cost / job: ${fmt.money(cost)}`,
    `Contribution per job: ${fmt.money(contribution)}`,
    `Break-even jobs / month: ${Number.isFinite(jobs) ? String(Math.ceil(jobs)) : "—"}`,
    `Break-even revenue / month: ${fmt.money(revenue)}`,
  ].join("\n");

  return (
    <section aria-label="Break-even calculator">
      <LiveRegion
        message={
          Number.isFinite(jobs)
            ? `You need about ${Math.ceil(jobs)} jobs per month to break even.`
            : "Enter an average job price higher than its variable cost to see your break-even point."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Your typical month</h2>
          <Field id="be-fixed" label="Fixed costs per month" value={fixed} onChange={setFixed} unit="$" hint="Insurance, vehicles, rent, software, your salary…" />

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Your average job</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="be-price" label="Average job price" value={avgPrice} onChange={setAvgPrice} unit="$" />
            <Field id="be-cost" label="Variable cost per job" value={avgCost} onChange={setAvgCost} unit="$" hint="Materials, subs, dump fees, job fuel…" />
          </div>
          {price > 0 && cost >= price && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              The average job costs as much as it sells for, so no number of jobs ever breaks
              even. The price must exceed the variable cost.
            </span>
          )}

          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Jobs per month to break even</div>
          <div className="result-primary">
            {Number.isFinite(jobs) ? Math.ceil(jobs) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Fixed costs", value: fmt.money(num(fixed)) },
              { label: "Contribution/job", value: fmt.money(contribution) },
              { label: "Break-even jobs", value: Number.isFinite(jobs) ? String(Math.ceil(jobs)) : "—", highlight: true },
              { label: "Break-even revenue", value: Number.isFinite(revenue) ? fmt.money(revenue) : "—" },
            ]}
          />

          <YourCalculation
            formula="Break-even jobs = Fixed costs ÷ Contribution per job"
            substitution={
              contribution > 0
                ? `${fmt.money(num(fixed))} ÷ ${fmt.money(contribution)} = ${fmt.num(jobs)} → ${Math.ceil(jobs)} jobs`
                : "Price must exceed variable cost per job"
            }
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Contribution per job" value={fmt.money(contribution)} hint={`Price − variable cost (${fmt.money(price)} − ${fmt.money(cost)})`} strong />
            <ResultRow label="Contribution margin" value={Number.isFinite(marginPct) ? fmt.pct(marginPct) : "—"} />
            <ResultRow label="Break-even revenue / month" value={Number.isFinite(revenue) ? fmt.money(revenue) : "—"} strong />
          </div>

          <ResultActions text={copyText} label="Break-even calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            {Number.isFinite(jobs)
              ? `Job number ${Math.ceil(jobs) + 1} each month is where profit starts — before that, every job is just paying the fixed bills.`
              : "Enter an average job price higher than its variable cost to see your break-even point."}
          </p>
        </div>
      </div>
    </section>
  );
}
