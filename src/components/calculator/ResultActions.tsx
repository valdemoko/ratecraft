"use client";

import { useState } from "react";

/**
 * "Copy result" + "Print" actions.
 * Copy uses the Clipboard API with a textarea fallback; feedback is a
 * polite live region so screen readers hear the confirmation.
 */
export default function ResultActions({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      // Clipboard API unavailable (permissions/insecure context) — fallback.
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    setCopied(ok);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="result-actions">
      <button type="button" className="btn btn-secondary" onClick={copy}>
        {copied ? "Copied ✓" : "Copy result"}
      </button>
      <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
        Print
      </button>
      <span aria-live="polite" role="status" className="visually-hidden">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </div>
  );
}
