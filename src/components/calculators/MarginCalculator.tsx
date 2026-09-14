"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import ResultRow from "@/components/calculator/ResultRow";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULTS = { price: "2600", cost: "1950", target: "30" };

/**
 * Margin calculator. Math (Phase 0-verified, unchanged):
 *   profit = price − cost ; margin = profit/price ; markup = profit/cost
 *   priceForMargin = cost / (1 − margin/100), valid for 0 < margin < 100
 */
export default function MarginCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [price, setPrice] = useState(prefill?.price ?? DEFAULTS.price);
  const [cost, setCost] = useState(prefill?.cost ?? DEFAULTS.cost);
  const [target, setTarget] = useState(prefill?.target ?? DEFAULTS.target);

  const p = num(price);
  const c = num(cost);
  const profit = p - c;
  const margin = p > 0 ? (profit / p) * 100 : 0;
  const markup = c > 0 ? (profit / c) * 100 : 0;
  const losing = c >= p && c > 0;

  const t = num(target);
  const valid = t > 0 && t < 100;
  const needed = valid ? c / (1 - t / 100) : NaN;

  const reset = () => {
    setPrice(DEFAULTS.price); setCost(DEFAULTS.cost); setTarget(DEFAULTS.target);
  };

  const copyText = [
    "RateCraft — Margin Calculation",
    `Job price: ${fmt.money(p)}`,
    `Total cost: ${fmt.money(c)}`,
    `Gross profit: ${fmt.money(profit)}`,
    `Gross margin: ${fmt.pct(margin)}`,
    `Equivalent markup: ${fmt.pct(markup)}`,
  ].join("\n");

  return (
    <section aria-label="Margin calculator">
      <LiveRegion message={`Gross margin ${fmt.pct(margin)}. Gross profit ${fmt.money(profit)}.`} />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The quote you&apos;re about to send</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="mc2-price" label="Job price" value={price} onChange={setPrice} unit="$" />
            <Field
              id="mc2-cost"
              label="Total job cost"
              value={cost}
              onChange={setCost}
              unit="$"
              hint="Labor + materials + subs + other direct costs"
            />
          </div>
          {losing && (
            <p role="alert" className="callout callout-warning text-small" style={{ marginBottom: 0 }}>
              At this price the job makes no gross profit — every dollar goes to costs, leaving
              nothing for overhead. Raise the price or cut costs.
            </p>
          )}

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Price needed for a target margin</h2>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <Field id="mc2-target" label="Target gross margin" value={target} onChange={setTarget} unit="%" hint="Between 0 and 100" />
            {t >= 100 && (
              <span className="field-error" role="alert">
                A margin of 100% or more is impossible — no job sells for pure profit. Enter a
                value below 100.
              </span>
            )}
            <ResultRow
              label="Price required"
              value={valid ? fmt.money(needed) : "—"}
              tone="success"
              strong
            />
            <YourCalculation
              formula="Price = Cost ÷ (1 − Margin)"
              substitution={
                valid
                  ? `${fmt.money(c)} ÷ ${(1 - t / 100).toFixed(2)} = ${fmt.money(needed)}`
                  : "Enter a margin between 0 and 100"
              }
              note="Dividing — not multiplying — is what prices to a margin."
            />
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">What you&apos;d actually be earning</div>
          <div className="result-primary" style={{ color: profit > 0 ? "var(--color-success)" : "var(--color-danger)" }}>
            {fmt.pct(margin)}
          </div>

          <MathFlow
            steps={[
              { label: "Price", value: fmt.money(p) },
              { label: "Cost", value: `− ${fmt.money(c)}` },
              { label: "Profit", value: fmt.money(profit), highlight: profit > 0 },
              { label: "Margin", value: fmt.pct(margin) },
              { label: "Markup", value: fmt.pct(markup) },
            ]}
          />

          <YourCalculation
            formula="Margin = (Price − Cost) ÷ Price"
            substitution={p > 0 ? `(${fmt.money(p)} − ${fmt.money(c)}) ÷ ${fmt.money(p)} = ${fmt.pct(margin)}` : "Enter a job price above 0"}
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Gross profit" value={fmt.money(profit)} tone={profit > 0 ? "success" : "warning"} strong />
            <ResultRow label="Gross margin" value={fmt.pct(margin)} hint="Profit ÷ selling price" />
            <ResultRow label="Equivalent markup" value={fmt.pct(markup)} hint="Profit ÷ cost — always bigger than margin" strong />
          </div>

          <ResultActions text={copyText} label="Margin calculation" />
        </div>
      </div>
    </section>
  );
}
