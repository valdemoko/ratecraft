import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "var(--space-8) var(--space-5)", textAlign: "center" }}>
      <h1>Page not found</h1>
      <p className="text-muted">That page doesn&apos;t exist — but these do:</p>
      <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/" className="btn btn-primary">Home</Link>
        <Link href="/calculators" className="btn btn-secondary">All calculators</Link>
        <Link href="/guides" className="btn btn-secondary">Guides</Link>
      </div>
    </div>
  );
}
