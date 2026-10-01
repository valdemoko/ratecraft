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

/** Checked ledger line — job profitability (planned vs actual) */
export function IconCheckLedger({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 5h11" /><path d="M4 10h7" /><path d="M4 15h5" />
      <path d="M13 16.5l2.5 2.5L20 14" />
    </svg>
  );
}

/** Tag with a minus — discount / price cut */
export function IconTagDown({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M12.6 3.4H20V10.8l-8.5 8.5a1.7 1.7 0 0 1-2.4 0l-5-5a1.7 1.7 0 0 1 0-2.4z" />
      <path d="M11 12h5" opacity={0.6} />
      <circle cx="16.4" cy="7.2" r="1.3" />
    </svg>
  );
}

/** Two figures, one selected — employee vs subcontractor */
export function IconPeople({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="8.5" cy="8" r="3" />
      <path d="M3 19.5a5.7 5.7 0 0 1 11 0" />
      <circle cx="17" cy="9.5" r="2.3" opacity={0.55} />
      <path d="M14.6 19.5a4.6 4.6 0 0 1 6.6-4.1" opacity={0.55} />
    </svg>
  );
}

/** Split arrow / added scope — change orders */
export function IconChange({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 12h9" />
      <path d="M13 12c4 0 7-2 7-6" />
      <path d="M13 12c4 0 7 2 7 6" />
      <path d="M17.5 4.2L20 6l-2.5 1.8" />
      <path d="M17.5 16.2L20 18l-2.5 1.8" />
    </svg>
  );
}

/** Target with bullseye — target margin / goals */
export function IconTarget({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" opacity={0.65} />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

/** Stacked boxes with tag — materials pricing */
export function IconBoxes({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 8.5L12 4l8 4.5-8 4.5-8-4.5z" />
      <path d="M4 13l8 4.5 8-4.5" opacity={0.65} />
      <circle cx="17" cy="6.8" r="1.3" />
    </svg>
  );
}

/** Rising arrow over baseline — price increase */
export function IconRaise({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 19h16" />
      <path d="M5 14l5-5 3.5 3L19 6" />
      <path d="M14.5 6H19v4.5" />
    </svg>
  );
}

/** Clock with doubled hands — overtime */
export function IconOvertime({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
      <path d="M12 3.5V2M20.5 12H22" opacity={0.55} />
      <path d="M9 12h1" opacity={0.55} />
    </svg>
  );
}

/** Van with route dashes — truck roll */
export function IconVan({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M3 16V9l3-3h8v10" />
      <path d="M14 9h4l3 3v4" />
      <circle cx="7.5" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
      <path d="M9.3 17.5h5.4M2 13h1.5" />
    </svg>
  );
}

/** Shield with fix arrows — warranty / rework */
export function IconShieldFix({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9.5 12a2.5 2.5 0 0 1 4.3-1.7M14.5 12a2.5 2.5 0 0 1-4.3 1.7" />
      <path d="M14 9.5h1.8v1.8M10 14.5H8.2v-1.8" opacity={0.75} />
    </svg>
  );
}

/** Document with checkmarks — win rate */
export function IconQuoteWin({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M6 3h9l4 4v14H6V3z" />
      <path d="M15 3v4h4" />
      <path d="M9 13l2 2 4-4.5" />
      <path d="M9 17.5h6" opacity={0.55} />
    </svg>
  );
}

/** Wrench with balance — buy vs rent */
export function IconBuyRent({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 8h16" />
      <path d="M12 8v11" />
      <path d="M4 8l-2.5 5a3 3 0 0 0 5 0L4 8zM20 8l-2.5 5a3 3 0 0 0 5 0L20 8z" />
      <path d="M9 21h6" />
    </svg>
  );
}

/** Invoice with clock — payment terms */
export function IconInvoiceClock({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M5 3h11l4 4v6" />
      <path d="M5 3v18h8" />
      <path d="M16 3v4h4" />
      <path d="M8.5 8.5h4M8.5 12h2.5" />
      <circle cx="17" cy="17" r="4" />
      <path d="M17 15v2l1.5 1" />
    </svg>
  );
}

/** Stopwatch with dollar — effective hourly rate */
export function IconStopwatchDollar({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 10.5v-3" />
      <path d="M10 6h4" />
      <path d="M14.8 11.2c-.5-.8-1.6-1.2-2.6-1.2-1.2 0-2.2.7-2.2 1.7s.9 1.4 2.2 1.7c1.3.3 2.2.7 2.2 1.7s-1 1.7-2.2 1.7c-1 0-2.1-.4-2.6-1.2" />
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
