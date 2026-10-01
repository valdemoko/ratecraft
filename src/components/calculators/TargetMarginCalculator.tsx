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
  expenses: "8500", ownerIncome: "6000", targetProfit: "2500", revenue: "38000", jobsMonth: "8",
};

/**
 * Target net profit (gross margin) calculator. Math (verified in tests/math-verification.mjs, section 16):
 *   overheadPct = overhead ÷ revenue × 100
 *   requiredGrossMargin = overheadPct + (netGoal ÷ revenue) × 100
 *   check: current gross margin = (revenue − variableCost) ÷ revenue,
 *          where variableCost = revenue − grossProfit... we take the user's current
 *          gross margin % directly and compare.
 * The output is the gross margin every job must carry for overhead and the net
 * profit goal both to be covered — the number to type into the Job Pricing and
 * Flat Rate calculators as the target margin.
 */
export default function TargetMarginCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [expenses, setExpenses] = useState(prefill?.expenses ?? DEFAULTS.expenses);
  const [ownerIncome, setOwnerIncome] = useState(prefill?.ownerIncome ?? DEFAULTS.ownerIncome);
  const [targetProfit, setTargetProfit] = useState(prefill?.targetProfit ?? DEFAULTS.targetProfit);
  const [revenue, setRevenue] = useState(prefill?.revenue ?? DEFAULTS.revenue);
  const [jobsMonth, setJobsMonth] = useState(prefill?.jobsMonth ?? DEFAULTS.jobsMonth);
  const [currentMargin, setCurrentMargin] = useState(prefill?.currentMargin ?? "32");

  const oh = num(expenses);
  const inc = num(ownerIncome);
  const profit = num(targetProfit);
  const rev = num(revenue);
  const jobs = num(jobsMonth);

  const netGoal = inc + profit;
  const overheadPct = rev > 0 ? (oh / rev) * 100 : NaN;
  const netPct = rev > 0 ? (netGoal / rev) * 100 : NaN;
  const requiredMargin = Number.isFinite(overheadPct) ? overheadPct + netPct : NaN;

  const cur = num(currentMargin);
  const hasCurrent = cur > 0 && cur < 100;
  const gap = Number.isFinite(requiredMargin) && hasCurrent ? requiredMargin - cur : NaN;
  const enough = Number.isFinite(gap) ? gap <= 0 : false;
  const profitShortfall =
    Number.isFinite(gap) && hasCurrent && !enough && rev > 0
      ? ((-gap / 100) * rev) // dollars of revenue per month that margin gap represents
      : NaN;
  const perJobShortfall = Number.isFinite(profitShortfall) && jobs > 0 ? profitShortfall / jobs : NaN;
  const priceUplift =
    Number.isFinite(gap) && hasCurrent && !enough
      ? ((1 - cur / 100) / (1 - requiredMargin / 100) - 1) * 100
      : NaN;

  const reset = () => {
    setExpenses(DEFAULTS.expenses); setOwnerIncome(DEFAULTS.ownerIncome); setTargetProfit(DEFAULTS.targetProfit);
    setRevenue(DEFAULTS.revenue); setJobsMonth(DEFAULTS.jobsMonth); setCurrentMargin("32");
  };

  const copyText = [
    "RateCraft — Target Gross Margin",
    `Monthly overhead: ${fmt.money(oh)}`,
    `Owner income goal: ${fmt.money(inc)} · Target net profit: ${fmt.money(profit)}`,
    `Total net goal: ${fmt.money(netGoal)}`,
    `Monthly revenue: ${fmt.money(rev)}`,
    `Overhead as % of revenue: ${fmt.pct(overheadPct)}`,
    `Net goal as % of revenue: ${fmt.pct(netPct)}`,
    `Required gross margin: ${fmt.pct(requiredMargin)}`,
    `Current average gross margin: ${hasCurrent ? fmt.pct(cur) : "—"}`,
    hasCurrent && Number.isFinite(gap)
      ? enough
        ? `Current margin covers the goal with ${fmt.pct(-gap)} to spare`
        : `Gap: ${fmt.pct(gap)} — about ${fmt.money(perJobShortfall)} per job at ${fmt.num(jobs)} jobs/month`
      : "",
  ].filter(Boolean).join("\n");

  return (
    <section aria-label="Target gross margin calculator">
      <LiveRegion
        message={
          Number.isFinite(requiredMargin)
            ? `To cover ${fmt.money(oh)} of overhead and a ${fmt.money(netGoal)} net goal on ${fmt.money(rev)} of revenue, your jobs need a ${fmt.pct(requiredMargin)} gross margin.`
            : "Enter your monthly revenue to see the required gross margin."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>What the business must pay each month</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="tm-expenses" label="Monthly overhead" value={expenses} onChange={setExpenses} unit="$" hint="Insurance, vehicles, rent, software, accounting — see the Overhead Calculator" />
            <Field id="tm-income" label="What you need to pay yourself" value={ownerIncome} onChange={setOwnerIncome} unit="$" hint="Your monthly income goal before personal tax" />
            <Field id="tm-profit" label="Target net profit on top" value={targetProfit} onChange={setTargetProfit} unit="$" hint="What the business should earn beyond paying you — enter 0 if none yet" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The revenue those goals ride on</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="tm-revenue" label="Monthly revenue (current or planned)" value={revenue} onChange={setRevenue} unit="$" />
            <Field id="tm-jobs" label="Jobs per month" value={jobsMonth} onChange={setJobsMonth} hint="Average count — used to show the gap per job" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Where you are today</h2>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <Field id="tm-current" label="Your current average gross margin" value={currentMargin} onChange={setCurrentMargin} unit="%" hint="Optional — leave empty to see only the required margin" />
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Gross margin your jobs need to carry</div>
          <div className="result-primary" style={{ color: "var(--color-brand)" }}>
            {Number.isFinite(requiredMargin) ? fmt.pct(requiredMargin) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Overhead %", value: fmt.pct(overheadPct) },
              { label: "Net goal %", value: fmt.pct(netPct) },
              { label: "Required margin", value: fmt.pct(requiredMargin), highlight: true },
            ]}
          />

          <YourCalculation
            formula="Required gross margin = Overhead ÷ Revenue + (Owner income + Net profit) ÷ Revenue"
            substitution={
              Number.isFinite(requiredMargin)
                ? `${fmt.pct(overheadPct)} + ${fmt.pct(netPct)} = ${fmt.pct(requiredMargin)}`
                : "Enter monthly revenue to compute the percentages"
            }
            note="Gross profit pays overhead first, then you, then the business's profit — so the margin has to cover all three shares of revenue."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Overhead per month" value={fmt.money(oh)} hint={`${fmt.pct(overheadPct)} of revenue`} />
            <ResultRow label="Owner income + net profit" value={fmt.money(netGoal)} hint={`${fmt.pct(netPct)} of revenue`} />
            <ResultRow label="Required gross margin" value={Number.isFinite(requiredMargin) ? fmt.pct(requiredMargin) : "—"} strong />
            {hasCurrent && Number.isFinite(gap) && (
              <ResultRow
                label={enough ? "Margin above the requirement" : "Margin gap to close"}
                value={fmt.pct(Math.abs(gap))}
                hint={
                  enough
                    ? "Your pricing already covers overhead and the net goal"
                    : `About ${fmt.money(perJobShortfall)} per job at ${fmt.num(jobs)} jobs/month`
                }
                tone={enough ? "success" : "warning"}
                strong
              />
            )}
            {hasCurrent && Number.isFinite(priceUplift) && !enough && (
              <ResultRow
                label="Price increase that closes the gap"
                value={fmt.pct(priceUplift)}
                hint={`Raising average prices ${fmt.pct(priceUplift)} lifts this margin to ${fmt.pct(requiredMargin)} on the same costs`}
              />
            )}
          </div>

          <ResultActions text={copyText} label="Target gross margin calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            This is the number to use as the target margin in the{" "}
            <strong>Job Pricing Calculator</strong> and the <strong>Flat Rate Calculator</strong> —
            it&apos;s the margin that makes overhead, your income and the profit goal all true at the
            same time, on the revenue you actually expect.
          </p>
        </div>
      </div>
    </section>
  );
}
