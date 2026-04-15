"use client";
import { Suspense } from "react";
import { useParams } from "next/navigation";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const COMPARISONS: Record<string, { name: string; tagline: string; rows: { feature: string; them: string; us: string }[]; summary: string }> = {
  plaid: {
    name: "Plaid",
    tagline: "Plaid connects bank accounts. ClareMesh normalizes what comes out.",
    rows: [
      { feature: "Core function", them: "Bank account aggregation + transaction data", us: "Financial data normalization + schema enforcement" },
      { feature: "Data model", them: "Provider-specific (Plaid schema)", us: "Open canonical schema (5 objects, MIT-licensed)" },
      { feature: "Sign convention", them: "Positive = outflow (non-standard)", us: "Positive = inflow (accounting standard)" },
      { feature: "Multi-provider", them: "Plaid data only", us: "Plaid + Stripe + QuickBooks + Xero + CSV" },
      { feature: "Deployment", them: "Plaid-hosted SaaS", us: "Your infrastructure (Supabase, Vercel, Cloudflare)" },
      { feature: "Schema versioning", them: "Breaking changes with migration guides", us: "Semver with backward compatibility guarantees" },
      { feature: "Compliance", them: "SOC 2, GDPR (Plaid manages)", us: "29 controls you own and audit (10 frameworks)" },
      { feature: "Pricing model", them: "Per-connection + per-API-call", us: "Flat monthly + transform usage" },
    ],
    summary: "ClareMesh doesn't replace Plaid — it normalizes Plaid's output alongside every other provider into a single schema. Use Plaid for bank connectivity, ClareMesh for data consistency across your entire financial stack.",
  },
  merge: {
    name: "Merge",
    tagline: "Merge unifies APIs. ClareMesh unifies financial data models.",
    rows: [
      { feature: "Focus", them: "Unified API across categories (HR, ATS, CRM, Accounting)", us: "Financial data normalization only — deep, not wide" },
      { feature: "Schema", them: "Merge Common Model (proprietary)", us: "ClareMesh Schema (MIT-licensed, inspectable)" },
      { feature: "Financial depth", them: "Basic accounting fields", us: "Full GL: accounts, transactions, entities, balances, forecasts" },
      { feature: "Compliance", them: "SOC 2 (Merge manages)", us: "29 controls across 10 frameworks (you own)" },
      { feature: "Sync direction", them: "Read-only for most categories", us: "Bi-directional with conflict resolution" },
      { feature: "Deployment", them: "Merge-hosted only", us: "Self-hosted or managed" },
      { feature: "Provider edge cases", them: "Generic mapping, limited transform logic", us: "Provider-specific transforms with documented edge case corpus" },
      { feature: "Open source", them: "No", us: "Schema + transforms MIT-licensed" },
    ],
    summary: "Merge is excellent if you need one API across HR, CRM, and accounting simultaneously. ClareMesh is the better choice when financial data accuracy is critical — we go deeper on the financial domain with provider-specific transform logic that handles edge cases Merge's generic mapping misses.",
  },
  "in-house": {
    name: "Building in-house",
    tagline: "You can build it yourself. Here's what that actually costs.",
    rows: [
      { feature: "Initial build time", them: "2-6 months for 2 providers", us: "npm install — 5 minutes for 6 providers" },
      { feature: "Maintenance", them: "Ongoing: provider API changes, schema drift, new edge cases", us: "Community-maintained. PR-tested edge case corpus grows over time." },
      { feature: "Sign convention bugs", them: "Discovered in production, per-provider", us: "Solved once in the transform. Tested against real provider data." },
      { feature: "Compliance", them: "Build your own controls, document your own frameworks", us: "29 controls pre-built. Dashboard ready day one." },
      { feature: "New provider cost", them: "2-4 weeks per provider integration", us: "One import statement per provider" },
      { feature: "Schema evolution", them: "Custom migration scripts, manual testing", us: "Semver with CI validation, canary rollouts" },
      { feature: "Total cost (year 1)", them: "$50K-150K in eng time (2 developers × 3-6 months)", us: "$199-$799/mo ($2,388-$9,588/year)" },
      { feature: "Open source exit", them: "You own all code but maintain all code", us: "MIT schema. Fork anytime. We earn retention, not lock-in." },
    ],
    summary: "Building in-house makes sense if financial data normalization is your core product. If it's infrastructure that supports your product, ClareMesh saves 6+ months of engineering time and replaces ongoing maintenance with a tested, versioned dependency.",
  },
  airbyte: {
    name: "Airbyte",
    tagline: "Airbyte moves data. ClareMesh understands financial data.",
    rows: [
      { feature: "Core function", them: "General-purpose ELT data pipeline", us: "Financial data normalization + schema enforcement" },
      { feature: "Financial awareness", them: "No — treats financial data as generic JSON/CSV", us: "Deep — sign conventions, currency, entity resolution, GL hierarchy" },
      { feature: "Transform logic", them: "dbt models (you write them)", us: "Pre-built provider transforms with tested edge cases" },
      { feature: "Schema", them: "Raw replication (your destination schema)", us: "Canonical 5-object financial schema" },
      { feature: "Compliance", them: "No built-in financial compliance", us: "29 controls, 10 frameworks, jurisdiction-aware" },
      { feature: "Bi-directional sync", them: "No — ELT is one-directional", us: "Yes — diff-based with conflict resolution" },
      { feature: "Deployment complexity", them: "Docker containers, Kubernetes, managed cloud", us: "Edge functions on Supabase (serverless)" },
      { feature: "Open source", them: "Yes (ELCv2 license — not MIT)", us: "Schema + transforms MIT-licensed" },
    ],
    summary: "Airbyte is a powerful general-purpose data pipeline. ClareMesh is purpose-built for financial data — it understands accounting conventions, handles provider-specific edge cases, and enforces compliance controls that a generic pipeline can't. Use Airbyte for non-financial data; use ClareMesh for everything that touches money.",
  },
  fivetran: {
    name: "Fivetran",
    tagline: "Fivetran replicates databases. ClareMesh normalizes financial semantics.",
    rows: [
      { feature: "Core function", them: "Managed ELT — replicate databases to warehouse", us: "Financial data normalization + schema enforcement" },
      { feature: "Financial transform", them: "None — raw replication only", us: "Provider-specific transforms (sign, currency, dates, entity resolution)" },
      { feature: "Schema", them: "Mirror of source schema", us: "Canonical 5-object financial model" },
      { feature: "Self-hosted", them: "No — Fivetran-managed only", us: "Yes — deploy on your own infrastructure" },
      { feature: "Pricing", them: "MAR-based (monthly active rows) — scales with data volume", us: "Transform-based — scales with processing, not storage" },
      { feature: "Compliance", them: "SOC 2 (Fivetran manages)", us: "29 controls you own across 10 frameworks" },
      { feature: "Bi-directional", them: "No", us: "Yes — diff-based sync with conflict resolution" },
      { feature: "Open source", them: "No", us: "Schema + transforms MIT-licensed" },
    ],
    summary: "Fivetran is the gold standard for database replication into a warehouse. ClareMesh operates at a different layer — it normalizes financial data at the application level before it reaches your warehouse, ensuring every record conforms to accounting conventions regardless of source provider.",
  },
};

