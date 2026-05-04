"use client";

import { useState } from "react";

export function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        marginTop: "12px",
        borderRadius: "10px",
        border: "1px solid rgba(96,165,250,0.18)",
        background: "rgba(23,37,84,0.45)",
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 12px",
          borderBottom: "1px solid rgba(96,165,250,0.12)",
          background: "rgba(96,165,250,0.05)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "9px",
            letterSpacing: "0.14em",
            color: "rgba(147,197,253,0.5)",
            textTransform: "uppercase",
          }}
        >
          Prompt
        </span>
        <button
          onClick={handleCopy}
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: copied ? "#4ade80" : "rgba(147,197,253,0.8)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 0",
            transition: "color 0.15s",
          }}
        >
          {copied ? "✓ Copied" : "Copy →"}
        </button>
      </div>

      {/* Prompt text */}
      <pre
        style={{
          margin: 0,
          padding: "12px",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "12px",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.7)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          cursor: "pointer",
        }}
        onClick={handleCopy}
        title="Click to copy"
      >
        {text}
      </pre>
    </div>
  );
}
