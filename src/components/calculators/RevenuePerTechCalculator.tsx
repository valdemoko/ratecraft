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
  revenueYear: "420000", techs: "2", trucks: "2", weeksYear: "48", hoursWeek: "40",
  utilPct: "65", targetRev: "180000",
};

/**
 * Revenue per technician calculator. Math (verified in tests/math-verification.mjs, section 30):
 *   revPerTech    = revenueYear ÷ techs
 *   revPerTruck   = revenueYear ÷ trucks
 *   billablePerTech = weeks × hoursWeek × utilPct/100
 *   revPerBillableHour = revenueYear ÷ (techs × billablePerTech)
 *   target check: revPerTech vs targetRev — and the billable-hour rate the target implies:
 *   targetRate = targetRev ÷ billablePerTech
 * The published trade benchmarks (HVAC $150–250K/tech, plumbing $140–180K) are context,
 * not targets — the honest comparison is against your own required margin chain. What the
 * tool adds beyond the benchmark: the utilization chain that explains the number, and the
 * revenue-per-billable-hour that makes two shops with the same revenue per tech comparable.
 */
export default function RevenuePerTechCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [revenueYear, setRevenueYear] = useState(prefill?.revenueYear ?? DEFAULTS.revenueYear);
  const [techs, setTechs] = useState(prefill?.techs ?? DEFAULTS.techs);
  const [trucks, setTrucks] = useState(prefill?.trucks ?? DEFAULTS.trucks);
  const [weeksYear, setWeeksYear] = useState(prefill?.weeksYear ?? DEFAULTS.weeksYear);
  const [hoursWeek, setHoursWeek] = useState(prefill?.hoursWeek ?? DEFAULTS.hoursWeek);
  const [utilPct, setUtilPct] = useState(prefill?.utilPct ?? DEFAULTS.utilPct);
  const [targetRev, setTargetRev] = useState(prefill?.targetRev ?? DEFAULTS.targetRev);

  const rev = num(revenueYear);
  const t = num(techs);
  const tr = num(trucks);
  const wks = num(weeksYear);
  const hw = num(hoursWeek);
  const util = num(utilPct);
  const target = num(targetRev);

  const valid = rev > 0 && t > 0 && wks > 0 && hw > 0 && util > 0 && util <= 100;
  const revPerTech = rev / t;
  const revPerTruck = tr > 0 ? rev / tr : NaN;
  const billablePerTech = wks * hw * (util / 100);
  const totalBillable = t * billablePerTech;
  const revPerBillable = valid ? rev / totalBillable : NaN;
  const meetsTarget = target > 0 ? revPerTech >= target : false;
  const targetRate = target > 0 ? target / billablePerTech : NaN;
  const gap = target > 0 ? revPerTech - target : NaN;
  const gapRevenue = target > 0 ? gap * t : NaN;

  const reset = () => {
    setRevenueYear(DEFAULTS.revenueYear); setTechs(DEFAULTS.techs); setTrucks(DEFAULTS.trucks);
    setWeeksYear(DEFAULTS.weeksYear); setHoursWeek(DEFAULTS.hoursWeek); setUtilPct(DEFAULTS.utilPct);
    setTargetRev(DEFAULTS.targetRev);
  };

  const copyText = [
    "RateCraft — Revenue per Technician",
    `Annual revenue: ${fmt.money(rev)} across ${fmt.num(t)} techs, ${fmt.num(tr)} trucks`,
    `Revenue per technician: ${fmt.money(revPerTech)}`,
    tr > 0 ? `Revenue per truck: ${fmt.money(revPerTruck)}` : "",
    `Billable hours per tech: ${fmt.num(billablePerTech)} (${fmt.num(wks)} wks × ${fmt.num(hw)} hrs × ${fmt.pct(util)})`,
    `Revenue per billable hour: ${fmt.money(revPerBillable)}`,
    target > 0 ? `Target: ${fmt.money(target)}/tech — ${meetsTarget ? "met" : `short by ${fmt.money(-gap)} per tech (${fmt.money(-gapRevenue)} of revenue across the crew)`}` : "",
    target > 0 ? `Target implies ${fmt.money(targetRate)}/billable-hour` : "",
  ].filter(Boolean).join("\n");

  return (
    <section aria-label="Revenue per technician calculator">
      <LiveRegion
        message={
          valid
            ? `Revenue per technician ${fmt.money(revPerTech)} — ${fmt.money(revPerBillable)} per billable hour at ${fmt.pct(util)} utilization.`
            : "Enter annual revenue and crew size to compute the KPI."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The year</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="rt-rev" label="Annual revenue" value={revenueYear} onChange={setRevenueYear} unit="$" />
            <Field id="rt-techs" label="Field technicians" value={techs} onChange={setTechs} />
            <Field id="rt-trucks" label="Service trucks" value={trucks} onChange={setTrucks} />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The hours behind it</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="rt-weeks" label="Working weeks per year" value={weeksYear} onChange={setWeeksYear} />
            <Field id="rt-hours" label="Hours per week" value={hoursWeek} onChange={setHoursWeek} unit="hrs" />
            <Field id="rt-util" label="Billable share" value={utilPct} onChange={setUtilPct} unit="%" hint="Quoting, travel and admin aren't billable — the effective rate tool shows their cost" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The benchmark</h2>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <Field id="rt-target" label="Target revenue per technician" value={targetRev} onChange={setTargetRev} unit="$" hint="Your own target from the required-margin math — published trade figures are context, not goals" />
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Revenue per technician</div>
          <div
            className="result-primary"
            style={{ color: target > 0 ? (meetsTarget ? "var(--color-success)" : "var(--color-warning)") : "var(--color-brand)" }}
          >
            {valid ? fmt.money(revPerTech) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Revenue", value: fmt.money(rev) },
              { label: `÷ ${fmt.num(t)} techs`, value: fmt.money(revPerTech), highlight: true },
              { label: "÷ billable hrs", value: valid ? `${fmt.money(revPerBillable)}/hr` : "—" },
              { label: "vs target", value: target > 0 ? (meetsTarget ? "met" : `− ${fmt.money(-gap)}`) : "—" },
            ]}
          />

          <YourCalculation
            formula="Revenue per tech = Annual revenue ÷ Technicians"
            substitution={
              valid
                ? `${fmt.money(rev)} ÷ ${fmt.num(t)} = ${fmt.money(revPerTech)}`
                : "Enter revenue and crew size"
            }
            note="The per-billable-hour row is the honest comparator: two shops can show the same revenue per tech while one bills at $95/hour and the other at $140."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Revenue per technician" value={valid ? fmt.money(revPerTech) : "—"} strong />
            {tr > 0 && <ResultRow label="Revenue per truck" value={fmt.money(revPerTruck)} hint="Asset productivity — diverges from per-tech when utilization does" />}
            <ResultRow label="Billable hours per tech" value={valid ? fmt.num(billablePerTech) : "—"} hint={`${fmt.num(wks)} wks × ${fmt.num(hw)} hrs × ${fmt.pct(util)} — ${(billablePerTech / (wks * hw) * 100).toFixed(0)}% of paid hours`} />
            <ResultRow label="Revenue per billable hour" value={valid ? `${fmt.money(revPerBillable)}/hr` : "—"} hint="The rate the shop actually earns on selling time" strong />
            {target > 0 && (
              <>
                <ResultRow
                  label={`Against the ${fmt.money(target)} target`}
                  value={meetsTarget ? `+ ${fmt.money(gap)}` : `− ${fmt.money(-gap)}`}
                  hint={meetsTarget ? "Target met with room to spare" : `${fmt.money(-gapRevenue)} of crew-wide revenue between here and target`}
                  tone={meetsTarget ? "success" : "warning"}
                  strong
                />
                <ResultRow label="Billable rate the target implies" value={`${fmt.money(targetRate)}/hr`} hint={`What each billable hour must earn at ${fmt.pct(util)} utilization to hit it`} />
              </>
            )}
          </div>

          <ResultActions text={copyText} label="Revenue per technician calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            Read it as a chain, not a single number: revenue per tech moves with three levers —
            the rate per billable hour (your pricing), utilization (routing and quoting
            efficiency), and headcount against demand. Published trade benchmarks vary widely
            with business mix; the number that matters is the one your required margin demands,
            which the Target Gross Margin Calculator produces upstream.
          </p>
        </div>
      </div>
    </section>
  );
}
