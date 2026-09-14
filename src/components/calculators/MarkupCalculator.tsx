"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import ResultRow from "@/components/calculator/ResultRow";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULTS = { labor: "800", materials: "600", other: "100", overhead: "10", markup: "25" };

/**
 * Markup calculator. Math (Phase 0-verified, unchanged):
 *   direct = labor + materials + other
 *   overheadAmt = direct × overhead%
 *   totalCost = direct + overheadAmt
 *   price = totalCost × (1 + markup/100)
 *   profit = price − totalCost ; margin = profit / price
 */
export default function MarkupCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [labor, setLabor] = useState(prefill?.labor ?? DEFAULTS.labor);
  const [materials, setMaterials] = useState(prefill?.materials ?? DEFAULTS.materials);
  const [other, setOther] = useState(prefill?.other ?? DEFAULTS.other);
  const [overhead, setOverhead] = useState(prefill?.overhead ?? DEFAULTS.overhead);
  const [markup, setMarkup] = useState(prefill?.markup ?? DEFAULTS.markup);

  const cost = num(labor) + num(materials) + num(other);
  const overheadAmt = cost * (num(overhead) / 100);
  const totalCost = cost + overheadAmt;
  const price = totalCost * (1 + num(markup) / 100);
  const profit = price - totalCost;
  const margin = price > 0 ? (profit / price) * 100 : 0;

  const reset = () => {
    setLabor(DEFAULTS.labor); setMaterials(DEFAULTS.materials); setOther(DEFAULTS.other);
    setOverhead(DEFAULTS.overhead); setMarkup(DEFAULTS.markup);
  };

  const copyText = [
    "RateCraft — Markup Calculation",
    `Direct cost: ${fmt.money(cost)}`,
    `Overhead (${fmt.num(num(overhead))}%): ${fmt.money(overheadAmt)}`,
    `Total cost: ${fmt.money(totalCost)}`,
    `Markup: ${fmt.num(num(markup))}%`,
    `Price: ${fmt.money(price)}`,
    `Profit: ${fmt.money(profit)}`,
    `Margin: ${fmt.pct(margin)}`,
  ].join("\n");

  return (
    <section aria-label="Markup calculator">
      <LiveRegion message={`Recommended selling price ${fmt.price(price)}. Gross margin ${fmt.pct(margin)}.`} />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Job costs</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="mc-labor" label="Labor cost" value={labor} onChange={setLabor} unit="$" hint="Crew wages or your own time at your burdened rate" />
            <Field id="mc-materials" label="Materials cost" value={materials} onChange={setMaterials} unit="$" />
            <Field id="mc-other" label="Other direct costs" value={other} onChange={setOther} unit="$" hint="Subs, permits, dump fees, equipment rental…" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Your business costs</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="mc-overhead" label="Overhead allowance" value={overhead} onChange={setOverhead} unit="%" hint="Optional: adds a % of direct cost for business overhead" />
            <Field id="mc-markup" label="Markup" value={markup} onChange={setMarkup} unit="%" hint="Added on top of total cost" />
          </div>

          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Recommended selling price</div>
          <div className="result-primary">{fmt.price(price)}</div>

          <MathFlow
            steps={[
              { label: "Cost", value: fmt.money(totalCost) },
              { label: "Markup", value: `+${fmt.num(num(markup))}%` },
              { label: "Price", value: fmt.price(price), highlight: true },
              { label: "Profit", value: fmt.money(profit) },
              { label: "Margin", value: fmt.pct(margin) },
            ]}
          />

          <YourCalculation
            formula="Price = Cost × (1 + Markup)"
            substitution={`${fmt.money(totalCost)} × ${(1 + num(markup) / 100).toFixed(2)} = ${fmt.money(price)}`}
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Direct cost" value={fmt.money(cost)} hint="Labor + materials + other" />
            <ResultRow label="Overhead allowance" value={fmt.money(overheadAmt)} hint={`${fmt.num(num(overhead))}% of direct cost`} />
            <ResultRow label="Total cost" value={fmt.money(totalCost)} strong />
            <ResultRow label={`Profit (at ${fmt.num(num(markup))}% markup)`} value={fmt.money(profit)} tone="success" />
            <ResultRow label="Gross margin" value={fmt.pct(margin)} hint="Profit as a share of the selling price" strong tone="success" />
          </div>

          <ResultActions text={copyText} label="Markup calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            A {fmt.num(num(markup))}% markup equals a {fmt.pct(margin)} margin — they are not
            the same number. The table below shows why.
          </p>
        </div>
      </div>

      <div className="card card-pad mt-4">
        <h2 style={{ fontSize: "var(--text-h3)" }}>Markup → margin conversion</h2>
        <p className="text-small text-muted">
          The most expensive mistake in contractor pricing: assuming a 20% markup produces a 20%
          margin. It produces 16.7%. Price to a target margin with{" "}
          <code>Price = Cost ÷ (1 − Margin)</code>, not <code>Cost × (1 + Markup)</code>.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Markup on cost</th>
                <th scope="col" className="num">Equivalent margin on price</th>
              </tr>
            </thead>
            <tbody>
              {[10, 15, 20, 25, 30, 40, 50, 75, 100].map((m) => (
                <tr key={m}>
                  <td>{m}%</td>
                  <td className="num">{fmt.pct((m / (100 + m)) * 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
