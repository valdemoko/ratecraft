"use client";

import { isInvalidInput } from "@/lib/format";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  /** e.g. "$", "%", "hrs" */
  unit?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: string;
  type?: "number" | "text";
};

/**
 * Labeled numeric input with unit affix, helper text and inline validation.
 * Invalid (non-numeric) input gets an explicit, actionable error message.
 */
export default function Field({
  id,
  label,
  value,
  onChange,
  unit,
  hint,
  min = 0,
  max,
  step = "any",
  type = "number",
}: Props) {
  const invalid = type === "number" && isInvalidInput(value);

  // Costs, hours and rates have no legitimate negative value in these tools, but
  // number inputs allow typing "-900" regardless of min=0 (min only gates the
  // spinners). Normalize on change so state can never hold a negative number.
  const handleChange = (raw: string) => {
    if (type === "number" && raw.trim().startsWith("-")) {
      onChange(raw.replace(/-/g, ""));
      return;
    }
    onChange(raw);
  };

  const describedBy = [hint ? `${id}-hint` : null, invalid ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-affix">
        {unit === "$" && <span className="prefix" aria-hidden="true">$</span>}
        <input
          id={id}
          type={type}
          inputMode={type === "number" ? "decimal" : undefined}
          className={`${unit === "$" ? "has-prefix" : ""} ${unit && unit !== "$" ? "has-suffix" : ""}`}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => handleChange(e.target.value)}
          aria-describedby={describedBy || undefined}
          aria-invalid={invalid || undefined}
        />
        {unit && unit !== "$" && <span className="suffix" aria-hidden="true">{unit}</span>}
      </div>
      {invalid ? (
        <span id={`${id}-error`} className="field-error" role="alert">
          Enter a valid number for {label.toLowerCase()} — text isn&apos;t used in this field.
        </span>
      ) : (
        hint && (
          <span id={`${id}-hint`} className="hint">
            {hint}
          </span>
        )
      )}
    </div>
  );
}
