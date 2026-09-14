"use client";

/**
 * Announces a short plain-language summary of the current results to screen
 * readers whenever inputs change. Rendered visually hidden.
 */
export default function LiveRegion({ message }: { message: string }) {
  return (
    <div aria-live="polite" role="status" className="visually-hidden">
      {message}
    </div>
  );
}
