type Props = {
  label: string;
  value: string;
  hint?: string;
  strong?: boolean;
  tone?: "default" | "success" | "warning";
};

/** A labeled result line used in calculator output panels. */
export default function ResultRow({ label, value, hint, strong, tone = "default" }: Props) {
  const color =
    tone === "success"
      ? "var(--color-success)"
      : tone === "warning"
        ? "var(--color-danger)"
        : "var(--color-ink)";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: "var(--space-3)",
        padding: "var(--space-2) 0",
        borderBottom: "1px solid var(--color-accent-border)",
      }}
    >
      <div>
        <div style={{ fontWeight: strong ? 700 : 500 }}>{label}</div>
        {hint && <div className="text-faint" style={{ fontSize: "var(--text-label)" }}>{hint}</div>}
      </div>
      <div
        style={{
          fontVariantNumeric: "tabular-nums",
          fontWeight: strong ? 700 : 600,
          fontSize: strong ? "1.05rem" : "0.95rem",
          color,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}
