export const fmt = {
  money(n: number): string {
    if (!Number.isFinite(n)) return "—";
    const rounded = Math.round(n * 100) / 100;
    return rounded.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },
  /** Money rounded to whole dollars for headline prices. */
  price(n: number): string {
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  },
  pct(n: number, digits = 1): string {
    if (!Number.isFinite(n)) return "—";
    return `${(Math.round(n * 10 ** digits) / 10 ** digits).toFixed(digits)}%`;
  },
  num(n: number): string {
    if (!Number.isFinite(n)) return "—";
    return (Math.round(n * 100) / 100).toLocaleString("en-US");
  },
};

/**
 * Parse an input string. Empty → 0 (neutral for additive fields).
 * Uses Number() (strict) so "12abc" is invalid — matching Field validation.
 */
export function num(v: string): number {
  if (v.trim() === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** True when the string is non-empty and not a valid number (for field errors). */
export function isInvalidInput(v: string): boolean {
  return v.trim() !== "" && Number.isNaN(Number(v));
}
