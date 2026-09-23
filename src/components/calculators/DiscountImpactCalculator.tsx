"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import ResultRow from "@/components/calculator/ResultRow";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULTS = { price: "1200", cost: "750", discount: "10" };

/** Discount percentages shown in the live reference table. */
const TABLE_DISCOUNTS = [5, 10, 15, 20, 25, 30];

/**
 * Discount impact calculator. Math (verified in tests/math-verification.mjs, section 11):
 *   normalProfit = price − cost
 *   discPrice    = price × (1 − d/100)                 [requires 0 ≤ d < 100]
 *   discProfit   = discPrice − cost
 *   wipedout %   = (normalProfit − discProfit) / normalProfit × 100
 *   multiplier   = normalProfit ÷ discProfit           (jobs needed to earn what one used to)
 *   margin       = profit ÷ price × 100 (before and after)
 * Cost does not change with the price — that is why a discount costs more
 * profit percentage than it does price percentage.
 */
export default function DiscountImpactCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [price, setPrice] = useState(prefill?.price ?? DEFAULTS.price);
  const [cost, setCost] = useState(prefill?.cost ?? DEFAULTS.cost);
  const [discount, setDiscount] = useState(prefill?.discount ?? DEFAULTS.discount);

  const p = num(price);
  const c = num(cost);
  const d = num(discount);

  const valid = d >= 0 && d < 100;
  const normalProfit = p - c;
  const discPrice = valid ? p * (1 - d / 100) : NaN;
  const discProfit = valid ? discPrice - c : NaN;
  const normalMargin = p > 0 ? (normalProfit / p) * 100 : NaN;
  const discMargin = valid && discPrice > 0 ? (discProfit / discPrice) * 100 : NaN;
  const erasedPct =
    Number.isFinite(normalProfit) && normalProfit > 0 && Number.isFinite(discProfit)
      ? ((normalProfit - discProfit) / normalProfit) * 100
      : NaN;
  const multiplier = Number.isFinite(discProfit) && discProfit > 0 ? normalProfit / discProfit : NaN;
  const extraJobsPct = Number.isFinite(multiplier) ? (multiplier - 1) * 100 : NaN;
  const erasedAll = valid && p > 0 && discProfit <= 0;

  const reset = () => {
    setPrice(DEFAULTS.price); setCost(DEFAULTS.cost); setDiscount(DEFAULTS.discount);
  };

  const copyText = [
    "RateCraft — Discount Impact",
    `Normal price: ${fmt.money(p)}`,
    `Job cost: ${fmt.money(c)}`,
    `Profit before discount: ${fmt.money(normalProfit)} (${fmt.pct(normalMargin)} margin)`,
    `Discount: ${fmt.num(d)}%`,
    `Discounted price: ${fmt.money(discPrice)}`,
    `Profit after discount: ${fmt.money(discProfit)} (${fmt.pct(discMargin)} margin)`,
    `Share of profit erased: ${fmt.pct(erasedPct)}`,
    Number.isFinite(multiplier)
      ? `Extra jobs needed to earn the same: ${fmt.num(multiplier)}× (${fmt.pct(extraJobsPct)} more volume)`
      : "This discount erases the job's entire profit.",
  ].join("\n");

  return (
    <section aria-label="Discount impact calculator">
      <LiveRegion
        message={
          valid
            ? `Profit after discount ${fmt.money(discProfit)}. That erases ${fmt.pct(erasedPct)} of the profit.`
            : "Enter a discount between 0 and 100."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The job</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="di-price" label="Normal price" value={price} onChange={setPrice} unit="$" hint="What you'd quote without a discount" />
            <Field
              id="di-cost"
              label="Job cost"
              value={cost}
              onChange={setCost}
              unit="$"
              hint="Variable cost of doing this job — burdened labor, materials, subs, trips"
            />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The discount</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="di-disc" label="Discount requested" value={discount} onChange={setDiscount} unit="%" hint="Between 0 and 100" />
          </div>
          {d >= 100 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              A discount of 100% means you work for free. Enter a value below 100.
            </span>
          )}
          {erasedAll && (
            <p role="alert" className="callout callout-warning text-small" style={{ marginBottom: 0 }}>
              This discount erases the job&apos;s entire profit — the discounted price no longer covers
              the cost of doing the work, let alone overhead. There is no volume of this job that
              makes that profitable.
            </p>
          )}
          {valid && Number.isFinite(discMargin) && discMargin > 0 && Number.isFinite(erasedPct) && erasedPct > 0 && (
            <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
              Each 1% off this job costs {fmt.pct(erasedPct / Math.max(d, 1))} of its profit. The
              same discount hurts a thin-margin job far more than a fat one.
            </p>
          )}

          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Profit after the discount</div>
          <div
            className="result-primary"
            style={{ color: discProfit > 0 ? "var(--color-brand)" : "var(--color-danger)" }}
          >
            {valid && Number.isFinite(discProfit) ? fmt.money(discProfit) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Price", value: fmt.money(p) },
              { label: `− ${fmt.num(d)}%`, value: `− ${fmt.money(p - discPrice)}` },
              { label: "New price", value: valid ? fmt.money(discPrice) : "—" },
              { label: "Profit", value: valid ? fmt.money(discProfit) : "—", highlight: true },
              { label: "Margin", value: valid ? fmt.pct(discMargin) : "—" },
            ]}
          />

          <YourCalculation
            formula="Profit before ÷ Profit after = jobs needed to stand still"
            substitution={
              Number.isFinite(multiplier)
                ? `${fmt.money(normalProfit)} ÷ ${fmt.money(discProfit)} = ${fmt.num(multiplier)} jobs`
                : "This discount leaves no profit to replace"
            }
            note="Costs don't discount themselves, so the volume you need grows faster than the discount does."
          />

          {Number.isFinite(multiplier) && multiplier > 1 && (
            <p role="status" className="text-small" style={{ margin: "var(--space-3) 0 0", color: "var(--color-warning)", fontWeight: 600 }}>
              To earn what one full-price job earned, you&apos;d need {fmt.num(multiplier)} jobs at the
              discounted price — {fmt.pct(extraJobsPct)} more work, more trips and more risk for the
              same money.
            </p>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Profit before discount" value={fmt.money(normalProfit)} hint={`${fmt.pct(normalMargin)} margin on ${fmt.money(p)}`} />
            <ResultRow label="Discounted price" value={valid ? fmt.money(discPrice) : "—"} hint={`${fmt.money(p)} − ${fmt.money(p - discPrice)}`} />
            <ResultRow label="Profit after discount" value={valid ? fmt.money(discProfit) : "—"} strong tone={discProfit > 0 ? "success" : "warning"} />
            <ResultRow label="Margin after discount" value={valid ? fmt.pct(discMargin) : "—"} hint="Was priced to carry more than this" />
            <ResultRow label="Profit erased" value={Number.isFinite(erasedPct) ? fmt.pct(erasedPct) : "—"} strong />
            <ResultRow
              label="Jobs needed to earn the same"
              value={Number.isFinite(multiplier) ? `${fmt.num(multiplier)}×` : "—"}
              hint={Number.isFinite(extraJobsPct) ? `${fmt.pct(extraJobsPct)} more volume for identical profit` : undefined}
              strong
            />
          </div>

          <ResultActions text={copyText} label="Discount impact calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            This is the arithmetic that makes &quot;give them 10% and make it up on volume&quot; so
            expensive: the discount comes out of the smallest number on the job.
          </p>
        </div>
      </div>

      <div className="card card-pad mt-4">
        <h2 style={{ fontSize: "var(--text-h3)" }}>What each discount does to this job</h2>
        <p className="text-small text-muted">
          The same job at your price and cost, discounted by common amounts. Volume needed is how
          many discounted jobs it takes to replace the profit of one job at full price.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Discount</th>
                <th scope="col" className="num">Price</th>
                <th scope="col" className="num">Profit</th>
                <th scope="col" className="num">Margin</th>
                <th scope="col" className="num">Profit erased</th>
                <th scope="col" className="num">Volume needed</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_DISCOUNTS.map((row) => {
                const rowPrice = p * (1 - row / 100);
                const rowProfit = rowPrice - c;
                const rowMargin = rowPrice > 0 ? (rowProfit / rowPrice) * 100 : NaN;
                const rowErased =
                  normalProfit > 0 ? ((normalProfit - rowProfit) / normalProfit) * 100 : NaN;
                const rowMult = rowProfit > 0 ? normalProfit / rowProfit : NaN;
                return (
                  <tr key={row}>
                    <td>{row}%</td>
                    <td className="num">{fmt.money(rowPrice)}</td>
                    <td className="num">{fmt.money(rowProfit)}</td>
                    <td className="num">{fmt.pct(rowMargin)}</td>
                    <td className="num">{fmt.pct(rowErased)}</td>
                    <td className="num">{Number.isFinite(rowMult) ? `${fmt.num(rowMult)}×` : "never"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
          &quot;Never&quot; means the discounted price no longer covers the job&apos;s cost — no amount of
          volume recovers it.
        </p>
      </div>
    </section>
  );
}
