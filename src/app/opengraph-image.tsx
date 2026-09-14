import { ImageResponse } from "next/og";

/**
 * OG image (1200×630) built from the RateCraft identity: paper background,
 * ink text, action-blue panel with the quote-ladder mark and a worked price.
 * Rendered at build time — no external service.
 */
export const alt = "RateCraft — contractor pricing, estimating and profit tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f5f1",
          padding: 64,
        }}
      >
        {/* Left: brand + headline */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingRight: 48,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: "#164a8c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 30 }}>
                <div style={{ width: 8, height: 16, background: "#fff", opacity: 0.72, borderRadius: 2 }} />
                <div style={{ width: 8, height: 23, background: "#fff", opacity: 0.88, borderRadius: 2 }} />
                <div style={{ width: 8, height: 30, background: "#fff", borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#1c2530" }}>RateCraft</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#164a8c",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Contractor pricing tools
            </div>
            <div style={{ fontSize: 64, fontWeight: 800, color: "#1c2530", lineHeight: 1.05 }}>
              Know your costs. Price your work. Protect your profit.
            </div>
          </div>

          <div style={{ fontSize: 26, color: "#4a5764" }}>
            Free calculators — markup, job pricing, labor burden, overhead, break-even
          </div>
        </div>

        {/* Right: mini estimate worksheet */}
        <div
          style={{
            width: 380,
            background: "#e7eef8",
            border: "2px solid #b9cde8",
            borderRadius: 12,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
          }}
        >
          {[
            ["Materials", "$1,000"],
            ["Labor", "$500"],
            ["Overhead", "$150"],
            ["Total cost", "$1,650"],
            ["Recommended price", "$2,063"],
          ].map(([label, value], i) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 28,
                fontWeight: i >= 3 ? 700 : 500,
                color: "#1c2530",
                borderTop: i === 3 ? "3px solid #164a8c" : "1px solid #b9cde8",
                paddingTop: 14,
              }}
            >
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
          <div style={{ fontSize: 26, fontWeight: 700, color: "#1c6b45" }}>Margin 20.0%</div>
        </div>
      </div>
    ),
    size
  );
}
