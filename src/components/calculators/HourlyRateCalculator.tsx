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
  income: "65000", expenses: "18000", weeks: "48", hoursWeek: "40", utilization: "60",
};

/**
 * Hourly rate calculator. Math (Phase 0-verified, unchanged):
 *   revenueNeeded = income + expenses
 *   billable = weeks × hoursWeek × utilization/100
 *   rate = revenueNeeded ÷ billable (requires billable > 0)
 */
export default function HourlyRateCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [income, setIncome] = useState(prefill?.income ?? DEFAULTS.income);
  const [expenses, setExpenses] = useState(prefill?.expenses ?? DEFAULTS.expenses);
  const [weeks, setWeeks] = useState(prefill?.weeks ?? DEFAULTS.weeks);
  const [hoursWeek, setHoursWeek] = useState(prefill?.hoursWeek ?? DEFAULTS.hoursWeek);
  const [utilization, setUtilization] = useState(prefill?.utilization ?? DEFAULTS.utilization);

  const revenueNeeded = num(income) + num(expenses);
  const billable = num(weeks) * num(hoursWeek) * (num(utilization) / 100);
  const rate = billable > 0 ? revenueNeeded / billable : NaN;

  const reset = () => {
    setIncome(DEFAULTS.income); setExpenses(DEFAULTS.expenses); setWeeks(DEFAULTS.weeks);
    setHoursWeek(DEFAULTS.hoursWeek); setUtilization(DEFAULTS.utilization);
  };

  const copyText = [
    "RateCraft — Hourly Rate Calculation",
    `Target income: ${fmt.money(num(income))}`,
    `Business expenses: ${fmt.money(num(expenses))}`,
    `Revenue needed: ${fmt.money(revenueNeeded)}`,
    `Billable hours: ${fmt.num(billable)} (${fmt.num(num(weeks))} wk × ${fmt.num(num(hoursWeek))} hrs × ${fmt.num(num(utilization))}%)`,
    `Minimum hourly rate: ${fmt.money(rate)}`,
  ].join("\n");

  return (
    <section aria-label="Hourly rate calculator">
      <LiveRegion message={`Your minimum hourly rate is ${fmt.money(rate)}.`} />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Your income goal</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="hr-income" label="Income you need to take home" value={income} onChange={setIncome} unit="$" hint="Before personal income tax — set this with your tax reality in mind" />
            <Field id="hr-expenses" label="Annual business expenses" value={expenses} onChange={setExpenses} unit="$" hint="Insurance, truck, tools, software, accounting…" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Your realistic capacity</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-3)" }}>
            <Field id="hr-weeks" label="Working weeks" value={weeks} onChange={setWeeks} unit="wk" hint="52 minus time off" />
            <Field id="hr-hours" label="Hours / week" value={hoursWeek} onChange={setHoursWeek} unit="hrs" />
            <Field id="hr-util" label="Billable share" value={utilization} onChange={setUtilization} unit="%" hint="Quoting, admin and supply runs don't bill" />
          </div>
          {billable <= 0 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              Billable hours are zero — the rate divides by the hours you can actually bill, so
              set at least a few working weeks and hours.
            </span>
          )}

          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Your minimum hourly rate</div>
          <div className="result-primary">
            {Number.isFinite(rate) && rate > 0 ? fmt.money(rate) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Income goal", value: fmt.money(num(income)) },
              { label: "+ Expenses", value: fmt.money(num(expenses)) },
              { label: "Revenue needed", value: fmt.money(revenueNeeded) },
              { label: "Billable hrs", value: fmt.num(billable) },
              { label: "Rate", value: Number.isFinite(rate) ? `${fmt.money(rate)}/hr` : "—", highlight: true },
            ]}
          />

          <YourCalculation
            formula="Rate = (Income + Expenses) ÷ Billable hours"
            substitution={
              billable > 0
                ? `${fmt.money(revenueNeeded)} ÷ ${fmt.num(billable)} = ${fmt.money(rate)}`
                : "Billable hours are zero — adjust weeks, hours, or billable share"
            }
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Revenue you need / year" value={fmt.money(revenueNeeded)} hint="Target income + business expenses" strong />
            <ResultRow label="Billable hours / year" value={fmt.num(billable)} hint={`${fmt.num(num(weeks))} wk × ${fmt.num(num(hoursWeek))} hrs × ${fmt.num(num(utilization))}%`} />
            <ResultRow label="Revenue / billable hour" value={Number.isFinite(rate) ? fmt.money(rate) : "—"} strong tone="success" />
          </div>

          <ResultActions text={copyText} label="Hourly rate calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            This is a floor, not a target: it covers your income and expenses but includes no
            growth, no slack for slow months, and no profit beyond your salary. Most solo
            contractors bill 55–70% of their hours — assuming 100% understates the rate by
            30–45%.
          </p>
        </div>
      </div>
    </section>
  );
}
