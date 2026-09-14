/**
 * Ambient hero background — fragments of the pricing chain drifting slowly
 * upward like entries on an adding-machine tape. Pure CSS animation over
 * static text (no JS, no canvas); fully disabled under reduced motion.
 * Decorative: hidden from assistive tech.
 */
const FRAGMENTS: { text: string; left: string; delay: string; dur: string }[] = [
  { text: "labor 16 hr × $34.00 …… $544.00", left: "4%", delay: "0s", dur: "30s" },
  { text: "burden +22% …… $663.68", left: "88%", delay: "40s", dur: "34s" },
  { text: "materials $780.00", left: "6%", delay: "3s", dur: "27s" },
  { text: "overhead 15% …… $216.55", left: "88%", delay: "12s", dur: "31s" },
  { text: "total cost $2,024.23", left: "5%", delay: "18s", dur: "29s" },
  { text: "margin 35% → price $3,114.20", left: "86%", delay: "22s", dur: "35s" },
  { text: "profit $1,089.97", left: "8%", delay: "26s", dur: "28s" },
  { text: "0.65 divisor", left: "90%", delay: "31s", dur: "32s" },
  { text: "markup 53.8% ≡ margin 35%", left: "6%", delay: "35s", dur: "33s" },
  { text: "$36.94 /hr burdened", left: "85%", delay: "40s", dur: "30s" },
];

export default function HeroStream() {
  return (
    <div className="hero-stream" aria-hidden="true">
      {FRAGMENTS.map((f) => (
        <span key={f.text} style={{ left: f.left, animationDelay: f.delay, animationDuration: f.dur }}>
          {f.text}
        </span>
      ))}
    </div>
  );
}
