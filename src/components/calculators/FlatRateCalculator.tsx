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
  hours: "2", rate: "55", trip: "30", materials: "85",
  other: "0", overhead: "15", margin: "35", minimum: "0", roundTo: "5",
};

/** ceil to the nearest increment; increment floored at 1 to avoid div-by-zero */
function roundUp(value: number, increment: number): number {
  const inc = increment >= 1 ? increment : 1;
  return Math.ceil(value / inc) * inc;
}

/**
 * Flat Rate Pricing Calculator. Math per docs/phase-4-flat-rate-spec.md:
 *   labor = hours × burdenedRate
 *   direct = labor + trip + materials + other
 *   overhead = direct × overheadPct
 *   total = direct + overhead
 *   rawPrice = total / (1 − margin/100)          [0 < margin < 100]
 *   suggestedMin = roundUp(total0 / (1 − margin/100), roundTo)   [materials+other = 0]
 *   afterMin = max(rawPrice, minimum)
 *   price = roundUp(afterMin, roundTo)
 *   profit = price − total ; marginAchieved = profit / price × 100
 * Profit and achieved margin are ALWAYS computed from the final rounded price.
 */
export default function FlatRateCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [hours, setHours] = useState(prefill?.hours ?? DEFAULTS.hours);
  const [rate, setRate] = useState(prefill?.rate ?? DEFAULTS.rate);
  const [trip, setTrip] = useState(prefill?.trip ?? DEFAULTS.trip);
  const [materials, setMaterials] = useState(prefill?.materials ?? DEFAULTS.materials);
  const [other, setOther] = useState(prefill?.other ?? DEFAULTS.other);
  const [overhead, setOverhead] = useState(prefill?.overhead ?? DEFAULTS.overhead);
  const [margin, setMargin] = useState(prefill?.margin ?? DEFAULTS.margin);
  const [minimum, setMinimum] = useState(prefill?.minimum ?? DEFAULTS.minimum);
  const [roundTo, setRoundTo] = useState(prefill?.roundTo ?? DEFAULTS.roundTo);

  const h = num(hours);
  const r = num(rate);
  const labor = h * r;
  const direct = labor + num(trip) + num(materials) + num(other);
  const overheadAmt = direct * (num(overhead) / 100);
  const total = direct + overheadAmt;
  const m = num(margin);
  const marginValid = m > 0 && m < 100;
  const rawPrice = marginValid ? total / (1 - m / 100) : NaN;

  // Suggested minimum: same job with materials & other = 0 (the smallest sensible call).
  const totalNoParts = labor + num(trip) + (labor + num(trip)) * (num(overhead) / 100);
  const inc = num(roundTo) >= 1 ? num(roundTo) : 1;
  const suggestedMin = marginValid ? roundUp(totalNoParts / (1 - m / 100), inc) : NaN;

  const userMin = num(minimum);
  const afterMin = marginValid ? Math.max(rawPrice, userMin) : NaN;
  const raisedToMin = marginValid && userMin > rawPrice;
  const price = marginValid ? roundUp(afterMin, inc) : NaN;
  const profit = price - total;
  const marginAchieved = price > 0 ? (profit / price) * 100 : NaN;
  const markup = total > 0 ? (profit / total) * 100 : NaN;
  const multiplier = total > 0 ? price / total : NaN;

  const reset = () => {
    setHours(DEFAULTS.hours); setRate(DEFAULTS.rate); setTrip(DEFAULTS.trip);
    setMaterials(DEFAULTS.materials); setOther(DEFAULTS.other); setOverhead(DEFAULTS.overhead);
    setMargin(DEFAULTS.margin); setMinimum(DEFAULTS.minimum); setRoundTo(DEFAULTS.roundTo);
  };

  const copyText = [
    "RateCraft — Flat Rate Pricing Calculation",
    `Labor: ${fmt.num(h)} hrs × ${fmt.money(r)} = ${fmt.money(labor)}`,
    `Trip cost: ${fmt.money(num(trip))}`,
    `Materials: ${fmt.money(num(materials))}`,
    `Other direct: ${fmt.money(num(other))}`,
    `Overhead (${fmt.num(num(overhead))}%): ${fmt.money(overheadAmt)}`,
    `Total cost: ${fmt.money(total)}`,
    `Target margin: ${fmt.num(m)}% (raw price ${fmt.money(rawPrice)})`,
    raisedToMin ? `Minimum charge applied: ${fmt.money(userMin)}` : null,
    `Flat-rate price (rounded to ${fmt.money(inc)}): ${fmt.money(price)}`,
    `Gross profit: ${fmt.money(profit)}`,
    `Achieved margin: ${fmt.pct(marginAchieved)} (markup ${fmt.pct(markup)})`,
  ].filter(Boolean).join("\n");

  return (
    <section aria-label="Flat rate pricing calculator">
      <LiveRegion
        message={
          marginValid
            ? `Flat-rate price ${fmt.money(price)}. Gross profit ${fmt.money(profit)}. Achieved margin ${fmt.pct(marginAchieved)}.`
            : "Enter a target margin between 0 and 100."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>On-site work</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <Field id="fr-hours" label="Labor hours on the job" value={hours} onChange={setHours} unit="hrs" />
            <Field id="fr-rate" label="Burdened labor rate" value={rate} onChange={setRate} unit="$" hint="Per hour, with taxes and insurance included — see the Labor Burden Calculator" />
          </div>
          {h > 0 && r <= 0 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              The labor rate is zero, so the price charges nothing for your time. Enter your
              burdened hourly rate unless the labor is genuinely free.
            </span>
          )}

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Getting there</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="fr-trip" label="Trip cost" value={trip} onChange={setTrip} unit="$" hint="Fuel, vehicle wear and unbillable drive time — a real cost, not a surcharge" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Parts &amp; other</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="fr-materials" label="Materials (at cost)" value={materials} onChange={setMaterials} unit="$" hint="What the parts cost you — the margin applies to the whole job" />
            <Field id="fr-other" label="Permits / disposal / other" value={other} onChange={setOther} unit="$" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Your business</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <Field id="fr-overhead" label="Overhead allowance" value={overhead} onChange={setOverhead} unit="%" hint="of direct cost" />
            <Field id="fr-margin" label="Target margin" value={margin} onChange={setMargin} unit="%" hint="Between 0 and 100" />
          </div>
          {m >= 100 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              A 100% margin is impossible — the price would be infinite. Enter a value below 100.
            </span>
          )}
          {m <= 0 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              A margin of 0% or less means no profit. Enter a value above 0.
            </span>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
            <Field
              id="fr-minimum"
              label="Suggested minimum charge"
              value={minimum}
              onChange={setMinimum}
              unit="$"
              hint={`Editable suggestion for your smallest sensible call: ~${fmt.money(suggestedMin)}. Raise, lower, or zero it.`}
            />
            <Field id="fr-roundto" label="Round price to nearest" value={roundTo} onChange={setRoundTo} unit="$" hint="Quotes are round numbers — try 5, 10 or 25" />
          </div>

          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div>
          <div className="result-panel">
            <div className="result-label">Flat-rate price</div>
            <div className="result-primary">{marginValid ? fmt.price(price) : "—"}</div>

            <MathFlow
              steps={[
                { label: "Total cost", value: fmt.money(total) },
                { label: "÷ Margin", value: marginValid ? `${fmt.num(m)}%` : "—" },
                { label: "Raw price", value: marginValid ? fmt.money(rawPrice) : "—" },
                { label: "Final price", value: marginValid ? fmt.money(price) : "—", highlight: true },
                { label: "Profit", value: marginValid ? fmt.money(profit) : "—" },
              ]}
            />

            <YourCalculation
              formula="Price = Total cost ÷ (1 − Margin), rounded up"
              substitution={
                marginValid
                  ? `${fmt.money(total)} ÷ ${(1 - m / 100).toFixed(2)} = ${fmt.money(rawPrice)} → ${fmt.money(price)}${raisedToMin ? ` (your ${fmt.money(userMin)} minimum applied)` : ""}`
                  : "Enter a target margin between 0 and 100"
              }
            />

            {raisedToMin && (
              <p role="status" className="text-small" style={{ color: "var(--color-warning)", margin: "var(--space-2) 0 0" }}>
                Your minimum charge of {fmt.money(userMin)} is above the calculated price, so the
                final price was raised to it (before rounding).
              </p>
            )}

            <div style={{ marginTop: "var(--space-4)" }}>
              <ResultRow label="Labor" value={fmt.money(labor)} hint={`${fmt.num(h)} hrs × ${fmt.money(r)}/hr burdened`} />
              <ResultRow label="Trip cost" value={fmt.money(num(trip))} />
              <ResultRow label="Materials (at cost)" value={fmt.money(num(materials))} />
              <ResultRow label="Permits / other" value={fmt.money(num(other))} />
              <ResultRow label="Overhead allowance" value={fmt.money(overheadAmt)} hint={`${fmt.num(num(overhead))}% of direct cost`} />
              <ResultRow label="Total cost" value={fmt.money(total)} strong />
              <ResultRow label="Gross profit" value={fmt.money(profit)} tone="success" strong />
              <ResultRow label="Achieved margin" value={fmt.pct(marginAchieved)} hint={`Target was ${fmt.num(m)}% — rounding moves it slightly`} strong tone="success" />
              {Number.isFinite(markup) && (
                <ResultRow label="Equivalent markup" value={fmt.pct(markup)} hint={`Pricing to a ${fmt.num(m)}% margin = a ${fmt.pct(markup)} markup on cost`} />
              )}
              {num(materials) > 0 && Number.isFinite(multiplier) && (
                <ResultRow label="Effective multiplier on cost" value={`${fmt.num(multiplier)}×`} hint="Compare with price-book parts multipliers" />
              )}
            </div>

            <ResultActions text={copyText} label="Flat rate calculation" />

            <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
              {marginValid
                ? `Pricing to a ${fmt.num(m)}% margin means every dollar of this price keeps ${fmt.pct(m)} after direct costs and overhead. The profit above is what's left before your own net income.`
                : "Enter a target margin between 0 and 100 to see the price."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
