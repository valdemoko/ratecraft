/**
 * "How we calculated this" — a clean horizontal chain:
 * Cost → Overhead → Markup → Price → Profit
 * Each step: label + live value; the final step is highlighted.
 */
export type MathStep = {
  label: string;
  value: string;
  highlight?: boolean;
};

export default function MathFlow({ steps }: { steps: MathStep[] }) {
  return (
    <div className="math-flow" role="img" aria-label={steps.map((s) => `${s.label}: ${s.value}`).join(", ")}>
      {steps.map((s, i) => (
        <span key={s.label} style={{ display: "contents" }}>
          {i > 0 && (
            <span className="math-arrow" aria-hidden="true">
              →
            </span>
          )}
          <span className={`math-step${s.highlight ? " highlight" : ""}`}>
            <span className="step-label">{s.label}</span>
            <span className="step-value">{s.value}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
