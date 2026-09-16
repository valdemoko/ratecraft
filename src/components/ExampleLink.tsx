"use client";

import { useCallback } from "react";
import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

/**
 * Link that loads a worked example into a calculator via query params (?e=<prefill>),
 * resolved entirely client-side. This keeps every calculator page fully static:
 * the server never reads searchParams (which would opt the route into per-request
 * SSR and off the build-time prerender), while users still get one-click example
 * loading. The calculator reads `?e=` on mount and applies it to its fields.
 */
export default function ExampleLink({
  href,
  prefill,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefill: Record<string, string>;
}) {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      // Plain modifier-clicks (open in new tab, etc.) keep native behavior.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      const qs = new URLSearchParams({ e: JSON.stringify(prefill) }).toString();
      window.location.assign(`${href}?${qs}`);
    },
    [href, prefill],
  );

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
