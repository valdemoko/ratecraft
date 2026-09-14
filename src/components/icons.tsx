/**
 * RateCraft icon set — single style: 1.6px stroke line icons, blueprint feel.
 * All icons share: 24px viewBox, currentColor, aria-hidden by default.
 */
type P = { size?: number; className?: string };

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
}

/** Ascending bars + trend line — markup / growth */
export function IconMarkup({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 20V13" /><path d="M9.3 20V10" /><path d="M14.6 20V7" /><path d="M20 20V4" />
      <path d="M4 8l6-4 4 3 6-5" opacity={0.55} />
    </svg>
  );
}

/** Percent pair — margin */
export function IconPercent({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M19 5L5 19" /><circle cx="7.5" cy="7.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}

/** Sheet with lines — job pricing / estimate */
export function IconSheet({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 8h6" /><path d="M9 12h6" /><path d="M9 16h4" />
    </svg>
  );
}

/** Person + load — labor burden */
export function IconHardHat({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M2.5 16h19" /><path d="M12 8V5" /><path d="M10 5h4" />
    </svg>
  );
}

/** Clock — hourly rate */
export function IconClock({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" />
    </svg>
  );
}

/** Stacked fixed blocks — overhead */
export function IconLayers({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" opacity={0.55} />
    </svg>
  );
}

/** Balance point — break-even */
export function IconScale({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M12 4v16" /><path d="M5 20h14" />
      <path d="M12 6l-6 2 6 2 6-2-6-2z" opacity={0.6} />
      <path d="M6 8l-3 6h6l-3-6z" /><path d="M18 8l-3 6h6l-3-6z" />
    </svg>
  );
}

/** Compass — guides */
export function IconCompass({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </svg>
  );
}

/** Arrow right — CTAs */
export function IconArrow({ size = 16 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 12h15" /><path d="M13 6l6 6-6 6" />
    </svg>
  );
}
