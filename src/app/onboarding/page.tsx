"use client";
import { useState, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const supabase = createClient(
  "https://ddevkorgiutduydelhgv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZXZrb3JnaXV0ZHV5ZGVsaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODI0NDIsImV4cCI6MjA5MTc1ODQ0Mn0.J42xtXgMJ0J4DdTwg3eCHKafOHTe0Tb6WRlTwZ9B-eE"
);

const STEPS = [
  { id: 1, title: "Name your organization", desc: "This is how your team will appear in ClareMesh." },
  { id: 2, title: "Choose your first connector", desc: "Connect a financial data source to start normalizing." },
  { id: 3, title: "Select your jurisdiction", desc: "We'll configure compliance controls for your region." },
];

const PROVIDERS = [
  { id: "plaid", name: "Plaid", desc: "Bank accounts and transactions" },
  { id: "stripe", name: "Stripe", desc: "Payments and invoices" },
  { id: "quickbooks", name: "QuickBooks", desc: "Accounting and GL" },
  { id: "xero", name: "Xero", desc: "Invoicing and bank feeds" },
  { id: "csv", name: "CSV Upload", desc: "Custom data from any source" },
];

const JURISDICTIONS = [
  { code: "US", name: "United States", frameworks: "SOC 2, CCPA, SOX" },
  { code: "EU", name: "European Union", frameworks: "GDPR, SOC 2" },
  { code: "GB", name: "United Kingdom", frameworks: "UK-GDPR, SOC 2" },
  { code: "CA", name: "Canada", frameworks: "PIPEDA, SOC 2" },
  { code: "AU", name: "Australia", frameworks: "APRA, SOC 2" },
  { code: "OTHER", name: "Other", frameworks: "SOC 2" },
];

function OnboardingContent() {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [provider, setProvider] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [saving, setSaving] = useState(false);

  async function complete() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // Update org name
    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (profile) {
      await supabase.from("organizations").update({ name: orgName, config: { jurisdiction, first_provider: provider } }).eq("id", profile.org_id);
      await supabase.from("profiles").update({ onboarding_completed: true, onboarding_step: 3 }).eq("id", user.id);
    }
    window.location.href = "/dashboard";
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480, padding: "24px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {STEPS.map(s => (
            <div key={s.id} style={{ flex: 1, height: 2, background: s.id <= step ? "var(--cm-slate)" : "var(--cm-border-light)" }} />
          ))}
        </div>

        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 20, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{STEPS[step - 1].title}</h1>
        <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 24 }}>{STEPS[step - 1].desc}</p>

        {/* Step 1: Org name */}
        {step === 1 && (
          <div>
            <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Acme Corp" style={{ width: "100%", padding: "12px 16px", fontSize: 14, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", marginBottom: 16 }} />
            <button type="button" disabled={!orgName.trim()} onClick={() => setStep(2)} style={{ width: "100%", padding: "12px", fontSize: 13, fontWeight: 500, fontFamily: F.b, background: orgName.trim() ? "var(--cm-slate)" : "var(--cm-border-light)", color: orgName.trim() ? "#fff" : "var(--cm-text-dim)", border: "none", cursor: orgName.trim() ? "pointer" : "default" }}>Continue</button>
          </div>
        )}

        {/* Step 2: Provider */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {PROVIDERS.map(p => (
                <button key={p.id} type="button" onClick={() => setProvider(p.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", border: provider === p.id ? "2px solid var(--cm-slate)" : "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", cursor: "pointer", textAlign: "left" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: "var(--cm-text-dim)" }}>{p.desc}</p>
                  </div>
                  {provider === p.id && <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-copper)" }}>SELECTED</span>}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: "12px", fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", cursor: "pointer" }}>Back</button>
              <button type="button" disabled={!provider} onClick={() => setStep(3)} style={{ flex: 2, padding: "12px", fontSize: 13, fontWeight: 500, fontFamily: F.b, background: provider ? "var(--cm-slate)" : "var(--cm-border-light)", color: provider ? "#fff" : "var(--cm-text-dim)", border: "none", cursor: provider ? "pointer" : "default" }}>Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Jurisdiction */}
        {step === 3 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
              {JURISDICTIONS.map(j => (
                <button key={j.code} type="button" onClick={() => setJurisdiction(j.code)} style={{ padding: "12px", border: jurisdiction === j.code ? "2px solid var(--cm-slate)" : "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", cursor: "pointer", textAlign: "left" }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{j.name}</p>
                  <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", marginTop: 2 }}>{j.frameworks}</p>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: "12px", fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", cursor: "pointer" }}>Back</button>
              <button type="button" disabled={!jurisdiction || saving} onClick={complete} style={{ flex: 2, padding: "12px", fontSize: 13, fontWeight: 500, fontFamily: F.b, background: jurisdiction ? "var(--cm-slate)" : "var(--cm-border-light)", color: jurisdiction ? "#fff" : "var(--cm-text-dim)", border: "none", cursor: jurisdiction ? "pointer" : "default" }}>{saving ? "Setting up..." : "Launch dashboard"}</button>
            </div>
          </div>
        )}

        <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginTop: 24, textAlign: "center" }}>Step {step} of 3</p>
      </div>
    </div>
  );
}

export default function OnboardingPage() { return <Suspense><OnboardingContent /></Suspense>; }

