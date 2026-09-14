"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import ResultRow from "@/components/calculator/ResultRow";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULT_ROWS = [
  { key: "insurance", label: "Insurance (liability, vehicle, comp)", value: "450" },
  { key: "vehicle", label: "Vehicles & fuel", value: "600" },
  { key: "tools", label: "Tools & equipment", value: "250" },
  { key: "office", label: "Office / shop / storage", value: "0" },
  { key: "software", label: "Software & subscriptions", value: "120" },
  { key: "phone", label: "Phone & internet", value: "100" },
  { key: "accounting", label: "Accounting / legal / licenses", value: "150" },
];

type Row = { key: string; label: string; value: string };

/**
 * Overhead calculator. Math (Phase 0-verified, unchanged):
 *   total = Σ row values
 *   pctRevenue = total ÷ revenue × 100 (revenue > 0)
 *   perHour = total ÷ billable hours (billable > 0)
 */
export default function OverheadCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS.map((r) => ({ ...r })));
  const [revenue, setRevenue] = useState(prefill?.revenue ?? "30000");
  const [billable, setBillable] = useState(prefill?.billable ?? "500");

  const total = rows.reduce((s, r) => s + num(r.value), 0);
  const rev = num(revenue);
  const pctRevenue = rev > 0 ? (total / rev) * 100 : NaN;
  const perHour = num(billable) > 0 ? total / num(billable) : NaN;

  const update = (key: string, value: string) => {
    // Same guard as Field: fixed costs have no legitimate negative value.
    const clean = value.trim().startsWith("-") ? value.replace(/-/g, "") : value;
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, value: clean } : r)));
  };

  const addRow = () =>
    setRows((rs) => [...rs, { key: `custom-${Date.now()}`, label: "Other overhead", value: "0" }]);

  const removeRow = (key: string) => setRows((rs) => rs.filter((r) => r.key !== key));

  const reset = () => {
    setRows(DEFAULT_ROWS.map((r) => ({ ...r })));
    setRevenue("30000");
    setBillable("500");
  };

  const copyText = [
    "RateCraft — Overhead Calculation",
    `Total monthly overhead: ${fmt.money(total)}`,
    `Average monthly revenue: ${fmt.money(rev)}`,
    `Overhead as % of revenue: ${fmt.pct(pctRevenue)}`,
    `Billable hours / month: ${fmt.num(num(billable))}`,
    `Overhead per billable hour: ${fmt.money(perHour)}`,
  ].join("\n");

  return (
    <section aria-label="Overhead calculator">
      <LiveRegion
        message={`Total monthly overhead ${fmt.money(total)}. That is ${fmt.money(perHour)} per billable hour.`}
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Monthly fixed costs</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Cost line</th>
                  <th scope="col" className="num" style={{ width: 120 }}>Monthly</th>
                  <th scope="col" style={{ width: 44 }}><span className="visually-hidden">Remove</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key}>
                    <td>
                      <label htmlFor={`oh-${r.key}`} className="visually-hidden">{r.label}</label>
                      <input
                        id={`oh-${r.key}`}
                        type="text"
                        value={r.label}
                        onChange={(e) =>
                          setRows((rs) => rs.map((x) => (x.key === r.key ? { ...x, label: e.target.value } : x)))
                        }
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td className="num">
                      <div className="input-affix">
                        <span className="prefix" aria-hidden="true">$</span>
                        <input
                          type="number"
                          min={0}
                          step="any"
                          className="has-prefix"
                          style={{ textAlign: "right" }}
                          aria-label={`${r.label} monthly cost`}
                          value={r.value}
                          onChange={(e) => update(r.key, e.target.value)}
                        />
                      </div>
                    </td>
                    <td>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(r.key)}
                          aria-label={`Remove ${r.label}`}
                          className="btn btn-secondary"
                          style={{ padding: "4px 9px", fontSize: "0.8rem" }}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td>Total</td>
                  <td className="num">{fmt.money(total)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
            <button type="button" onClick={addRow} className="btn btn-secondary">+ Add cost line</button>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset</button>
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Your business volume</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <Field id="oh-revenue" label="Average monthly revenue" value={revenue} onChange={setRevenue} unit="$" />
            <Field id="oh-billable" label="Billable hours / month" value={billable} onChange={setBillable} unit="hrs" />
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Overhead per billable hour</div>
          <div className="result-primary">
            {Number.isFinite(perHour) ? fmt.money(perHour) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Monthly overhead", value: fmt.money(total) },
              { label: "Billable hrs", value: fmt.num(num(billable)) },
              { label: "Per hour", value: Number.isFinite(perHour) ? fmt.money(perHour) : "—", highlight: true },
              { label: "% of revenue", value: Number.isFinite(pctRevenue) ? fmt.pct(pctRevenue) : "—" },
            ]}
          />

          <YourCalculation
            formula="Overhead rate = Monthly overhead ÷ Billable hours"
            substitution={
              num(billable) > 0
                ? `${fmt.money(total)} ÷ ${fmt.num(num(billable))} = ${fmt.money(perHour)}`
                : "Enter billable hours above 0"
            }
            note="Add this to your labor rate — or recover it in markup, but deliberately."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Total monthly overhead" value={fmt.money(total)} strong />
            <ResultRow
              label="Overhead as % of revenue"
              value={Number.isFinite(pctRevenue) ? fmt.pct(pctRevenue) : "—"}
              hint="Monthly overhead ÷ monthly revenue"
            />
            <ResultRow
              label="Overhead per billable hour"
              value={Number.isFinite(perHour) ? fmt.money(perHour) : "—"}
              strong
              tone="success"
            />
          </div>

          <ResultActions text={copyText} label="Overhead calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            Rule of thumb: if overhead eats more than ~25% of revenue in a small trade business,
            either fixed costs or utilization deserve a hard look. Whatever the number, every
            job price must include a slice of it.
          </p>
        </div>
      </div>
    </section>
  );
}
