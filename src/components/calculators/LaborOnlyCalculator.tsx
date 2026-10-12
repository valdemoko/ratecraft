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
  hours: "8", rate: "38", margin: "35", riskPct: "10", handleHours: "1", warrantyMonths: "12",
};

/**
 * Labor-only quote calculator. Math (verified in tests/math-verification.mjs, section 28):
 *   laborCost   = hours × burdenedRate
 *   handleCost  = handleHours × burdenedRate         (collecting/checking customer-supplied materials)
 *   baseCost    = laborCost + handleCost
 *   riskLoad    = baseCost × riskPct/100             (rework & delay risk shifts to you)
 *   price       = (baseCost + riskLoad) ÷ (1 − margin/100)
 *   laborPrice  = price ÷ hours                      (effective labor-only hourly rate)
 * A labor-only job carries risks a turnkey job doesn't: the customer's material may be
 * wrong, late or defective — and the rework lands on your labor. The risk load prices that
 * transfer explicitly instead of absorbing it in hope.
 */
export default function LaborOnlyCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [hours, setHours] = useState(prefill?.hours ?? DEFAULTS.hours);
  const [rate, setRate] = useState(prefill?.rate ?? DEFAULTS.rate);
  const [margin, setMargin] = useState(prefill?.margin ?? DEFAULTS.margin);
  const [riskPct, setRiskPct] = useState(prefill?.riskPct ?? DEFAULTS.riskPct);
  const [handleHours, setHandleHours] = useState(prefill?.handleHours ?? DEFAULTS.handleHours);

  const h = num(hours);
  const r = num(rate);
  const m = num(margin);
  const risk = num(riskPct);
  const hh = num(handleHours);

  const valid = h > 0 && r > 0 && m > 0 && m < 100 && risk >= 0 && hh >= 0;
  const laborCost = h * r;
  const handleCost = hh * r;
  const baseCost = laborCost + handleCost;
  const riskLoad = baseCost * (risk / 100);
  const price = valid ? (baseCost + riskLoad) / (1 - m / 100) : NaN;
  const effectiveRate = price / h;
  const warrantyMonths = 12;
  const turnkeyCompare = (baseCost + riskLoad) / (1 - m / 100) / (h + hh);

  const reset = () => {
    setHours(DEFAULTS.hours); setRate(DEFAULTS.rate); setMargin(DEFAULTS.margin);
    setRiskPct(DEFAULTS.riskPct); setHandleHours(DEFAULTS.handleHours);
  };

  const copyText = [
    "RateCraft — Labor-Only Quote",
    `Labor: ${fmt.num(h)} hrs × ${fmt.money(r)} burdened = ${fmt.money(laborCost)}`,
    `Material handling: ${fmt.num(hh)} hrs = ${fmt.money(handleCost)}`,
    `Risk load at ${fmt.pct(risk)}: ${fmt.money(riskLoad)}`,
    `Labor-only quote at ${fmt.pct(m)} margin: ${fmt.money(price)}`,
    `Effective labor rate: ${fmt.money(effectiveRate)}/hr billed on-site`,
    `Terms to state: labor warranty ${warrantyMonths} months on workmanship only; no material warranty; delays or defects in customer-supplied materials re-quoted at ${fmt.money(effectiveRate)}/hr`,
  ].join("\n");

  return (
    <section aria-label="Labor-only quote calculator">
      <LiveRegion
        message={
          valid
            ? `Labor-only quote ${fmt.money(price)} — an effective ${fmt.money(effectiveRate)} per on-site hour with the material risk priced in.`
            : "Enter the hours, burdened rate and margin to build the labor-only price."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The work</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="lo-hours" label="On-site hours" value={hours} onChange={setHours} unit="hrs" />
            <Field id="lo-rate" label="Burdened labor rate" value={rate} onChange={setRate} unit="$" hint="The Labor Burden Calculator produces your true hourly cost" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The customer-supplied material</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="lo-handle" label="Hours to collect / verify materials" value={handleHours} onChange={setHandleHours} unit="hrs" hint="Pickup runs, checking the right parts arrived, returns when they don't" />
            <Field id="lo-risk" label="Risk load" value={riskPct} onChange={setRiskPct} unit="%" hint="Rework & delay risk that shifts to you when you didn't supply the material — 10–15% is a defensible ask" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The margin</h2>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <Field id="lo-margin" label="Target gross margin" value={margin} onChange={setMargin} unit="%" hint="Between 0 and 100" />
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Labor-only quote</div>
          <div className="result-primary" style={{ color: "var(--color-brand)" }}>
            {valid ? fmt.money(price) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Labor", value: fmt.money(laborCost) },
              { label: "+ handling", value: fmt.money(handleCost) },
              { label: "+ risk", value: fmt.money(riskLoad) },
              { label: `÷ ${(1 - m / 100).toFixed(2)}`, value: fmt.money(price), highlight: true },
            ]}
          />

          <YourCalculation
            formula="Quote = (Labor + Handling + Risk load) ÷ (1 − Target margin)"
            substitution={
              valid
                ? `(${fmt.money(laborCost)} + ${fmt.money(handleCost)} + ${fmt.money(riskLoad)}) ÷ ${(1 - m / 100).toFixed(2)} = ${fmt.money(price)}`
                : "Enter hours, rate and a margin between 0 and 100"
            }
            note="The risk load prices what labor-only actually transfers to you: wrong parts, late deliveries and rework you can't bill the supplier for."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Labor cost" value={fmt.money(laborCost)} hint={`${fmt.num(h)} hrs × ${fmt.money(r)}`} />
            <ResultRow label="Material handling cost" value={fmt.money(handleCost)} hint={`${fmt.num(hh)} hrs of pickup/verify/returns`} />
            <ResultRow label="Risk load" value={fmt.money(riskLoad)} hint={`${fmt.pct(risk)} of base cost — the rework insurance the quote owes you`} tone="warning" />
            <ResultRow label="Labor-only quote" value={valid ? fmt.money(price) : "—"} strong />
            <ResultRow label="Effective labor rate on site" value={valid ? `${fmt.money(effectiveRate)}/hr` : "—"} hint={`Compare with ${fmt.money(turnkeyCompare)}/hr equivalent across on-site + handling hours`} strong />
            <ResultRow label="Profit in the quote" value={valid ? fmt.money(price - baseCost - riskLoad) : "—"} hint={`${fmt.pct(m)} margin on the whole cost base`} tone="success" />
          </div>

          <ResultActions text={copyText} label="Labor-only quote calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            The quote only works with the terms printed on it: warranty covers workmanship
            only — not the customer&apos;s material; delays or defects in supplied materials are
            re-quoted at the same effective rate; and the customer buys replacements, not you.
            Labor-only without those three sentences is a turnkey job&apos;s risk at a labor-only
            price — which is exactly why many contractors refuse it.
          </p>
        </div>
      </div>
    </section>
  );
}
