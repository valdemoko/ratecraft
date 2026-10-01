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
  origPrice: "4000", origCost: "2400", hoursExtra: "6", rateExtra: "42",
  materialsExtra: "180", margin: "35",
};

/**
 * Change order calculator. Math (verified in tests/math-verification.mjs, section 15):
 *   extraCost = hours × rate + materials
 *   rawAdd    = (origCost + extraCost) ÷ (1 − margin/100) − origPrice
 *   extraCost + margin-correct profit on that cost — priced the same way as the
 *   original quote so the job's overall margin is preserved.
 *   newPrice  = origPrice + rawAdd
 *   newCost   = origCost + extraCost
 *   newMargin = (newPrice − newCost) ÷ newPrice × 100   (= original margin)
 * The invoice-ready amount is rawAdd rounded up to whole dollars.
 */
export default function ChangeOrderCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [origPrice, setOrigPrice] = useState(prefill?.origPrice ?? DEFAULTS.origPrice);
  const [origCost, setOrigCost] = useState(prefill?.origCost ?? DEFAULTS.origCost);
  const [hoursExtra, setHoursExtra] = useState(prefill?.hoursExtra ?? DEFAULTS.hoursExtra);
  const [rateExtra, setRateExtra] = useState(prefill?.rateExtra ?? DEFAULTS.rateExtra);
  const [materialsExtra, setMaterialsExtra] = useState(prefill?.materialsExtra ?? DEFAULTS.materialsExtra);
  const [margin, setMargin] = useState(prefill?.margin ?? DEFAULTS.margin);

  const price = num(origPrice);
  const cost = num(origCost);
  const m = num(margin);
  const valid = m > 0 && m < 100;
  const extraCost = num(hoursExtra) * num(rateExtra) + num(materialsExtra);
  const origMargin = price > 0 ? ((price - cost) / price) * 100 : NaN;
  // Margin-correct add: total cost priced to the original margin, minus what's already quoted.
  const rawAdd = valid && price > 0 ? (cost + extraCost) / (1 - m / 100) - price : NaN;
  const invoiceAdd = Number.isFinite(rawAdd) ? Math.ceil(rawAdd) : NaN;
  const newPrice = Number.isFinite(invoiceAdd) ? price + invoiceAdd : NaN;
  const newCost = cost + extraCost;
  const newMargin = Number.isFinite(newPrice) && newPrice > 0 ? ((newPrice - newCost) / newPrice) * 100 : NaN;
  const profitAtOldPrice = extraCost > 0 ? extraCost / (1 - m / 100) - extraCost : NaN;
  const absorbed = extraCost > 0 && !Number.isFinite(invoiceAdd);
  const wasLosing = price > 0 && cost >= price;

  const reset = () => {
    setOrigPrice(DEFAULTS.origPrice); setOrigCost(DEFAULTS.origCost); setHoursExtra(DEFAULTS.hoursExtra);
    setRateExtra(DEFAULTS.rateExtra); setMaterialsExtra(DEFAULTS.materialsExtra); setMargin(DEFAULTS.margin);
  };

  const copyText = [
    "RateCraft — Change Order Pricing",
    `Original contract price: ${fmt.money(price)}`,
    `Original estimated cost: ${fmt.money(cost)}`,
    `Additional work cost: ${fmt.money(extraCost)} (${fmt.num(num(hoursExtra))} hrs × ${fmt.money(num(rateExtra))} + ${fmt.money(num(materialsExtra))} materials)`,
    `Change order amount to invoice: ${fmt.money(invoiceAdd)}`,
    `New contract price: ${fmt.money(newPrice)}`,
    `Margin preserved: ${fmt.pct(newMargin)}`,
  ].join("\n");

  return (
    <section aria-label="Change order calculator">
      <LiveRegion
        message={
          Number.isFinite(invoiceAdd) && extraCost > 0
            ? `Change order amount ${fmt.money(invoiceAdd)}. New contract price ${fmt.money(newPrice)} at ${fmt.pct(newMargin)} margin.`
            : "Enter the additional work's cost to price the change order."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The original contract</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="co-price" label="Original contract price" value={origPrice} onChange={setOrigPrice} unit="$" />
            <Field id="co-cost" label="Original estimated cost" value={origCost} onChange={setOrigCost} unit="$" hint="What the original scope was estimated to cost you" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The additional work</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="co-hours" label="Extra labor hours" value={hoursExtra} onChange={setHoursExtra} unit="hrs" />
            <Field id="co-rate" label="Burdened labor rate" value={rateExtra} onChange={setRateExtra} unit="$" hint="Per hour, fully burdened — not the bare wage" />
            <Field id="co-materials" label="Extra materials and other costs" value={materialsExtra} onChange={setMaterialsExtra} unit="$" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The margin to hold</h2>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <Field id="co-margin" label="Gross margin the job was priced at" value={margin} onChange={setMargin} unit="%" hint="Between 0 and 100 — use the Margin Calculator to check it" />
            {m >= 100 && (
              <span className="field-error" role="alert">
                A margin of 100% or more is impossible. Enter a value below 100.
              </span>
            )}
          </div>
          {wasLosing && (
            <p role="alert" className="callout callout-warning text-small" style={{ marginBottom: 0, marginTop: "var(--space-3)" }}>
              The original contract already makes no gross profit. Fix the base price before
              pricing the change order on top of it.
            </p>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Change order amount to invoice</div>
          <div
            className="result-primary"
            style={{ color: Number.isFinite(invoiceAdd) ? "var(--color-brand)" : "var(--color-danger)" }}
          >
            {Number.isFinite(invoiceAdd) && extraCost > 0 ? fmt.money(invoiceAdd) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Extra cost", value: fmt.money(extraCost) },
              { label: "New total cost", value: fmt.money(newCost) },
              { label: `÷ ${(1 - m / 100).toFixed(2)}`, value: fmt.money(Number.isFinite(rawAdd) ? (cost + extraCost) / (1 - m / 100) : NaN) },
              { label: "− Original price", value: `− ${fmt.money(price)}` },
              { label: "Change order", value: Number.isFinite(invoiceAdd) ? fmt.money(invoiceAdd) : "—", highlight: true },
            ]}
          />

          <YourCalculation
            formula="Change order = (Original cost + Extra cost) ÷ (1 − Margin) − Original price"
            substitution={
              Number.isFinite(rawAdd) && extraCost > 0
                ? `(${fmt.money(cost)} + ${fmt.money(extraCost)}) ÷ ${(1 - m / 100).toFixed(2)} − ${fmt.money(price)} = ${fmt.money(rawAdd)}`
                : "Enter the additional work's cost and a margin between 0 and 100"
            }
            note="Pricing the whole new cost base to the margin keeps the job's overall percentage intact — the change order isn't just cost plus a guess."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Cost of the additional work" value={fmt.money(extraCost)} hint={`${fmt.num(num(hoursExtra))} hrs × ${fmt.money(num(rateExtra))} + ${fmt.money(num(materialsExtra))} materials`} />
            <ResultRow label="Margin-correct amount" value={Number.isFinite(rawAdd) ? fmt.money(rawAdd) : "—"} hint="Before rounding to an invoiceable number" />
            <ResultRow label="Change order to invoice (rounded up)" value={Number.isFinite(invoiceAdd) ? fmt.money(invoiceAdd) : "—"} strong />
            <ResultRow label="New contract price" value={Number.isFinite(newPrice) ? fmt.money(newPrice) : "—"} />
            <ResultRow label="Margin after the change order" value={Number.isFinite(newMargin) ? fmt.pct(newMargin) : "—"} hint={`Was ${Number.isFinite(origMargin) ? fmt.pct(origMargin) : "—"} — it should match`} tone="success" strong />
            <ResultRow
              label="Profit inside the change order"
              value={Number.isFinite(profitAtOldPrice) ? fmt.money(profitAtOldPrice) : "—"}
              hint="What you'd give away by billing the extra cost alone"
            />
          </div>

          {absorbed && (
            <p role="alert" className="callout callout-warning text-small" style={{ marginBottom: 0 }}>
              Enter the extra work&apos;s cost to price it. Doing the work without a change order
              donates {fmt.money(extraCost)} of cost — and {Number.isFinite(profitAtOldPrice) ? fmt.money(profitAtOldPrice) : "the margin on it"} of
              profit — to the project.
            </p>
          )}

          <ResultActions text={copyText} label="Change order calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            The amount shown preserves the margin the job was priced at — it is not just the cost
            of the extra work. Get the scope in writing and the price signed before the work
            starts; a change order agreed after the fact is a negotiation, not a document.
          </p>
        </div>
      </div>
    </section>
  );
}
