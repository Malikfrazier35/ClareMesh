"use client";
import { Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
};

function ContactContent() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Contact ClareMesh</h1>
        <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", lineHeight: 1.7, marginBottom: 24 }}>
          For sales, support, partnerships, or general inquiries, reach out directly to the team.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320, margin: "0 auto" }}>
          <a href="mailto:malik@claremesh.com?subject=ClareMesh%20Inquiry" style={{ padding: "12px 24px", fontSize: 13, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", textDecoration: "none" }}>Email malik@claremesh.com</a>
          <a href="/docs" style={{ padding: "12px 24px", fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-h)", textDecoration: "none" }}>View documentation</a>
          <a href="/" style={{ padding: "12px 24px", fontSize: 13, fontFamily: F.b, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Back to homepage</a>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() { return <Suspense><ContactContent /></Suspense>; }
