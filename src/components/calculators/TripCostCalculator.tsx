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
  dailyVehicle: "28", minutesDrive: "50", hourlyCost: "38", callsDay: "4", callsYear: "0",
};

/**
 * Truck roll / trip cost calculator. Math (verified in tests/math-verification.mjs, section 21):
 *   driveHoursPerCall = (minutesDrive ÷ 60) ÷ callsDay      (drive time shared across the day's calls)
 *   laborPerCall      = driveHoursPerCall × hourlyCost
 *   tripCost          = dailyVehicle ÷ callsDay + laborPerCall
 *   For a dedicated round trip (callsDay = 1) this is the full drive + vehicle cost.
 * The vehicle row is cash (fuel, wear, insurance share); the drive time is burdened labor
 * that produces no invoice — most trips cost far more than the fuel receipt suggests.
 */
export default function TripCostCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [dailyVehicle, setDailyVehicle] = useState(prefill?.dailyVehicle ?? DEFAULTS.dailyVehicle);
  const [minutesDrive, setMinutesDrive] = useState(prefill?.minutesDrive ?? DEFAULTS.minutesDrive);
  const [hourlyCost, setHourlyCost] = useState(prefill?.hourlyCost ?? DEFAULTS.hourlyCost);
  const [callsDay, setCallsDay] = useState(prefill?.callsDay ?? DEFAULTS.callsDay);
  const [callsYear, setCallsYear] = useState(prefill?.callsYear ?? DEFAULTS.callsYear);

  const veh = num(dailyVehicle);
  const mins = num(minutesDrive);
  const hcost = num(hourlyCost);
  const calls = num(callsDay);
  const perYear = num(callsYear);

  const valid = veh >= 0 && mins >= 0 && hcost >= 0 && calls > 0;
  const driveHoursDay = mins / 60;
  const driveHoursPerCall = driveHoursDay / calls;
  const laborPerCall = driveHoursPerCall * hcost;
  const vehiclePerCall = veh / calls;
  const tripCost = vehiclePerCall + laborPerCall;
  const annualCost = perYear > 0 ? tripCost * perYear : NaN;
  const laborShare = tripCost > 0 ? (laborPerCall / tripCost) * 100 : NaN;
  const weekly = perYear > 0 ? tripCost * (perYear / 48) : NaN;

  const reset = () => {
    setDailyVehicle(DEFAULTS.dailyVehicle); setMinutesDrive(DEFAULTS.minutesDrive);
    setHourlyCost(DEFAULTS.hourlyCost); setCallsDay(DEFAULTS.callsDay);
    setCallsYear(DEFAULTS.callsYear);
  };

  const copyText = [
    "RateCraft — Truck Roll Cost",
    `Vehicle cost: ${fmt.money(veh)}/day ÷ ${fmt.num(calls)} calls = ${fmt.money(vehiclePerCall)}/call`,
    `Drive time: ${fmt.num(mins)} min/day ÷ ${fmt.num(calls)} calls = ${fmt.money(laborPerCall)} of burdened labor per call`,
    `True cost per truck roll: ${fmt.money(tripCost)}`,
    perYear > 0 ? `At ${fmt.num(perYear)} trips/year: ${fmt.money(annualCost)} a year` : "",
    `Labor is ${fmt.pct(laborShare)} of the trip cost — the fuel receipt is the small part`,
  ].filter(Boolean).join("\n");

  return (
    <section aria-label="Truck roll cost calculator">
      <LiveRegion
        message={
          valid && tripCost > 0
            ? `A truck roll costs ${fmt.money(tripCost)} — ${fmt.money(vehiclePerCall)} of vehicle and ${fmt.money(laborPerCall)} of unpaid drive time per call.`
            : "Enter your vehicle cost and drive time to see what a trip really costs."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The vehicle</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="tc-veh" label="Vehicle cost per day" value={dailyVehicle} onChange={setDailyVehicle} unit="$" hint="Fuel, wear, insurance share — what a working day on the road costs in cash" />
            <Field id="tc-calls" label="Calls per day it's spread across" value={callsDay} onChange={setCallsDay} hint="4 calls means each one carries a quarter of the day's driving and vehicle cost" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The drive</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="tc-mins" label="Total driving per day" value={minutesDrive} onChange={setMinutesDrive} unit="min" hint="All the driving a typical day takes — between jobs, to suppliers, home" />
            <Field id="tc-rate" label="Burdened labor cost per hour" value={hourlyCost} onChange={setHourlyCost} unit="$" hint="The Labor Burden Calculator produces this for your crew" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Scale it</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="tc-year" label="Truck rolls per year (optional)" value={callsYear} onChange={setCallsYear} hint="Leave empty to see only the per-trip cost" />
          </div>
          {calls <= 0 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              Calls per day must be at least 1 — the day&apos;s cost has to be spread across something.
            </span>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">True cost per truck roll</div>
          <div className="result-primary" style={{ color: "var(--color-brand)" }}>
            {valid && tripCost > 0 ? fmt.money(tripCost) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Vehicle/call", value: fmt.money(vehiclePerCall) },
              { label: "Drive labor/call", value: fmt.money(laborPerCall) },
              { label: "Trip cost", value: valid && tripCost > 0 ? fmt.money(tripCost) : "—", highlight: true },
              { label: perYear > 0 ? `× ${fmt.num(perYear)}/yr` : "× trips/yr", value: perYear > 0 ? fmt.money(annualCost) : "—" },
            ]}
          />

          <YourCalculation
            formula="Trip cost = Vehicle ÷ Calls + (Drive minutes ÷ 60 ÷ Calls) × Labor cost"
            substitution={
              valid && tripCost > 0
                ? `${fmt.money(vehiclePerCall)} + ${fmt.num(driveHoursPerCall)} hrs × ${fmt.money(hcost)} = ${fmt.money(tripCost)}`
                : "Enter calls per day (1 or more) and the drive time"
            }
            note="Drive time is shared across the day's calls: with 4 calls and 50 minutes of driving, each trip carries about 12.5 minutes of unpaid labor."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Vehicle cost per call" value={valid ? fmt.money(vehiclePerCall) : "—"} hint={`${fmt.money(veh)} ÷ ${fmt.num(calls)} calls`} />
            <ResultRow label="Drive labor per call" value={valid ? fmt.money(laborPerCall) : "—"} hint={`${fmt.num(driveHoursPerCall)} hrs of burdened time — ${valid && tripCost > 0 ? fmt.pct(laborShare) : "—"} of the trip cost`} strong />
            <ResultRow label="True cost per truck roll" value={valid && tripCost > 0 ? fmt.money(tripCost) : "—"} strong tone="success" />
            <ResultRow label="Cost per year at this volume" value={perYear > 0 && Number.isFinite(annualCost) ? fmt.money(annualCost) : "—"} hint={perYear > 0 ? `About ${fmt.money(weekly)} a week across a 48-week year` : undefined} />
          </div>

          <ResultActions text={copyText} label="Truck roll cost calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            Use it three ways: inside the <strong>Flat Rate Calculator</strong>&apos;s trip line
            instead of a guess; as the test for a minimum service charge — a trip that costs
            more than your minimum loses money before anyone touches a tool; and when routing —
            cutting drive time per call is worth real money at volume.
          </p>
        </div>
      </div>
    </section>
  );
}
