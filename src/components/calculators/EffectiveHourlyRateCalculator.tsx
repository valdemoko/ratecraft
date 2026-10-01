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
  revenue: "3200", hours: "24", hourlyCost: "38", materials: "900",
  subs: "0", unpaidHours: "6", vehicleCost: "40", targetRate: "60",
};

/**
 * Effective hourly rate calculator. Math (verified in tests/math-verification.mjs, section 14):
 *   laborCost   = hours × hourlyCost
 *   totalCost   = laborCost + materials + subs + vehicleCost
 *   profit      = revenue − totalCost
 *   rateAtWork  = profit ÷ hours                        (on-site hours only)
 *   effective   = profit ÷ (hours + unpaidHours)        (all hours the job takes from you)
 *   margin      = profit ÷ revenue × 100
 * The gap between rateAtWork and effective is the price of unpaid time — quoting,
 * pickups, travel and cleanup produce no revenue but consume your hours.
 */
export default function EffectiveHourlyRateCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [revenue, setRevenue] = useState(prefill?.revenue ?? DEFAULTS.revenue);
  const [hours, setHours] = useState(prefill?.hours ?? DEFAULTS.hours);
  const [hourlyCost, setHourlyCost] = useState(prefill?.hourlyCost ?? DEFAULTS.hourlyCost);
  const [materials, setMaterials] = useState(prefill?.materials ?? DEFAULTS.materials);
  const [subs, setSubs] = useState(prefill?.subs ?? DEFAULTS.subs);
  const [unpaidHours, setUnpaidHours] = useState(prefill?.unpaidHours ?? DEFAULTS.unpaidHours);
  const [vehicleCost, setVehicleCost] = useState(prefill?.vehicleCost ?? DEFAULTS.vehicleCost);
  const [targetRate, setTargetRate] = useState(prefill?.targetRate ?? DEFAULTS.targetRate);

  const rev = num(revenue);
  const h = num(hours);
  const unpaid = num(unpaidHours);
  const laborCost = h * num(hourlyCost);
  const totalCost = laborCost + num(materials) + num(subs) + num(vehicleCost);
  const profit = rev - totalCost;
  const totalHours = h + unpaid;
  const rateAtWork = h > 0 ? profit / h : NaN;
  const effective = totalHours > 0 ? profit / totalHours : NaN;
  const margin = rev > 0 ? (profit / rev) * 100 : NaN;
  const unpaidCostPerHour = Number.isFinite(rateAtWork) && Number.isFinite(effective) ? rateAtWork - effective : NaN;
  const target = num(targetRate);
  const meetsTarget = Number.isFinite(effective) && effective >= target && profit > 0;
  const losing = profit <= 0 && rev > 0;

  const reset = () => {
    setRevenue(DEFAULTS.revenue); setHours(DEFAULTS.hours); setHourlyCost(DEFAULTS.hourlyCost);
    setMaterials(DEFAULTS.materials); setSubs(DEFAULTS.subs); setUnpaidHours(DEFAULTS.unpaidHours);
    setVehicleCost(DEFAULTS.vehicleCost); setTargetRate(DEFAULTS.targetRate);
  };

  const copyText = [
    "RateCraft — Effective Hourly Rate",
    `Job revenue: ${fmt.money(rev)}`,
    `On-site hours: ${fmt.num(h)} · Unpaid time: ${fmt.num(unpaid)} hrs`,
    `Total cost: ${fmt.money(totalCost)} (labor ${fmt.money(laborCost)}, materials ${fmt.money(num(materials))}, subs ${fmt.money(num(subs))}, vehicle ${fmt.money(num(vehicleCost))})`,
    `Gross profit: ${fmt.money(profit)} (${fmt.pct(margin)} margin)`,
    `Rate per on-site hour: ${fmt.money(rateAtWork)}/hr`,
    `Effective rate per total hour: ${fmt.money(effective)}/hr`,
    `Unpaid time costs: ${fmt.money(unpaidCostPerHour)}/hr of difference`,
    `Target rate: ${fmt.money(target)}/hr — ${meetsTarget ? "met" : "not met"}`,
  ].join("\n");

  return (
    <section aria-label="Effective hourly rate calculator">
      <LiveRegion
        message={
          Number.isFinite(effective) && profit > 0
            ? `Effective rate ${fmt.money(effective)} per hour across ${fmt.num(totalHours)} total hours. ${meetsTarget ? "Meets" : "Below"} your ${fmt.money(target)} target.`
            : losing
              ? "This job makes no gross profit, so the effective rate is zero or negative."
              : "Enter your job revenue and hours to see the effective hourly rate."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The job</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="eh-revenue" label="Job revenue (price)" value={revenue} onChange={setRevenue} unit="$" />
            <Field id="eh-hours" label="Your hours on the job" value={hours} onChange={setHours} unit="hrs" hint="On-site work hours, honestly scoped" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The costs</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="eh-hourlycost" label="Your hourly cost" value={hourlyCost} onChange={setHourlyCost} unit="$" hint="Burdened cost of an hour of your labor — see the Labor Burden Calculator" />
            <Field id="eh-materials" label="Materials and other costs" value={materials} onChange={setMaterials} unit="$" />
            <Field id="eh-subs" label="Subcontractor cost" value={subs} onChange={setSubs} unit="$" />
            <Field id="eh-vehicle" label="Vehicle / fuel for this job" value={vehicleCost} onChange={setVehicleCost} unit="$" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The unpaid time</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="eh-unpaid" label="Unbillable hours this job causes" value={unpaidHours} onChange={setUnpaidHours} unit="hrs" hint="Quoting, pickup runs, travel, cleanup, invoicing" />
            <Field id="eh-target" label="Rate you want to earn" value={targetRate} onChange={setTargetRate} unit="$" hint="Your goal per total hour worked — the benchmark the result is judged against" />
          </div>
          {losing && (
            <p role="alert" className="callout callout-warning text-small" style={{ marginBottom: 0 }}>
              At this revenue the job doesn&apos;t cover its own costs, so there is no hourly rate
              to report — the work loses money before your time is even counted.
            </p>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Effective hourly rate — profit per total hour</div>
          <div
            className="result-primary"
            style={{ color: meetsTarget ? "var(--color-success)" : losing ? "var(--color-danger)" : "var(--color-warning)" }}
          >
            {Number.isFinite(effective) && profit > 0 ? `${fmt.money(effective)}/hr` : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Revenue", value: fmt.money(rev) },
              { label: "Cost", value: `− ${fmt.money(totalCost)}` },
              { label: "Profit", value: fmt.money(profit), highlight: profit > 0 },
              { label: `÷ ${fmt.num(totalHours)} hrs`, value: `${fmt.money(effective)}/hr` },
            ]}
          />

          <YourCalculation
            formula="Effective rate = (Revenue − Total cost) ÷ (On-site hours + Unbillable hours)"
            substitution={
              Number.isFinite(effective) && profit > 0
                ? `(${fmt.money(rev)} − ${fmt.money(totalCost)}) ÷ (${fmt.num(h)} + ${fmt.num(unpaid)}) = ${fmt.money(effective)}/hr`
                : "Enter a revenue that covers the job's costs"
            }
            note="The divisor is every hour the job takes from you — including the ones no invoice pays for."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Gross profit on the job" value={fmt.money(profit)} hint={`${fmt.pct(margin)} margin on ${fmt.money(rev)}`} tone={profit > 0 ? "success" : "warning"} />
            <ResultRow label="Rate per on-site hour" value={Number.isFinite(rateAtWork) ? `${fmt.money(rateAtWork)}/hr` : "—"} hint={`Profit ÷ ${fmt.num(h)} billed hours`} />
            <ResultRow label="Effective rate per total hour" value={Number.isFinite(effective) ? `${fmt.money(effective)}/hr` : "—"} hint={`Profit ÷ ${fmt.num(totalHours)} real hours`} strong />
            <ResultRow
              label="What the unpaid time costs you"
              value={Number.isFinite(unpaidCostPerHour) ? `${fmt.money(unpaidCostPerHour)}/hr` : "—"}
              hint="The gap between the two rates above"
            />
            <ResultRow
              label={`Against your ${fmt.money(target)}/hr target`}
              value={Number.isFinite(effective) && profit > 0 ? `${meetsTarget ? "+" : ""}${fmt.money(effective - target)}/hr` : "—"}
              tone={meetsTarget ? "success" : "warning"}
              strong
            />
          </div>

          <ResultActions text={copyText} label="Effective hourly rate calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            A rate that only divides by on-site hours flatters every job. The effective rate is
            the one your year actually lives on — compare it against the floor from the{" "}
            <strong>Hourly Rate Calculator</strong>, not against another contractor&apos;s sticker price.
          </p>
        </div>
      </div>
    </section>
  );
}
