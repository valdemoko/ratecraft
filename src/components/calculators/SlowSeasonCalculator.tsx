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
  overheadMonth: "8500", ownerIncome: "6000", slowMarginPct: "35", slowRevenue: "15000",
  slowMonths: "3", peakSurplus: "4500",
};

/**
 * Slow season reserve calculator. Math (verified in tests/math-verification.mjs, section 27):
 *   monthlyNeed   = overhead + ownerIncome                 (cash the month must produce)
 *   slowMargin$   = slowRevenue × slowMarginPct/100        (gross profit a slow month generates)
 *   monthlyGap    = max(0, monthlyNeed − slowMargin$)
 *   totalReserve  = monthlyGap × slowMonths
 *   weeklySave    = totalReserve ÷ (saveWeeks)             (set aside during the good months)
 *   peakCheck     = peakSurplus × peakMonths ≥ totalReserve?
 * The gap is what each slow month costs after the gross profit it does generate — the
 * reserve is that sum, built deliberately in the surplus months instead of borrowed in spring.
 */
export default function SlowSeasonCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [overheadMonth, setOverheadMonth] = useState(prefill?.overheadMonth ?? DEFAULTS.overheadMonth);
  const [ownerIncome, setOwnerIncome] = useState(prefill?.ownerIncome ?? DEFAULTS.ownerIncome);
  const [slowMarginPct, setSlowMarginPct] = useState(prefill?.slowMarginPct ?? DEFAULTS.slowMarginPct);
  const [slowRevenue, setSlowRevenue] = useState(prefill?.slowRevenue ?? DEFAULTS.slowRevenue);
  const [slowMonths, setSlowMonths] = useState(prefill?.slowMonths ?? DEFAULTS.slowMonths);
  const [peakSurplus, setPeakSurplus] = useState(prefill?.peakSurplus ?? DEFAULTS.peakSurplus);
  const [peakMonths, setPeakMonths] = useState(prefill?.peakMonths ?? "6");

  const oh = num(overheadMonth);
  const inc = num(ownerIncome);
  const smp = num(slowMarginPct);
  const srev = num(slowRevenue);
  const sm = num(slowMonths);
  const ps = num(peakSurplus);
  const pm = num(peakMonths);

  const valid = oh >= 0 && inc >= 0 && smp >= 0 && smp < 100 && srev >= 0 && sm > 0;
  const monthlyNeed = oh + inc;
  const slowMargin = srev * (smp / 100);
  const monthlyGap = Math.max(0, monthlyNeed - slowMargin);
  const totalReserve = monthlyGap * sm;
  const weeklySave = totalReserve / (pm * 4.33);
  const peakCapacity = ps * pm;
  const reserveCovered = peakCapacity >= totalReserve;
  const shareOfSurplus = peakCapacity > 0 ? (totalReserve / peakCapacity) * 100 : NaN;

  const reset = () => {
    setOverheadMonth(DEFAULTS.overheadMonth); setOwnerIncome(DEFAULTS.ownerIncome);
    setSlowMarginPct(DEFAULTS.slowMarginPct); setSlowRevenue(DEFAULTS.slowRevenue);
    setSlowMonths(DEFAULTS.slowMonths); setPeakSurplus(DEFAULTS.peakSurplus); setPeakMonths("6");
  };

  const copyText = [
    "RateCraft — Slow Season Reserve",
    `Monthly cash need: ${fmt.money(monthlyNeed)} (overhead ${fmt.money(oh)} + income ${fmt.money(inc)})`,
    `Slow-month gross profit: ${fmt.money(slowMargin)} (${fmt.pct(smp)} of ${fmt.money(srev)})`,
    `Gap per slow month: ${fmt.money(monthlyGap)}`,
    `Reserve for ${fmt.num(sm)} slow months: ${fmt.money(totalReserve)}`,
    `Weekly set-aside across ${fmt.num(pm)} good months: ${fmt.money(weeklySave)}`,
    peakCapacity > 0
      ? `Peak surplus capacity: ${fmt.money(peakCapacity)} — ${reserveCovered ? "covers" : "does NOT cover"} the reserve (${fmt.pct(shareOfSurplus)} of it)`
      : "",
  ].filter(Boolean).join("\n");

  return (
    <section aria-label="Slow season reserve calculator">
      <LiveRegion
        message={
          valid
            ? `Each slow month leaves a ${fmt.money(monthlyGap)} gap — a ${fmt.money(totalReserve)} reserve, built at ${fmt.money(weeklySave)} a week during the good months.`
            : "Enter your monthly needs and a slow-season revenue estimate to size the reserve."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>What each month must pay</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ss-oh" label="Monthly overhead" value={overheadMonth} onChange={setOverheadMonth} unit="$" hint="Insurance, vehicles, rent, software — the Overhead Calculator totals it" />
            <Field id="ss-inc" label="What you need to pay yourself" value={ownerIncome} onChange={setOwnerIncome} unit="$" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>A typical slow month</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ss-srev" label="Revenue in a slow month" value={slowRevenue} onChange={setSlowRevenue} unit="$" hint="Your realistic low month — not your worst nightmare" />
            <Field id="ss-smp" label="Gross margin on that work" value={slowMarginPct} onChange={setSlowMarginPct} unit="%" />
            <Field id="ss-sm" label="Slow months per year" value={slowMonths} onChange={setSlowMonths} hint="How many months the gap repeats" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Building the reserve</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ss-ps" label="Surplus in a good month" value={peakSurplus} onChange={setPeakSurplus} unit="$" hint="Gross profit left after overhead and your income in a strong month" />
            <Field id="ss-pm" label="Good months to save across" value={peakMonths} onChange={setPeakMonths} />
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Reserve for the slow season</div>
          <div className="result-primary" style={{ color: "var(--color-brand)" }}>
            {valid ? fmt.money(totalReserve) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Monthly need", value: fmt.money(monthlyNeed) },
              { label: "− slow profit", value: `− ${fmt.money(slowMargin)}` },
              { label: "Gap/month", value: fmt.money(monthlyGap), highlight: monthlyGap > 0 },
              { label: `× ${fmt.num(sm)} months`, value: fmt.money(totalReserve), highlight: true },
            ]}
          />

          <YourCalculation
            formula="Reserve = Slow months × max(0, Monthly need − Slow-month gross profit)"
            substitution={
              valid
                ? `${fmt.num(sm)} × max(0, ${fmt.money(monthlyNeed)} − ${fmt.money(slowMargin)}) = ${fmt.money(totalReserve)}`
                : "Enter the monthly needs and slow-season revenue"
            }
            note="The gap is what each slow month costs after the gross profit it does generate — the number to have set aside before the phone stops ringing."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Monthly cash need" value={fmt.money(monthlyNeed)} hint={`${fmt.money(oh)} overhead + ${fmt.money(inc)} income`} />
            <ResultRow label="Gross profit a slow month generates" value={fmt.money(slowMargin)} hint={`${fmt.pct(smp)} of ${fmt.money(srev)}`} />
            <ResultRow label="Gap per slow month" value={fmt.money(monthlyGap)} tone={monthlyGap > 0 ? "warning" : "success"} strong />
            <ResultRow label="Total reserve needed" value={fmt.money(totalReserve)} hint={`${fmt.num(sm)} months × ${fmt.money(monthlyGap)}`} strong />
            <ResultRow label="Weekly set-aside in good months" value={Number.isFinite(weeklySave) ? fmt.money(weeklySave) : "—"} hint={`Across ${fmt.num(pm)} months — moved to a separate account`} tone="success" strong />
            {pm > 0 && Number.isFinite(shareOfSurplus) && (
              <ResultRow
                label="Share of peak surplus it takes"
                value={fmt.pct(shareOfSurplus)}
                hint={reserveCovered
                  ? `Your ${fmt.money(peakCapacity)} of surplus covers the reserve with ${fmt.money(peakCapacity - totalReserve)} to spare`
                  : `Peak surplus is ${fmt.money(totalReserve - peakCapacity)} short — start earlier or cut the gap`}
                tone={reserveCovered ? "success" : "warning"}
              />
            )}
          </div>

          <ResultActions text={copyText} label="Slow season reserve calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            This is the discipline the seasonal businesses live or die by: the reserve is built
            in July, deliberately, into a separate account — not borrowed in February against
            the line of credit. The Maintenance Agreement Calculator is the other lever: it
            converts part of the gap into a flat monthly line.
          </p>
        </div>
      </div>
    </section>
  );
}
