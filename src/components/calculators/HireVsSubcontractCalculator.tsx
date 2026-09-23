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
  annualCost: "65160", capacityHours: "1764", demandHours: "1400", subRate: "55",
};

/**
 * Hire vs. subcontract calculator. Math (verified in tests/math-verification.mjs,
 * section 12):
 *   empPerHourAtDemand   = annualCost ÷ demandHours        [demandHours > 0]
 *   empPerHourAtCapacity = annualCost ÷ capacityHours      [capacityHours > 0]
 *   subCost              = subRate × demandHours
 *   breakEvenHours       = annualCost ÷ subRate            [subRate > 0]
 *   utilisation %        = demandHours ÷ capacityHours × 100
 *   gap                  = |annualCost − subCost|
 * The employee's annual cost is fixed (it is paid whether or not the work exists);
 * the subcontractor's cost is purely variable, which is why workload decides.
 */
export default function HireVsSubcontractCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [annualCost, setAnnualCost] = useState(prefill?.annualCost ?? DEFAULTS.annualCost);
  const [capacityHours, setCapacityHours] = useState(prefill?.capacityHours ?? DEFAULTS.capacityHours);
  const [demandHours, setDemandHours] = useState(prefill?.demandHours ?? DEFAULTS.demandHours);
  const [subRate, setSubRate] = useState(prefill?.subRate ?? DEFAULTS.subRate);

  const annual = num(annualCost);
  const capacity = num(capacityHours);
  const demand = num(demandHours);
  const rate = num(subRate);

  const empPerHourAtDemand = demand > 0 ? annual / demand : NaN;
  const empPerHourAtCapacity = capacity > 0 ? annual / capacity : NaN;
  const subCost = rate * demand;
  const breakEvenHours = rate > 0 ? annual / rate : NaN;
  const utilisation = capacity > 0 ? (demand / capacity) * 100 : NaN;
  const gap = Math.abs(annual - subCost);

  const bothKnown = demand > 0 && rate > 0;
  const employeeCheaper = bothKnown && annual < subCost;
  const overCapacity = capacity > 0 && demand > capacity;

  const reset = () => {
    setAnnualCost(DEFAULTS.annualCost); setCapacityHours(DEFAULTS.capacityHours);
    setDemandHours(DEFAULTS.demandHours); setSubRate(DEFAULTS.subRate);
  };

  const copyText = [
    "RateCraft — Hire vs. Subcontract",
    `Employee annual cost (burdened): ${fmt.money(annual)}`,
    `Billable hours available: ${fmt.num(capacity)}`,
    `Billable hours you have: ${fmt.num(demand)}`,
    `Subcontractor rate: ${fmt.money(rate)}/hr`,
    `Employee cost per billable hour at your workload: ${fmt.money(empPerHourAtDemand)}`,
    `Employee cost per billable hour at full capacity: ${fmt.money(empPerHourAtCapacity)}`,
    `Subcontractor cost for the same hours: ${fmt.money(subCost)}`,
    `Break-even billable hours: ${Number.isFinite(breakEvenHours) ? String(Math.ceil(breakEvenHours)) : "—"}`,
    `Utilisation: ${fmt.pct(utilisation)}`,
    bothKnown
      ? `${employeeCheaper ? "Employee" : "Subcontractor"} is cheaper by ${fmt.money(gap)} a year at this workload.`
      : "Enter the workload and the subcontractor rate to compare.",
  ].join("\n");

  return (
    <section aria-label="Hire versus subcontract calculator">
      <LiveRegion
        message={
          Number.isFinite(breakEvenHours)
            ? `Break-even at ${Math.ceil(breakEvenHours)} billable hours a year. Employee cost per billable hour at your workload is ${fmt.money(empPerHourAtDemand)}.`
            : "Enter the employee's annual cost and the subcontractor rate."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The employee</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field
              id="hs-annual"
              label="Fully burdened annual cost"
              value={annualCost}
              onChange={setAnnualCost}
              unit="$"
              hint="Wages + payroll taxes + workers' comp + benefits + gear — the Labor Burden Calculator totals this"
            />
            <Field
              id="hs-capacity"
              label="Billable hours available"
              value={capacityHours}
              onChange={setCapacityHours}
              unit="hrs"
              hint="Paid hours minus PTO, training and non-billable time — the most this role can sell in a year"
            />
            <Field
              id="hs-demand"
              label="Billable hours you have"
              value={demandHours}
              onChange={setDemandHours}
              unit="hrs"
              hint="The work actually available for this role this year"
            />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The alternative</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field
              id="hs-rate"
              label="Subcontractor rate"
              value={subRate}
              onChange={setSubRate}
              unit="$"
              hint="Per billable hour, as invoiced to you"
            />
          </div>
          {overCapacity && (
            <p role="alert" className="callout callout-warning text-small" style={{ marginBottom: 0 }}>
              You&apos;re assuming more billable hours than the role can deliver. Either the demand
              figure or the capacity figure is wrong — or the work needs overtime, a second hire,
              or a subcontractor for the overflow.
            </p>
          )}
          {capacity <= 0 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              Billable hours available must be above zero — a role with no sellable hours can&apos;t be
              compared with anything.
            </span>
          )}

          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Billable hours a year where hiring equals subbing</div>
          <div className="result-primary">
            {Number.isFinite(breakEvenHours) ? fmt.num(Math.ceil(breakEvenHours)) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Employee / yr", value: fmt.money(annual) },
              { label: "Sub rate", value: `${fmt.money(rate)}/hr` },
              { label: "Break-even", value: Number.isFinite(breakEvenHours) ? `${fmt.num(Math.ceil(breakEvenHours))} hrs` : "—", highlight: true },
              { label: "Your hours", value: fmt.num(demand) },
            ]}
          />

          <YourCalculation
            formula="Break-even hours = Annual employee cost ÷ Subcontractor rate"
            substitution={
              Number.isFinite(breakEvenHours)
                ? `${fmt.money(annual)} ÷ ${fmt.money(rate)} = ${fmt.num(breakEvenHours)} → ${fmt.num(Math.ceil(breakEvenHours))} billable hours`
                : "Enter the employee's annual cost and the subcontractor rate"
            }
            note="Above this workload the employee is cheaper; below it, you pay the sub only for the hours that exist."
          />

          {bothKnown && (
            <p
              role="status"
              className="text-small"
              style={{ margin: "var(--space-3) 0 0", fontWeight: 600, color: "var(--color-ink-soft)" }}
            >
              At {fmt.num(demand)} billable hours, the {employeeCheaper ? "employee" : "subcontractor"} is
              cheaper by {fmt.money(gap)} a year — {employeeCheaper ? "although" : "and"} the employee&apos;s
              effective cost is {fmt.money(empPerHourAtDemand)} per billable hour at this workload
              {Number.isFinite(empPerHourAtCapacity) ? ` versus ${fmt.money(empPerHourAtCapacity)} at full capacity` : ""}.
            </p>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Employee annual cost" value={fmt.money(annual)} hint="Paid regardless of the workload" strong />
            <ResultRow
              label="Employee cost per billable hour"
              value={Number.isFinite(empPerHourAtDemand) ? fmt.money(empPerHourAtDemand) : "—"}
              hint={`${fmt.money(annual)} ÷ ${fmt.num(demand)} hrs you actually have`}
            />
            <ResultRow
              label="At full capacity"
              value={Number.isFinite(empPerHourAtCapacity) ? fmt.money(empPerHourAtCapacity) : "—"}
              hint={`${fmt.money(annual)} ÷ ${fmt.num(capacity)} hrs available`}
            />
            <ResultRow
              label="Subcontractor, same hours"
              value={bothKnown ? fmt.money(subCost) : "—"}
              hint={bothKnown ? `${fmt.num(demand)} hrs × ${fmt.money(rate)}/hr` : undefined}
            />
            <ResultRow
              label="Cheaper option"
              value={bothKnown ? (employeeCheaper ? "Employee" : "Subcontractor") : "—"}
              hint={bothKnown ? `Cheaper by ${fmt.money(gap)} a year at ${fmt.num(demand)} billable hours` : "Enter the workload and the subcontractor rate"}
              strong
              tone={bothKnown ? "success" : "default"}
            />
            <ResultRow
              label="Utilisation"
              value={Number.isFinite(utilisation) ? fmt.pct(utilisation) : "—"}
              hint="Billable hours you have ÷ billable hours the role can deliver"
            />
            <ResultRow
              label="Break-even billable hours"
              value={Number.isFinite(breakEvenHours) ? fmt.num(Math.ceil(breakEvenHours)) : "—"}
              hint="Annual cost ÷ sub rate, rounded up"
              strong
            />
          </div>

          <ResultActions text={copyText} label="Hire vs. subcontract calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            Compare cash cost only. Control, scheduling flexibility, who the customer relationship
            belongs to, and employee-versus-contractor rules all sit outside this arithmetic — and
            in most places the last one is a question for your accountant, not a calculator.
          </p>
        </div>
      </div>
    </section>
  );
}
