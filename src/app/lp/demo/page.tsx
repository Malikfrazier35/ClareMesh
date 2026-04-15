"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

function LpContent() {
  const sp = useSearchParams();
  const utm = sp.get("utm_source") || "";

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      {/* Minimal nav */}
      <div style={{ padding: "12px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <a href="/signup" style={{ fontSize: 12, fontWeight: 500, color: "#fff", textDecoration: "none", padding: "6px 16px", background: "var(--cm-slate)" }}>Start free</a>
      </div>

      {/* Hero — single value proposition */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px 40px" }}>
        <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-copper)", marginBottom: 12, letterSpacing: 1 }}>OPEN-SOURCE FINANCIAL DATA INFRASTRUCTURE</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 36, letterSpacing: -1.5, color: "var(--cm-text-panel-h)", lineHeight: 1.2, marginBottom: 16 }}>
          Stop writing provider-specific transforms.
        </h1>
        <p style={{ fontSize: 16, color: "var(--cm-text-panel-b)", lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
          One npm install. Plaid, Stripe, QuickBooks, Xero, CSV — all normalized to the same schema. 12ms per transform. MIT-licensed. Your data never leaves your infrastructure.
        </p>

        {/* CTA pair */}
        <div style={{ display: "flex", gap: 12, marginBottom: 48 }}>
          <a href="/signup" style={{ padding: "12px 24px", fontSize: 14, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", textDecoration: "none" }}>Get started free</a>
          <a href="/docs" style={{ padding: "12px 24px", fontSize: 14, fontWeight: 500, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-h)", textDecoration: "none" }}>Read the docs</a>
        </div>

        {/* Code demo */}
        <div style={{ padding: 20, background: "var(--cm-terminal)", border: "0.5px solid var(--cm-terminal-bd)", marginBottom: 48 }}>
          <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", marginBottom: 12 }}>BEFORE — 47 LINES OF PROVIDER-SPECIFIC CODE</p>
          <pre style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-mono)", lineHeight: 1.6, marginBottom: 20, opacity: 0.5 }}>{`// Plaid sign flip, date parsing, currency normalization,
// pending vs posted, category arrays, merchant name cleanup,
// amount type coercion, timezone handling, ID generation...
// repeated for every provider × every object type`}</pre>
          <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-copper)", marginBottom: 12 }}>AFTER — 4 LINES WITH CLAREMESH</p>
          <pre style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-hero-b)", lineHeight: 1.8 }}>{`import { transformPlaid } from '@claremesh/transforms/plaid';
import type { Transaction } from '@claremesh/schema';

const txn: Transaction = transformPlaid(rawData, { org_id });`}</pre>
        </div>
      </div>

      {/* Pain points */}
      <div style={{ background: "var(--cm-terminal)", borderTop: "0.5px solid var(--cm-terminal-bd)", borderBottom: "0.5px solid var(--cm-terminal-bd)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
          <p style={{ fontFamily: F.d, fontWeight: 600, fontSize: 18, color: "var(--cm-text-hero-h)", marginBottom: 24 }}>If you've built financial integrations, you know</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { pain: "Plaid returns positive amounts for outflows", fix: "ClareMesh normalizes sign conventions automatically" },
              { pain: "Stripe stores cents, QB stores dollars, Xero stores /Date() timestamps", fix: "One schema. Every field normalized. Every edge case handled." },
              { pain: "Your transform code breaks when providers change their API", fix: "Community-maintained transforms with test fixtures for every edge case" },
              { pain: "You can't query across providers because the data shapes don't match", fix: "5 canonical objects: Account, Transaction, Entity, Balance, Forecast" },
            ].map((item, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 16, border: "0.5px solid var(--cm-terminal-bd)" }}>
                <p style={{ fontSize: 12, color: "var(--cm-text-hero-b)", lineHeight: 1.7 }}>{item.pain}</p>
                <p style={{ fontSize: 12, color: "var(--cm-text-hero-h)", lineHeight: 1.7, fontWeight: 500 }}>{item.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social proof / stats */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 40 }}>
          {[
            { stat: "12ms", label: "per transform" },
            { stat: "5", label: "schema objects" },
            { stat: "6", label: "provider transforms" },
            { stat: "29", label: "compliance controls" },
          ].map((s) => (
            <div key={s.label} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)", textAlign: "center" }}>
              <p style={{ fontFamily: F.m, fontSize: 24, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{s.stat}</p>
              <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pricing teaser */}
        <div style={{ padding: 24, border: "0.5px solid var(--cm-border-light)", textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Start free. Scale when ready.</p>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", marginBottom: 16, lineHeight: 1.7 }}>Open tier is free forever — 1 connector, 1,000 transforms/month, MIT-licensed schema. Paid plans start at $199/month with 50,000 transforms.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <a href="/signup" style={{ padding: "12px 24px", fontSize: 14, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", textDecoration: "none" }}>Get started free</a>
            <a href="/pricing" style={{ padding: "12px 24px", fontSize: 14, fontWeight: 500, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-h)", textDecoration: "none" }}>View pricing</a>
          </div>
        </div>

        {/* Trust signals */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { title: "Your infrastructure", desc: "Deploy on your own Supabase project. ClareMesh never touches your data." },
            { title: "Open source schema", desc: "MIT-licensed. Inspect every line. Fork if you want. We earn trust, not lock-in." },
            { title: "22 compliance controls", desc: "SOC 2, GDPR, CCPA, PCI, SOX. Enforced at the edge function and RLS layer." },
          ].map((t) => (
            <div key={t.title} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{t.title}</p>
              <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 1.7 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: "32px 24px", borderTop: "0.5px solid var(--cm-border-light)", textAlign: "center" }}>
        <p style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)" }}>
          claremesh.com — Financial data infrastructure
        </p>
      </div>
    </div>
  );
}

export default function LpDemoPage() {
  return <Suspense><LpContent /></Suspense>;
}

