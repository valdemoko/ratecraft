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
  wage: "25", hoursPaid: "2080", taxes: "12", comp: "6",
  benefits: "5", otherAnnual: "1200", ptoHours: "120", nonBillable: "10",
};

/**
 * Labor burden calculator. Math (Phase 0-verified, unchanged):
 *   base = wage × hoursPaid
 *   total = base × (1 + taxes% + comp% + benefits%) + otherAnnual
 *   billable = max(hoursPaid − pto, 0) × (1 − nonBillable/100)
 *   burdenedHourly = total ÷ billable (requires billable > 0)
 *   burdenRate = (total − base) ÷ base × 100
 */
export default function LaborBurdenCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [wage, setWage] = useState(prefill?.wage ?? DEFAULTS.wage);
  const [hoursPaid, setHoursPaid] = useState(prefill?.hoursPaid ?? DEFAULTS.hoursPaid);
  const [taxes, setTaxes] = useState(prefill?.taxes ?? DEFAULTS.taxes);
  const [comp, setComp] = useState(prefill?.comp ?? DEFAULTS.comp);
  const [benefits, setBenefits] = useState(prefill?.benefits ?? DEFAULTS.benefits);
  const [otherAnnual, setOtherAnnual] = useState(prefill?.otherAnnual ?? DEFAULTS.otherAnnual);
  const [ptoHours, setPtoHours] = useState(prefill?.ptoHours ?? DEFAULTS.ptoHours);
  const [nonBillable, setNonBillable] = useState(prefill?.nonBillable ?? DEFAULTS.nonBillable);

  const baseAnnual = num(wage) * num(hoursPaid);
  const taxAnnual = baseAnnual * (num(taxes) / 100);
  const compAnnual = baseAnnual * (num(comp) / 100);
  const benefitsAnnual = baseAnnual * (num(benefits) / 100);
  const totalAnnual = baseAnnual + taxAnnual + compAnnual + benefitsAnnual + num(otherAnnual);

  const billable = Math.max(num(hoursPaid) - num(ptoHours), 0) * (1 - num(nonBillable) / 100);
  const burdenedHourly = billable > 0 ? totalAnnual / billable : NaN;
  const burdenRate = baseAnnual > 0 ? ((totalAnnual - baseAnnual) / baseAnnual) * 100 : NaN;
  const noBillable = billable <= 0;

  const reset = () => {
    setWage(DEFAULTS.wage); setHoursPaid(DEFAULTS.hoursPaid); setTaxes(DEFAULTS.taxes);
    setComp(DEFAULTS.comp); setBenefits(DEFAULTS.benefits); setOtherAnnual(DEFAULTS.otherAnnual);
    setPtoHours(DEFAULTS.ptoHours); setNonBillable(DEFAULTS.nonBillable);
  };

  const copyText = [
    "RateCraft — Labor Burden Calculation",
    `Base wage: ${fmt.money(num(wage))}/hr × ${fmt.num(num(hoursPaid))} hrs = ${fmt.money(baseAnnual)}`,
    `Payroll taxes (${fmt.num(num(taxes))}%): ${fmt.money(taxAnnual)}`,
    `Workers' comp (${fmt.num(num(comp))}%): ${fmt.money(compAnnual)}`,
    `Benefits (${fmt.num(num(benefits))}%): ${fmt.money(benefitsAnnual)}`,
    `Other: ${fmt.money(num(otherAnnual))}`,
    `Total annual cost: ${fmt.money(totalAnnual)}`,
    `Billable hours: ${fmt.num(billable)}`,
    `Fully burdened hourly cost: ${fmt.money(burdenedHourly)}`,
    `Burden rate: ${fmt.pct(burdenRate)}`,
  ].join("\n");

  return (
    <section aria-label="Labor burden calculator">
      <LiveRegion
        message={Number.isFinite(burdenedHourly) ? `Fully burdened hourly cost ${fmt.money(burdenedHourly)}.` : "Reduce non-billable time so the employee has some billable hours."}
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Wages</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <Field id="lb-wage" label="Base hourly wage" value={wage} onChange={setWage} unit="$" />
            <Field id="lb-hours" label="Paid hours / year" value={hoursPaid} onChange={setHoursPaid} unit="hrs" hint="Full time ≈ 2,080" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Burden costs (annual)</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="lb-taxes" label="Payroll taxes" value={taxes} onChange={setTaxes} unit="%" hint="FICA + FUTA + SUTA, typically 10–15%" />
            <Field id="lb-comp" label="Workers' comp insurance" value={comp} onChange={setComp} unit="%" hint="Varies a lot by trade class code" />
            <Field id="lb-benefits" label="Benefits" value={benefits} onChange={setBenefits} unit="%" hint="Health, retirement, phone allowance…" />
            <Field id="lb-other" label="Other fixed annual costs" value={otherAnnual} onChange={setOtherAnnual} unit="$" hint="Training, uniforms, tools, licensing" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Non-billable time</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <Field id="lb-pto" label="PTO / holidays" value={ptoHours} onChange={setPtoHours} unit="hrs" />
            <Field id="lb-nonbill" label="Non-billable share" value={nonBillable} onChange={setNonBillable} unit="%" hint="Quoting, admin, windshield time" />
          </div>
          {noBillable && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              Billable hours are zero — the hourly cost divides by the hours actually worked, so
              reduce PTO or the non-billable share.
            </span>
          )}

          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Fully burdened hourly cost</div>
          <div className="result-primary">
            {Number.isFinite(burdenedHourly) ? fmt.money(burdenedHourly) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Base wage", value: `${fmt.money(num(wage))}/hr` },
              { label: "+ Burden", value: fmt.pct(burdenRate) },
              { label: "Annual cost", value: fmt.money(totalAnnual) },
              { label: "Billable hrs", value: fmt.num(billable) },
              { label: "True hourly", value: Number.isFinite(burdenedHourly) ? fmt.money(burdenedHourly) : "—", highlight: true },
            ]}
          />

          <YourCalculation
            formula="Burdened hourly = Total annual cost ÷ Billable hours"
            substitution={
              Number.isFinite(burdenedHourly)
                ? `${fmt.money(totalAnnual)} ÷ ${fmt.num(billable)} = ${fmt.money(burdenedHourly)}`
                : "Billable hours are zero — adjust PTO or the non-billable share"
            }
            note="Dividing by billable hours (not paid hours) is what makes this the true rate."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Base annual pay" value={fmt.money(baseAnnual)} hint={`${fmt.money(num(wage))}/hr × ${fmt.num(num(hoursPaid))} hrs`} />
            <ResultRow label="Payroll taxes" value={fmt.money(taxAnnual)} />
            <ResultRow label="Workers' comp" value={fmt.money(compAnnual)} />
            <ResultRow label="Benefits" value={fmt.money(benefitsAnnual)} />
            <ResultRow label="Other costs" value={fmt.money(num(otherAnnual))} />
            <ResultRow label="Total annual cost" value={fmt.money(totalAnnual)} strong />
            <ResultRow label="Billable hours / year" value={fmt.num(billable)} hint={`${fmt.num(num(hoursPaid) - num(ptoHours))} hrs × (1 − ${fmt.num(num(nonBillable))}%)`} />
            <ResultRow label="Labor burden rate" value={fmt.pct(burdenRate)} hint="Cost above base wage ÷ base wage" strong tone="success" />
          </div>

          <ResultActions text={copyText} label="Labor burden calculation" />
        </div>
      </div>
    </section>
  );
}
