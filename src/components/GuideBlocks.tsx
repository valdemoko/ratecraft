import Link from "next/link";
import type { Block } from "@/lib/guides";
import { getTool } from "@/lib/site";

function CtaTool({ slug, label }: { slug: string; label?: string }) {
  const tool = getTool(slug);
  if (!tool) return null;
  return (
    <p style={{ margin: "var(--space-5) 0" }}>
      <Link href={`/calculators/${tool.slug}`} className="btn btn-primary">
        {label ?? tool.name} →
      </Link>
    </p>
  );
}

export function renderGuideBlock(block: Block, i: number) {
  switch (block.type) {
    case "p":
      return <p key={i}>{block.text}</p>;
    case "h2":
      return <h2 key={i}>{block.text}</h2>;
    case "h3":
      return <h3 key={i}>{block.text}</h3>;
    case "ul":
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={i} className="table-wrap card" style={{ padding: "var(--space-2)" }}>
          {block.caption && <div className="text-small text-muted" style={{ padding: "var(--space-2) var(--space-3) 0" }}>{block.caption}</div>}
          <table>
            <thead>
              <tr>
                {block.headers.map((h, j) => (
                  <th key={j} scope="col">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j}>
                  {row.map((cell, k) => (
                    <td key={k}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside
          key={i}
          style={{
            borderLeft: "3px solid var(--color-accent)",
            background: "var(--color-accent-soft)",
            padding: "var(--space-3) var(--space-4)",
            margin: "var(--space-5) 0",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {block.text}
        </aside>
      );
    case "ctaTool":
      return <CtaTool key={i} slug={block.slug} label={block.label} />;
  }
}
