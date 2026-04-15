"use client";
import { Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const CONTROLS = [
  { id: "CM-EN-001", title: "AES-256 encryption at rest", cat: "Encryption", auto: true },
  { id: "CM-EN-002", title: "TLS 1.3 in transit", cat: "Encryption", auto: true },
  { id: "CM-EN-003", title: "Field-level encryption for PII", cat: "Encryption", auto: true },
  { id: "CM-AC-001", title: "Row-level security on all tables", cat: "Access control", auto: true },
  { id: "CM-AC-002", title: "JWT + API key authentication", cat: "Access control", auto: true },
  { id: "CM-AC-003", title: "Role-based permissions (RBAC)", cat: "Access control", auto: false },
  { id: "CM-AU-001", title: "Immutable audit log", cat: "Audit", auto: true },
  { id: "CM-AU-002", title: "Actor + action + timestamp on every write", cat: "Audit", auto: true },
  { id: "CM-DR-001", title: "Data residency per jurisdiction", cat: "Data residency", auto: true },
  { id: "CM-DR-002", title: "Cross-border transfer controls", cat: "Data residency", auto: true },
  { id: "CM-RT-001", title: "Configurable retention policies", cat: "Retention", auto: false },
  { id: "CM-RT-002", title: "Automated data subject request processing", cat: "Retention", auto: false },
];

function SecurityContent() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <div style={{ padding: "12px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/pricing" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Pricing</a>
          <a href="/schema" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Schema</a>
          <a href="/signup" style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", textDecoration: "none", padding: "4px 12px", border: "0.5px solid var(--cm-border-light)" }}>Get started</a>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Security trust center</h1>
        <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", marginBottom: 40, lineHeight: 1.7, maxWidth: 560 }}>ClareMesh is built for regulated financial data. Every component is designed with security, compliance, and data sovereignty as first-class concerns — not bolted-on features.</p>

        {/* Architecture overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 40 }}>
          {[
            { title: "Three-layer perimeter", desc: "JWT authentication at the edge, RLS enforcement at the database, org-level isolation at the application. Every request passes through all three layers." },
            { title: "Customer-owned data", desc: "Enterprise customers can deploy ClareMesh to their own Supabase project. They own the database, the backups, and the encryption keys. ClareMesh has service access, not ownership." },
            { title: "Zero trust by default", desc: "No shared secrets between orgs. No cross-org data access possible even with admin keys. RLS policies are applied at the PostgreSQL level — they can't be bypassed by application code." },
          ].map((item) => (
            <div key={item.title} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>{item.title}</p>
              <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>Security controls</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 40 }}>
          {CONTROLS.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: "0.5px solid var(--cm-border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-slate)", minWidth: 80 }}>{c.id}</span>
                <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)" }}>{c.title}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>{c.cat}</span>
                {c.auto && <span style={{ fontFamily: F.m, fontSize: 8, color: "var(--cm-green)", padding: "1px 4px", border: "0.5px solid var(--cm-green)" }}>AUTO</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance frameworks */}
        <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>Supported frameworks</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 40 }}>
          {["SOC 2", "GDPR", "CCPA", "PCI DSS", "SOX", "PDPL", "LGPD", "APPI", "UK-GDPR", "PIPL"].map((fw) => (
            <div key={fw} style={{ padding: "12px 8px", textAlign: "center", border: "0.5px solid var(--cm-border-light)" }}>
              <p style={{ fontFamily: F.m, fontSize: 11, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{fw}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ padding: 20, border: "0.5px solid var(--cm-border-light)" }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>Security inquiries</p>
          <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", lineHeight: 1.7 }}>For security questions, vulnerability reports, or compliance documentation requests, contact <a href="mailto:security@claremesh.com" style={{ color: "var(--cm-slate)" }}>security@claremesh.com</a>. We respond to all security inquiries within 24 hours.</p>
        </div>
      </div>
    </div>
  );
}

export default function SecurityPage() {
  return <Suspense><SecurityContent /></Suspense>;
}

