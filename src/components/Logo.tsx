/**
 * RateCraft mark — original: a "quote ladder". Three rising bars with a
 * price tick and baseline rule, like a rate climbing up an estimate sheet.
 * Reads as a mark even without the wordmark (see favicon).
 */
export default function Logo({
  compact = false,
  size = 28,
}: {
  compact?: boolean;
  size?: number;
}) {
  return (
    <span className="brand">
      <svg width={size} height={size} viewBox="0 0 28 28" role="img" aria-label="RateCraft logo" fill="none">
        <rect x="1" y="1" width="26" height="26" rx="5" fill="var(--color-accent)" />
        {/* baseline rule — the "worksheet" line */}
        <path d="M6 22.5h16" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        {/* rising bars */}
        <rect x="6.5" y="16" width="3.6" height="6.5" rx="0.9" fill="#fff" opacity="0.72" />
        <rect x="12.2" y="12" width="3.6" height="10.5" rx="0.9" fill="#fff" opacity="0.88" />
        <rect x="17.9" y="7" width="3.6" height="15.5" rx="0.9" fill="#fff" />
        {/* price tick */}
        <path d="M6.5 9.5l5.5-3.5 3 3 6.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      </svg>
      {!compact && <span>RateCraft</span>}
    </span>
  );
}
