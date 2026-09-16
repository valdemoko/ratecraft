"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";

/** Parse the ?e=<JSON> example prefill written by ExampleLink. Returns null when absent/invalid. */
export function readExamplePrefill(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("e");
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const entries = Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      );
      return Object.fromEntries(entries);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Wraps a calculator so that example links (?e=<prefill JSON>) work entirely
 * client-side. The calculators read `prefill` only into their initial useState,
 * so a valid ?e= found after mount remounts the calculator (via key) with the
 * prefilled initial state. First client render always matches the prerendered
 * HTML (no prefill) — no hydration mismatch — and every calculator page stays
 * fully static instead of opting into per-request SSR via searchParams.
 */
export default function ExamplePrefill({
  calculator: Calc,
}: {
  calculator: ComponentType<{ prefill?: Record<string, string> }>;
}) {
  const [prefill, setPrefill] = useState<Record<string, string> | undefined>(undefined);

  useEffect(() => {
    const parsed = readExamplePrefill();
    if (parsed) setPrefill(parsed);
  }, []);

  // Remount when a prefill arrives so it lands in the calculator's initial state.
  return <Calc key={prefill ? JSON.stringify(prefill) : "defaults"} prefill={prefill} />;
}