function CompareContent() {
  const params = useParams();
  const slug = (params?.competitor as string) || "plaid";
  const comp = COMPARISONS[slug];
  if (!comp) return <div style={{ padding: 40, textAlign: "center", fontFamily: F.b, color: "var(--cm-text-panel-b)" }}>Comparison not found. <a href="/compare/plaid">Try ClareMesh vs Plaid</a></div>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <div style={{ padding: "12px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/docs" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Docs</a>
          <a href="/pricing" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Pricing</a>
          <a href="/signup" style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", textDecoration: "none", padding: "4px 12px", border: "0.5px solid var(--cm-border-light)" }}>Get started</a>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-copper)", marginBottom: 8, letterSpacing: 1 }}>COMPARISON</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>ClareMesh vs {comp.name}</h1>
        <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", marginBottom: 32, lineHeight: 1.7 }}>{comp.tagline}</p>

        {/* Comparison table */}
        <div style={{ border: "0.5px solid var(--cm-border-light)", marginBottom: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", borderBottom: "0.5px solid var(--cm-border-light)" }}>
            <div style={{ padding: "8px 12px", fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>FEATURE</div>
            <div style={{ padding: "8px 12px", fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{comp.name.toUpperCase()}</div>
            <div style={{ padding: "8px 12px", fontFamily: F.m, fontSize: 10, color: "var(--cm-slate)" }}>CLAREMESH</div>
          </div>
          {comp.rows.map((row, i) => (
            <div key={row.feature} style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", borderBottom: i < comp.rows.length - 1 ? "0.5px solid var(--cm-border-light)" : "none" }}>
              <div style={{ padding: "10px 12px", fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{row.feature}</div>
              <div style={{ padding: "10px 12px", fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 1.6 }}>{row.them}</div>
              <div style={{ padding: "10px 12px", fontSize: 11, color: "var(--cm-text-panel-h)", lineHeight: 1.6, fontWeight: 500 }}>{row.us}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ padding: 20, border: "0.5px solid var(--cm-border-light)", marginBottom: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>The honest take</p>
          <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", lineHeight: 1.8 }}>{comp.summary}</p>
        </div>

        {/* Other comparisons */}
        <p style={{ fontSize: 12, color: "var(--cm-text-dim)", marginBottom: 12 }}>Other comparisons:</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {Object.entries(COMPARISONS).filter(([k]) => k !== slug).map(([k, v]) => (
            <a key={k} href={`/compare/${k}`} style={{ fontSize: 11, padding: "6px 12px", border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-h)", textDecoration: "none" }}>vs {v.name}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: 32, border: "0.5px solid var(--cm-border-light)" }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Ready to try ClareMesh?</p>
          <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 16 }}>Free tier. No credit card. npm install and go.</p>
          <a href="/signup" style={{ display: "inline-block", padding: "10px 24px", fontSize: 13, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", textDecoration: "none" }}>Get started free</a>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return <Suspense><CompareContent /></Suspense>;
}

