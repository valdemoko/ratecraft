"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULTS = {
  hours: "16", rate: "45", materials: "900", subs: "0",
  travel: "40", other: "0", overhead: "15", margin: "35",
};

/**
 * Job pricing calculator. Math (Phase 0-verified, unchanged):
 *   direct = hours×rate + materials + subs + travel + other
 *   overheadAmt = direct × overhead% ; totalCost = direct + overheadAmt
 *   price = totalCost / (1 − margin/100), valid for 0 < margin < 100
 */
export default function JobPricingCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [hours, setHours] = useState(prefill?.hours ?? DEFAULTS.hours);
  const [rate, setRate] = useState(prefill?.rate ?? DEFAULTS.rate);
  const [materials, setMaterials] = useState(prefill?.materials ?? DEFAULTS.materials);
  const [subs, setSubs] = useState(prefill?.subs ?? DEFAULTS.subs);
  const [travel, setTravel] = useState(prefill?.travel ?? DEFAULTS.travel);
  const [other, setOther] = useState(prefill?.other ?? DEFAULTS.other);
  const [overhead, setOverhead] = useState(prefill?.overhead ?? DEFAULTS.overhead);
  const [margin, setMargin] = useState(prefill?.margin ?? DEFAULTS.margin);

  const labor = num(hours) * num(rate);
  const direct = labor + num(materials) + num(subs) + num(travel) + num(other);
  const overheadAmt = direct * (num(overhead) / 100);
  const totalCost = direct + overheadAmt;
  const m = num(margin);
  const valid = m > 0 && m < 100;
  const price = valid ? totalCost / (1 - m / 100) : NaN;
  const profit = valid ? price - totalCost : NaN;

  const reset = () => {
    setHours(DEFAULTS.hours); setRate(DEFAULTS.rate); setMaterials(DEFAULTS.materials);
    setSubs(DEFAULTS.subs); setTravel(DEFAULTS.travel); setOther(DEFAULTS.other);
    setOverhead(DEFAULTS.overhead); setMargin(DEFAULTS.margin);
  };

  const copyText = [
    "RateCraft — Job Pricing Calculation",
    `Labor: ${fmt.money(labor)} (${fmt.num(num(hours))} hrs × ${fmt.money(num(rate))})`,
    `Materials: ${fmt.money(num(materials))}`,
    `Subcontractors: ${fmt.money(num(subs))}`,
    `Travel/fuel: ${fmt.money(num(travel))}`,
    `Other direct: ${fmt.money(num(other))}`,
    `Overhead (${fmt.num(num(overhead))}%): ${fmt.money(overheadAmt)}`,
    `Total cost: ${fmt.money(totalCost)}`,
    `Recommended price (${fmt.num(m)}% margin): ${fmt.money(price)}`,
    `Gross profit: ${fmt.money(profit)}`,
  ].join("\n");

  return (
    <section aria-label="Job pricing calculator">
      <LiveRegion
        message={valid ? `Recommended price ${fmt.price(price)}. Gross profit ${fmt.money(profit)}.` : "Enter a target margin between 0 and 100."}
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Labor on this job</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <Field id="jp-hours" label="Labor hours" value={hours} onChange={setHours} unit="hrs" />
            <Field id="jp-rate" label="Hourly cost" value={rate} onChange={setRate} unit="$" hint="Use your burdened rate" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Materials &amp; other costs</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="jp-materials" label="Materials" value={materials} onChange={setMaterials} unit="$" />
            <Field id="jp-subs" label="Subcontractors" value={subs} onChange={setSubs} unit="$" />
            <Field id="jp-travel" label="Travel / fuel" value={travel} onChange={setTravel} unit="$" />
            <Field id="jp-other" label="Other direct costs" value={other} onChange={setOther} unit="$" hint="Permits, disposal, rental equipment…" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Your business costs</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <Field id="jp-overhead" label="Overhead allowance" value={overhead} onChange={setOverhead} unit="%" hint="of direct cost" />
            <Field id="jp-margin" label="Target margin" value={margin} onChange={setMargin} unit="%" hint="Between 0 and 100" />
          </div>
          {m >= 100 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)" }}>
              A 100% margin is impossible — the price would be infinite. Enter a value below 100.
            </span>
          )}

          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div>
          <div className="result-panel">
            <div className="result-label">Recommended price</div>
            <div className="result-primary">{valid ? fmt.price(price) : "—"}</div>
            <MathFlow
              steps={[
                { label: "Direct cost", value: fmt.money(direct) },
                { label: "Overhead", value: fmt.money(overheadAmt) },
                { label: "Total cost", value: fmt.money(totalCost) },
                { label: "Price", value: valid ? fmt.price(price) : "—", highlight: true },
                { label: "Profit", value: valid ? fmt.money(profit) : "—" },
              ]}
            />

            <YourCalculation
              formula="Price = Total cost ÷ (1 − Margin)"
              substitution={
                valid
                  ? `${fmt.money(totalCost)} ÷ ${(1 - m / 100).toFixed(2)} = ${fmt.money(price)}`
                  : "Enter a target margin between 0 and 100"
              }
              note="Dividing prices to the margin correctly — multiplying by (1 + markup) would understate the price."
            />

            <ResultActions text={copyText} label="Job pricing calculation" />
          </div>

          <div className="card card-pad mt-4">
            <h2 style={{ fontSize: "var(--text-h3)" }}>Cost breakdown</h2>
            <div className="table-wrap">
              <table>
                <tbody>
                  <tr>
                    <td>Labor</td>
                    <td className="text-faint" style={{ fontSize: "var(--text-label)" }}>
                      {fmt.num(num(hours))} hrs × {fmt.money(num(rate))}/hr
                    </td>
                    <td className="num">{fmt.money(labor)}</td>
                  </tr>
                  <tr><td>Materials</td><td></td><td className="num">{fmt.money(num(materials))}</td></tr>
                  <tr><td>Subcontractors</td><td></td><td className="num">{fmt.money(num(subs))}</td></tr>
                  <tr><td>Travel / fuel</td><td></td><td className="num">{fmt.money(num(travel))}</td></tr>
                  <tr><td>Other direct</td><td></td><td className="num">{fmt.money(num(other))}</td></tr>
                  <tr>
                    <td>Overhead allowance</td>
                    <td className="text-faint" style={{ fontSize: "var(--text-label)" }}>{fmt.num(num(overhead))}% of direct</td>
                    <td className="num">{fmt.money(overheadAmt)}</td>
                  </tr>
                  <tr className="total-row">
                    <td>Total job cost</td><td></td>
                    <td className="num">{fmt.money(totalCost)}</td>
                  </tr>
                  <tr>
                    <td>Gross profit</td>
                    <td className="text-faint" style={{ fontSize: "var(--text-label)" }}>at {fmt.num(m)}% margin</td>
                    <td className="num" style={{ color: "var(--color-success)", fontWeight: 700 }}>
                      {valid ? fmt.money(profit) : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
