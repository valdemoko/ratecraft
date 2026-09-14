/**
 * "Your calculation" — the formula in symbols, then the same formula
 * substituted with the user's live numbers and its result.
 * Example:
 *   Formula:   Selling Price = Cost × (1 + Markup)
 *   Your calc: $1,650 × 1.25 = $2,062.50
 */
export default function YourCalculation({
  formula,
  substitution,
  note,
}: {
  formula: string;
  substitution: string;
  note?: string;
}) {
  return (
    <div style={{ marginTop: "var(--space-4)", fontSize: "0.9rem" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "baseline" }}>
        <span className="text-faint" style={{ fontSize: "var(--text-label)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Formula
        </span>
        <code>{formula}</code>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "baseline", marginTop: 4 }}>
        <span className="text-faint" style={{ fontSize: "var(--text-label)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Your calculation
        </span>
        <code style={{ borderColor: "var(--color-accent-border)", background: "var(--color-surface)" }}>
          {substitution}
        </code>
      </div>
      {note && <div className="text-faint text-small" style={{ marginTop: 4 }}>{note}</div>}
    </div>
  );
}
