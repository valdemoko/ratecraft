/**
 * AdSense-ready ad container.
 *
 * Disabled by default: ads render only when BOTH
 *   NEXT_PUBLIC_GOOGLE_CMP_SRC  (Google Privacy & Messaging CMP URL)
 *   NEXT_PUBLIC_ADSENSE_CLIENT  (ca-pub-xxxx)
 * are set. Without them this component renders nothing, so the site is
 * fully usable without any ads.
 *
 * Consent model (official Google integration): Consent Mode defaults are
 * denied (ConsentScripts in the root layout) and the Google CMP updates the
 * signals per the user's real decision. The CMP blocks serving until consent
 * exists in regulated regions, so this component does not gate on its own
 * banner or local storage — there is no second consent system here.
 *
 * Intentionally a client component so the push() only runs on mounted pages.
 */
"use client";

import { useEffect, useRef, useState } from "react";

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
  const cmpConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CMP_SRC?.trim());
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
  const enabled = cmpConfigured && Boolean(client);

  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (enabled) setReady(true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ready || pushed.current || !ref.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* loader not ready yet — ad simply doesn't render this pass */
    }
  }, [enabled, ready]);

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
        data-ad-client={client}
        data-ad-format={format === "horizontal" ? "horizontal" : "rectangle"}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
