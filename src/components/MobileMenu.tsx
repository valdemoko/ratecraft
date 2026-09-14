"use client";

import { useRef } from "react";
import Link from "next/link";
import { IconArrow } from "./icons";

type Item = { href: string; name: string };

/**
 * Mobile menu as a client island (the only JS on the page): renders the
 * <details> disclosure and closes it whenever a link is clicked, so it
 * doesn't stay open after client-side navigation.
 */
export default function MobileMenu({ links, cta }: { links: Item[]; cta: Item }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");

  return (
    <details className="mobile-details" ref={ref}>
      <summary className="nav-toggle" aria-label="Open menu">Menu</summary>
      <nav aria-label="Mobile" className="mobile-nav">
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>
            {l.name}
          </Link>
        ))}
        <Link
          href={cta.href}
          className="btn btn-primary"
          style={{ marginTop: "var(--space-3)", justifyContent: "center" }}
          onClick={close}
        >
          {cta.name} <IconArrow />
        </Link>
      </nav>
    </details>
  );
}
