/**
 * AdSense-ready ad container.
 *
 * Disabled by default: ads render only when BOTH
 *   NEXT_PUBLIC_ADSENSE_ENABLED=on
 *   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxx
 * are set. Without them this component renders nothing, so the site is
 * fully usable without any ads (and no fake publisher IDs are ever used).
 *
 * Intentionally a client component: the AdSense script only loads when
 * ads are enabled, so normal pages never fetch googlesyndication.
 */
"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** "horizontal" = responsive banner (in-content/footer), "rectangle" = display */
  format?: "horizontal" | "rectangle";
  label?: string;
  style?: React.CSSProperties;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({ format = "horizontal", label = "Advertisement", style }: Props) {
  const enabled =
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "on" &&
    Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);

  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!enabled || pushed.current || !ref.current) return;
    // Load the AdSense loader script once.
    if (!document.querySelector('script[data-rc-adsense]')) {
      const s = document.createElement("script");
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.setAttribute("data-rc-adsense", "true");
      document.head.appendChild(s);
    }
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* loader not ready yet — ad simply doesn't render this pass */
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside aria-label={label} style={{ margin: "var(--space-5) 0", ...style }}>
      <div className="text-small text-muted" style={{ marginBottom: 4, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </div>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-format={format === "horizontal" ? "horizontal" : "rectangle"}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
