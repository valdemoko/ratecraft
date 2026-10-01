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
  cost: "1100", supplierDiscount: "10", freight: "45", markup: "35",
};

/**
 * Materials markup calculator. Math (verified in tests/math-verification.mjs, section 17):
 *   netCost  = listCost × (1 − supplierDiscount/100) + freight
 *   price    = netCost × (1 + markup/100)
 *   profit   = price − netCost ; margin = profit ÷ price
 *   effMult  = price ÷ listCost   (what the customer's number implies vs. list)
 * Freight and delivery are costs of having the material on site, so they belong
 * inside the marked-up base like every other part of net cost.
 */
export default function MaterialsMarkupCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [cost, setCost] = useState(prefill?.cost ?? DEFAULTS.cost);
  const [supplierDiscount, setSupplierDiscount] = useState(prefill?.supplierDiscount ?? DEFAULTS.supplierDiscount);
  const [freight, setFreight] = useState(prefill?.freight ?? DEFAULTS.freight);
  const [markup, setMarkup] = useState(prefill?.markup ?? DEFAULTS.markup);

  const list = num(cost);
  const disc = num(supplierDiscount);
  const frt = num(freight);
  const mk = num(markup);

  const valid = disc >= 0 && disc < 100 && mk >= 0;
  const netCost = valid ? list * (1 - disc / 100) + frt : NaN;
  const price = valid ? netCost * (1 + mk / 100) : NaN;
  const profit = valid ? price - netCost : NaN;
  const margin = price > 0 ? (profit / price) * 100 : NaN;
  const effMult = list > 0 ? price / list : NaN;
  const savedByDiscount = list * (disc / 100);
  const discountWorth = profit - savedByDiscount > 0 && profit > 0 ? (profit - savedByDiscount) : NaN;

  const reset = () => {
    setCost(DEFAULTS.cost); setSupplierDiscount(DEFAULTS.supplierDiscount);
    setFreight(DEFAULTS.freight); setMarkup(DEFAULTS.markup);
  };

  const copyText = [
    "RateCraft — Materials Markup",
    `List cost: ${fmt.money(list)}`,
    `Supplier discount: ${fmt.pct(disc)} (− ${fmt.money(savedByDiscount)})`,
    `Freight / delivery: ${fmt.money(frt)}`,
    `Net cost to you: ${fmt.money(netCost)}`,
    `Markup applied: ${fmt.pct(mk)}`,
    `Price to customer: ${fmt.money(price)}`,
    `Gross profit: ${fmt.money(profit)} (${fmt.pct(margin)} margin)`,
    `Effective multiplier on list: ${fmt.num(effMult)}×`,
  ].join("\n");

  return (
    <section aria-label="Materials markup calculator">
      <LiveRegion
        message={
          valid && Number.isFinite(price)
            ? `Price the material at ${fmt.money(price)} — ${fmt.money(profit)} of gross profit, a ${fmt.pct(margin)} margin, an effective ${fmt.num(effMult)}× on list.`
            : "Enter the material's cost and a markup to see the price."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>What the material costs you</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="mm-cost" label="List / quoted cost" value={cost} onChange={setCost} unit="$" hint="Supplier's price before discount" />
            <Field id="mm-disc" label="Supplier discount" value={supplierDiscount} onChange={setSupplierDiscount} unit="%" hint="Trade or account discount, 0–99" />
            <Field id="mm-freight" label="Freight / delivery to site" value={freight} onChange={setFreight} unit="$" />
          </div>
          {disc >= 100 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              A 100% supplier discount means free material — enter a value below 100.
            </span>
          )}

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>How you sell it</h2>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <Field id="mm-markup" label="Markup on your net cost" value={markup} onChange={setMarkup} unit="%" hint="Commonly 20–50% on materials — your call, on purpose" />
            {mk < 0 && (
              <span className="field-error" role="alert">
                A negative markup sells below cost. Enter 0 or more.
              </span>
            )}
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Price to the customer</div>
          <div
            className="result-primary"
            style={{ color: valid && Number.isFinite(price) ? "var(--color-brand)" : "var(--color-danger)" }}
          >
            {valid && Number.isFinite(price) ? fmt.money(price) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "List", value: fmt.money(list) },
              { label: `− ${fmt.pct(disc)}`, value: `− ${fmt.money(savedByDiscount)}` },
              { label: "+ Freight", value: `+ ${fmt.money(frt)}` },
              { label: "Net cost", value: fmt.money(netCost) },
              { label: `× ${(1 + mk / 100).toFixed(2)}`, value: fmt.money(price), highlight: true },
            ]}
          />

          <YourCalculation
            formula="Price = (List × (1 − Discount) + Freight) × (1 + Markup)"
            substitution={
              valid && Number.isFinite(price)
                ? `(${fmt.money(list)} − ${fmt.money(savedByDiscount)} + ${fmt.money(frt)}) × ${(1 + mk / 100).toFixed(2)} = ${fmt.money(price)}`
                : "Enter the cost and a markup of 0 or more"
            }
            note="Freight is part of having the material on site, so it rides inside the marked-up base — recovering it separately on every line gets fiddly fast."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Net cost after discount and freight" value={valid ? fmt.money(netCost) : "—"} hint={`${fmt.money(list)} list, ${fmt.money(savedByDiscount)} saved, ${fmt.money(frt)} freight`} />
            <ResultRow label="Price to customer" value={valid ? fmt.money(price) : "—"} strong />
            <ResultRow label="Gross profit on the material" value={valid ? fmt.money(profit) : "—"} hint={`${fmt.pct(margin)} margin`} tone="success" />
            <ResultRow label="Effective multiplier on list price" value={Number.isFinite(effMult) ? `${fmt.num(effMult)}×` : "—"} hint="What a '2× parts' price book would call this" strong />
            <ResultRow
              label="What the discount is worth to you"
              value={Number.isFinite(discountWorth) ? fmt.money(discountWorth) : "—"}
              hint="Profit left after the discount pays for itself — the rest of the markup is yours either way"
            />
          </div>

          <ResultActions text={copyText} label="Materials markup calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            A materials markup covers handling, storage, returns, warranty risk and the float
            while the customer pays — it is not free money, and it is not the same as your labor
            margin. Price both on purpose: materials here, the whole job in the{" "}
            <strong>Job Pricing Calculator</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
