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
  wage: "25", burdenPct: "31", otHoursWeek: "8", otMultiplier: "1.5", weeksYear: "48",
};

/**
 * Overtime & crew cost calculator. Math (verified in tests/math-verification.mjs, section 20):
 *   burdenedWage  = wage × (1 + burdenPct/100)
 *   burdenedOT    = burdenedWage × otMultiplier
 *   otHoursYear   = otHoursWeek × weeksYear
 *   otPremiumYear = otHoursYear × burdenedWage × (otMultiplier − 1)   ← the true extra cost
 *   straightYear  = 40 × weeksYear × burdenedWage
 *   otSharePct    = otPremiumYear ÷ (straightYear + otPremiumYear) × 100
 * Note: burden percentages (taxes, comp) apply to overtime wages too — costing OT at the
 * bare wage multiplier ignores that. The premium row isolates what OT costs beyond the
 * same hours at straight time.
 */
export default function OvertimeCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [wage, setWage] = useState(prefill?.wage ?? DEFAULTS.wage);
  const [burdenPct, setBurdenPct] = useState(prefill?.burdenPct ?? DEFAULTS.burdenPct);
  const [otHoursWeek, setOtHoursWeek] = useState(prefill?.otHoursWeek ?? DEFAULTS.otHoursWeek);
  const [otMultiplier, setOtMultiplier] = useState(prefill?.otMultiplier ?? DEFAULTS.otMultiplier);
  const [weeksYear, setWeeksYear] = useState(prefill?.weeksYear ?? DEFAULTS.weeksYear);

  const w = num(wage);
  const b = num(burdenPct);
  const mult = num(otMultiplier);
  const otWk = num(otHoursWeek);
  const weeks = num(weeksYear);

  const valid = w > 0 && mult >= 1 && weeks > 0 && otWk >= 0;
  const burdenedWage = w * (1 + b / 100);
  const burdenedOT = burdenedWage * mult;
  const otHoursYear = otWk * weeks;
  const straightHoursYear = 40 * weeks;
  const otTotalYear = otHoursYear * burdenedOT;
  const straightTotalYear = straightHoursYear * burdenedWage;
  const otPremiumYear = otHoursYear * burdenedWage * (mult - 1);
  const otSharePct =
    straightTotalYear + otTotalYear > 0 ? (otTotalYear / (straightTotalYear + otTotalYear)) * 100 : NaN;
  const otPctOfWorkforce = straightHoursYear > 0 ? (otHoursYear / straightHoursYear) * 100 : NaN;

  const reset = () => {
    setWage(DEFAULTS.wage); setBurdenPct(DEFAULTS.burdenPct); setOtHoursWeek(DEFAULTS.otHoursWeek);
    setOtMultiplier(DEFAULTS.otMultiplier); setWeeksYear(DEFAULTS.weeksYear);
  };

  const copyText = [
    "RateCraft — Overtime Cost",
    `Base wage: ${fmt.money(w)}/hr · Burden: ${fmt.pct(b)} → burdened ${fmt.money(burdenedWage)}/hr`,
    `Overtime: ${fmt.num(otWk)} hrs/week at ${mult}× → ${fmt.money(burdenedOT)}/hr burdened`,
    `OT hours/year: ${fmt.num(otHoursYear)} (${fmt.pct(otPctOfWorkforce)} of a 40-hr week schedule)`,
    `OT labor cost/year: ${fmt.money(otTotalYear)}`,
    `Premium beyond straight time: ${fmt.money(otPremiumYear)}/year`,
    `OT share of total labor cost: ${fmt.pct(otSharePct)}`,
  ].join("\n");

  return (
    <section aria-label="Overtime cost calculator">
      <LiveRegion
        message={
          valid && otWk > 0
            ? `Overtime costs ${fmt.money(burdenedOT)} per hour fully burdened — ${fmt.money(otPremiumYear)} a year of premium beyond straight time at ${fmt.num(otWk)} hours a week.`
            : "Enter a wage and overtime hours to see the true cost of the extra hours."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The wage</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ot-wage" label="Base hourly wage" value={wage} onChange={setWage} unit="$" />
            <Field id="ot-burden" label="Labor burden on top" value={burdenPct} onChange={setBurdenPct} unit="%" hint="Payroll taxes, workers' comp, benefits — the Labor Burden Calculator computes it" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The overtime</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ot-hours" label="Overtime hours per week" value={otHoursWeek} onChange={setOtHoursWeek} unit="hrs" />
            <Field id="ot-mult" label="Overtime multiplier" value={otMultiplier} onChange={setOtMultiplier} unit="×" hint="1.5 is the common statutory rate; double time on Sundays/holidays where it applies" />
            <Field id="ot-weeks" label="Weeks per year at this level" value={weeksYear} onChange={setWeeksYear} unit="wks" />
          </div>
          {mult > 0 && mult < 1 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              An overtime multiplier below 1× would pay less than the normal wage. Enter 1 or more.
            </span>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Burdened cost of an overtime hour</div>
          <div className="result-primary" style={{ color: "var(--color-brand)" }}>
            {valid ? `${fmt.money(burdenedOT)}/hr` : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Wage", value: fmt.money(w) },
              { label: "+ Burden", value: fmt.money(burdenedWage) },
              { label: `× ${mult}`, value: fmt.money(burdenedOT), highlight: true },
              { label: "× OT hrs/yr", value: fmt.money(otTotalYear) },
            ]}
          />

          <YourCalculation
            formula="Burdened OT rate = Wage × (1 + Burden) × Multiplier"
            substitution={
              valid
                ? `${fmt.money(w)} × ${(1 + b / 100).toFixed(2)} × ${mult} = ${fmt.money(burdenedOT)}/hr`
                : "Enter a wage and a multiplier of 1 or more"
            }
            note="Payroll taxes and workers' comp ride on overtime wages exactly as they do on straight ones — the multiplier applies to the burdened rate, not the bare wage."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Burdened straight-time rate" value={valid ? `${fmt.money(burdenedWage)}/hr` : "—"} hint={`Wage ${fmt.money(w)} + ${fmt.pct(b)} burden`} />
            <ResultRow label="Burdened overtime rate" value={valid ? `${fmt.money(burdenedOT)}/hr` : "—"} strong />
            <ResultRow label="OT hours per year" value={valid ? fmt.num(otHoursYear) : "—"} hint={`${fmt.pct(otPctOfWorkforce)} on top of a 40-hr week schedule`} />
            <ResultRow label="OT labor cost per year" value={valid ? fmt.money(otTotalYear) : "—"} />
            <ResultRow
              label="Premium beyond straight time"
              value={valid ? fmt.money(otPremiumYear) : "—"}
              hint="What the multiplier alone costs, above the same hours at 1×"
              tone="warning"
              strong
            />
            <ResultRow label="OT share of total labor cost" value={valid && otWk > 0 ? fmt.pct(otSharePct) : "—"} hint="If this approaches the OT share of hours, the premium isn't being priced" />
          </div>

          <ResultActions text={copyText} label="Overtime cost calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            Two honest readings of the premium: if the extra hours are billed to customers at
            higher rates, the premium can be passed on — price rush work with it in mind. If
            they&apos;re not, persistent overtime is often cheaper to fix with a hire: run the{" "}
            <strong>Hire vs. Subcontract Calculator</strong> on the annual premium.
          </p>
        </div>
      </div>
    </section>
  );
}
