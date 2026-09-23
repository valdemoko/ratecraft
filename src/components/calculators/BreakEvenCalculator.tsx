"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import ResultRow from "@/components/calculator/ResultRow";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULTS = { fixed: "4500", avgPrice: "1200", avgCost: "750", targetProfit: "2000" };

/**
 * Break-even calculator. Math (Phase 0-verified, unchanged in the core, plus
 * the target-profit extension — verified in tests/math-verification.mjs):
 *   contribution = avgPrice − avgCost
 *   jobs = fixed ÷ contribution (requires contribution > 0)
 *   revenue = jobs × avgPrice ; marginPct = contribution ÷ price × 100
 *   targetJobs = (fixed + targetProfit) ÷ contribution
 *   extraJobs = targetJobs − jobs
 * Break-even answers "what keeps the lights on"; the target-profit line answers
 * "what pays me as well", which is the number a plan is actually built on.
 */
export default function BreakEvenCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [fixed, setFixed] = useState(prefill?.fixed ?? DEFAULTS.fixed);
  const [avgPrice, setAvgPrice] = useState(prefill?.avgPrice ?? DEFAULTS.avgPrice);
  const [avgCost, setAvgCost] = useState(prefill?.avgCost ?? DEFAULTS.avgCost);
  const [targetProfit, setTargetProfit] = useState(prefill?.targetProfit ?? DEFAULTS.targetProfit);

  const price = num(avgPrice);
  const cost = num(avgCost);
  const contribution = price - cost;
  const jobs = contribution > 0 ? num(fixed) / contribution : NaN;
  const revenue = Number.isFinite(jobs) ? jobs * price : NaN;
  const marginPct = price > 0 ? (contribution / price) * 100 : NaN;

  // Profit goal: fixed costs still have to be covered first, so the jobs that
  // pay a target profit are (fixed + target) ÷ contribution — not target ÷ contribution.
  const goal = num(targetProfit);
  const targetJobs = contribution > 0 ? (num(fixed) + goal) / contribution : NaN;
  const extraJobs = Number.isFinite(targetJobs) && Number.isFinite(jobs) ? targetJobs - jobs : NaN;
  const targetRevenue = Number.isFinite(targetJobs) ? targetJobs * price : NaN;

  const reset = () => {
    setFixed(DEFAULTS.fixed); setAvgPrice(DEFAULTS.avgPrice); setAvgCost(DEFAULTS.avgCost);
    setTargetProfit(DEFAULTS.targetProfit);
  };

  const copyText = [
    "RateCraft — Break-Even Calculation",
    `Fixed costs / month: ${fmt.money(num(fixed))}`,
    `Average job price: ${fmt.money(price)}`,
    `Variable cost / job: ${fmt.money(cost)}`,
    `Contribution per job: ${fmt.money(contribution)}`,
    `Break-even jobs / month: ${Number.isFinite(jobs) ? String(Math.ceil(jobs)) : "—"}`,
    `Break-even revenue / month: ${fmt.money(revenue)}`,
    `Target profit / month: ${fmt.money(goal)}`,
    `Jobs for that target profit: ${Number.isFinite(targetJobs) ? String(Math.ceil(targetJobs)) : "—"}`,
    `Extra jobs beyond break-even: ${Number.isFinite(extraJobs) ? String(Math.ceil(extraJobs)) : "—"}`,
    `Revenue for target profit / month: ${fmt.money(targetRevenue)}`,
  ].join("\n");

  return (
    <section aria-label="Break-even calculator">
      <LiveRegion
        message={
          Number.isFinite(jobs)
            ? `You need about ${Math.ceil(jobs)} jobs per month to break even${Number.isFinite(targetJobs) ? `, and ${Math.ceil(targetJobs)} to earn ${fmt.money(goal)} of profit` : ""}.`
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

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Your profit goal</h2>
          <Field
            id="be-target"
            label="Profit you want per month"
            value={targetProfit}
            onChange={setTargetProfit}
            unit="$"
            hint="On top of breaking even — what the business should actually earn. Enter 0 to see break-even alone"
          />
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
            <ResultRow label="Break-even revenue / month" value={Number.isFinite(revenue) ? fmt.money(revenue) : "—"} hint="At the exact, unrounded job count" strong />
            <ResultRow
              label={`Jobs for ${fmt.money(goal)} profit`}
              value={Number.isFinite(targetJobs) ? `${Math.ceil(targetJobs)} jobs` : "—"}
              hint="Fixed costs are still covered first: (fixed + target) ÷ contribution"
              strong
              tone="success"
            />
            <ResultRow
              label="Extra jobs beyond break-even"
              value={Number.isFinite(extraJobs) ? `${Math.ceil(extraJobs)} jobs` : "—"}
              hint="Every one of these is where the business actually earns"
            />
            <ResultRow label="Revenue at that profit goal" value={Number.isFinite(targetRevenue) ? fmt.money(targetRevenue) : "—"} />
          </div>

          <ResultActions text={copyText} label="Break-even calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            {Number.isFinite(jobs)
              ? `Job number ${Math.ceil(jobs) + 1} each month is where profit starts${Number.isFinite(targetJobs) ? `, and job ${Math.ceil(targetJobs)} is where you hit ${fmt.money(goal)}` : ""} — below the break-even line, every job is just paying the fixed bills.`
              : "Enter an average job price higher than its variable cost to see your break-even point."}
          </p>
        </div>
      </div>
    </section>
  );
}
