"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

/* ═══════════════ STEP 0: JURISDICTION ═══════════════ */
const JURISDICTIONS = [
  { code: "US", name: "United States", framework: "CCPA", region: "us-east-1", currency: "USD" },
  { code: "EU", name: "European Union", framework: "GDPR", region: "eu-central-1", currency: "EUR" },
  { code: "GB", name: "United Kingdom", framework: "UK-GDPR", region: "eu-west-2", currency: "GBP" },
  { code: "SA", name: "Saudi Arabia", framework: "PDPL", region: "eu-central-1", currency: "SAR" },
  { code: "BR", name: "Brazil", framework: "LGPD", region: "sa-east-1", currency: "BRL" },
  { code: "JP", name: "Japan", framework: "APPI", region: "ap-northeast-1", currency: "JPY" },
  { code: "CA", name: "Canada", framework: "PIPEDA", region: "ca-central-1", currency: "CAD" },
  { code: "AU", name: "Australia", framework: "APPs", region: "ap-southeast-2", currency: "AUD" },
  { code: "SG", name: "Singapore", framework: "PDPA", region: "ap-southeast-1", currency: "SGD" },
  { code: "IN", name: "India", framework: "DPDPA", region: "ap-south-1", currency: "INR" },
  { code: "KR", name: "South Korea", framework: "PIPA", region: "ap-northeast-2", currency: "KRW" },
  { code: "DE", name: "Germany", framework: "GDPR", region: "eu-central-1", currency: "EUR" },
];

function JurisdictionStep({ selected, onSelect }: { selected: string; onSelect: (j: typeof JURISDICTIONS[0]) => void }) {
  return (
    <div>
      <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, marginBottom: 6, color: "var(--cm-text-panel-h)" }}>Where is your organization based?</h2>
      <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", marginBottom: 24, lineHeight: 1.7 }}>This determines your data residency region and which compliance controls apply. You can change this later in Settings.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {JURISDICTIONS.map((j) => (
          <button key={j.code} type="button" onClick={() => onSelect(j)} className="cm-bg" style={{
            padding: "14px 12px", textAlign: "left", border: selected === j.code ? "2px solid var(--cm-slate)" : "0.5px solid var(--cm-border-light)",
            background: selected === j.code ? "var(--cm-panel)" : "var(--cm-panel)", cursor: "pointer", fontFamily: F.b, transition: "border-color .2s",
          }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 2 }}>{j.name}</p>
            <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)" }}>{j.framework} / {j.region}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ STEP 1: CONNECT SOURCE ═══════════════ */
const PROVIDERS = [
  { id: "csv", name: "CSV Upload", desc: "Upload a spreadsheet manually", tier: "open", icon: "CSV" },
  { id: "plaid", name: "Plaid", desc: "Bank accounts and transactions", tier: "open", icon: "PLD" },
  { id: "stripe", name: "Stripe", desc: "Payment data and invoices", tier: "build", icon: "STR" },
  { id: "quickbooks", name: "QuickBooks", desc: "General ledger and chart of accounts", tier: "build", icon: "QB" },
  { id: "xero", name: "Xero", desc: "Accounting data and contacts", tier: "build", icon: "XRO" },
  { id: "netsuite", name: "NetSuite", desc: "ERP financial modules", tier: "scale", icon: "NS" },
];

function ConnectStep({ onConnect }: { onConnect: (provider: string) => void }) {
  return (
    <div>
      <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, marginBottom: 6, color: "var(--cm-text-panel-h)" }}>Connect your first data source</h2>
      <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", marginBottom: 24, lineHeight: 1.7 }}>Choose a provider to normalize. CSV and Plaid are available on the Open tier. Others require Build or Scale.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {PROVIDERS.map((p) => (
          <button key={p.id} type="button" onClick={() => onConnect(p.id)} className="cm-cell" style={{
            padding: "16px", textAlign: "left", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)",
            cursor: p.tier === "open" ? "pointer" : "default", opacity: p.tier === "open" ? 1 : 0.5, fontFamily: F.b,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, border: "0.5px solid var(--cm-border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-mono)" }}>{p.icon}</span>
              </div>
              {p.tier !== "open" && <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", padding: "2px 6px", border: "0.5px solid var(--cm-border-light)" }}>{p.tier}</span>}
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 2 }}>{p.name}</p>
            <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)" }}>{p.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ STEP 2: FIRST TRANSFORM ═══════════════ */
function TransformStep({ provider }: { provider: string }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(3), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const raw = `{
  "transaction_id": "plaid_txn_8kx2n",
  "account_id": "plaid_acc_3jf9",
  "amount": 42.50,
  "iso_currency_code": "USD",
  "merchant_name": "Starbucks",
  "date": "2026-04-14",
  "pending": false,
  "category": ["Food","Coffee"]
}`;
  const normalized = `{
  "id": "cm_txn_a7b2c9d4",
  "provider_id": "plaid_txn_8kx2n",
  "account_id": "cm_acc_f3e1a8",
  "amount": -42.50,
  "currency": "USD",
  "description": "Starbucks",
  "date": "2026-04-14T00:00:00Z",
  "pending": false,
  "category": ["Food","Coffee"]
}`;

  return (
    <div>
      <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, marginBottom: 6, color: "var(--cm-text-panel-h)" }}>Your first transform</h2>
      <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", marginBottom: 24, lineHeight: 1.7 }}>Watch raw provider data become a clean ClareMesh object.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "var(--cm-terminal)", padding: 16, border: "0.5px solid var(--cm-terminal-bd)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-mono)" }}>RAW PLAID RESPONSE</span>
            <span style={{ fontFamily: F.m, fontSize: 9, color: phase >= 1 ? "var(--cm-green)" : "var(--cm-text-dim)" }}>{phase >= 1 ? "RECEIVED" : "WAITING"}</span>
          </div>
          <pre style={{ fontFamily: F.m, fontSize: 10, color: phase >= 1 ? "var(--cm-text-hero-b)" : "var(--cm-text-dim)", lineHeight: 1.7, whiteSpace: "pre-wrap", opacity: phase >= 1 ? 1 : 0.3, transition: "opacity .6s" }}>{raw}</pre>
        </div>
        <div style={{ background: "var(--cm-terminal)", padding: 16, border: "0.5px solid var(--cm-terminal-bd)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-mono)" }}>CLAREMESH TRANSACTION</span>
            <span style={{ fontFamily: F.m, fontSize: 9, color: phase >= 3 ? "var(--cm-green)" : phase >= 2 ? "var(--cm-copper)" : "var(--cm-text-dim)" }}>
              {phase >= 3 ? "VALID" : phase >= 2 ? "TRANSFORMING" : "PENDING"}
            </span>
          </div>
          <pre style={{ fontFamily: F.m, fontSize: 10, color: phase >= 3 ? "var(--cm-text-hero-b)" : "var(--cm-text-dim)", lineHeight: 1.7, whiteSpace: "pre-wrap", opacity: phase >= 3 ? 1 : 0.15, transition: "opacity .6s" }}>{normalized}</pre>
        </div>
      </div>
      {phase >= 3 && (
        <div style={{ marginTop: 16, padding: 12, background: "var(--cm-panel-inset)", border: "0.5px solid var(--cm-border-light)" }}>
          <div style={{ display: "flex", gap: 24, fontFamily: F.m, fontSize: 10 }}>
            <span style={{ color: "var(--cm-text-mono)" }}>Duration: <span style={{ color: "var(--cm-green)" }}>12ms</span></span>
            <span style={{ color: "var(--cm-text-mono)" }}>Schema: <span style={{ color: "var(--cm-slate)" }}>v1.0.0</span></span>
            <span style={{ color: "var(--cm-text-mono)" }}>Records: <span style={{ color: "var(--cm-text-panel-h)" }}>1 in / 1 out / 0 errors</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ STEP 3: PLAN SELECTION ═══════════════ */
const PLANS = [
  { code: "open", name: "Open", price: 0, features: ["1 connector (CSV/Plaid)", "1,000 transforms/mo", "7-day audit log", "Community support"], cta: "Continue free" },
  { code: "build", name: "Build", price: 199, features: ["5 connectors", "50,000 transforms/mo", "4 compliance controls", "30-day audit log", "Custom transforms", "Email support"], cta: "Start Build" },
  { code: "scale", name: "Scale", price: 799, popular: true, features: ["Unlimited connectors", "500,000 transforms/mo", "Bi-directional sync", "14 compliance controls", "1-year audit log", "Priority support", "Self-hosted option"], cta: "Start Scale" },
];

function PlanStep({ onSelect }: { onSelect: (plan: string) => void }) {
  return (
    <div>
      <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 22, letterSpacing: -0.5, marginBottom: 6, color: "var(--cm-text-panel-h)" }}>Choose your plan</h2>
      <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", marginBottom: 24, lineHeight: 1.7 }}>Start free. Upgrade when your business needs it. 30-day money-back guarantee on all paid plans.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {PLANS.map((p) => (
          <div key={p.code} style={{ padding: "20px 16px", border: p.popular ? "2px solid var(--cm-slate)" : "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", display: "flex", flexDirection: "column", position: "relative" }}>
            {p.popular && <span style={{ position: "absolute", top: -1, right: 16, fontFamily: F.m, fontSize: 9, color: "var(--cm-panel)", background: "var(--cm-slate)", padding: "3px 8px" }}>RECOMMENDED</span>}
            <p style={{ fontFamily: F.d, fontWeight: 700, fontSize: 16, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{p.name}</p>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: F.m, fontSize: 28, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>${p.price}</span>
              {p.price > 0 && <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-mono)" }}>/mo</span>}
            </div>
            <div style={{ flex: 1, marginBottom: 16 }}>
              {p.features.map((f) => (
                <p key={f} style={{ fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 2 }}>{f}</p>
              ))}
            </div>
            <button type="button" onClick={() => onSelect(p.code)} className={p.popular ? "cm-bp" : "cm-bg"} style={{
              width: "100%", padding: 12, fontSize: 13, fontWeight: 500, fontFamily: F.b, cursor: "pointer",
              color: p.popular ? "var(--cm-cta-panel-c)" : "var(--cm-text-panel-h)",
              background: p.popular ? "var(--cm-cta-panel-bg)" : "var(--cm-panel)",
              border: p.popular ? "var(--cm-cta-panel-bd)" : "0.5px solid var(--cm-border-light)",
            }}>{p.cta}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ STEPPER + MAIN ═══════════════ */
function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [jurisdiction, setJurisdiction] = useState("US");
  const [provider, setProvider] = useState("csv");
  const [saving, setSaving] = useState(false);

  const steps = ["Jurisdiction", "Connect", "Transform", "Plan"];

  const handleJurisdiction = async (j: typeof JURISDICTIONS[0]) => {
    setJurisdiction(j.code);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Update org jurisdiction — the RLS policy allows the owner to update
      const { data: profile } = await supabase.from("profiles").select("org_id").eq("user_id", user.id).single();
      if (profile) {
        await supabase.from("organizations").update({ jurisdiction: j.code, data_residency_region: j.region, locale: "en" }).eq("id", profile.org_id);
      }
    }
  };

  const handleConnect = (p: string) => {
    setProvider(p);
    setStep(2);
  };

  const handlePlan = async (plan: string) => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("org_id").eq("user_id", user.id).single();
      if (profile) {
        await supabase.from("profiles").update({ onboarding_completed: true, onboarding_step: 4 }).eq("user_id", user.id);
        if (plan !== "open") {
          // For paid plans, redirect to Stripe Checkout (placeholder — would call stripe-billing edge function)
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    }
    setSaving(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      {/* Top bar */}
      <div style={{ padding: "16px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
                border: i <= step ? "none" : "0.5px solid var(--cm-border-light)",
                background: i < step ? "var(--cm-slate)" : i === step ? "var(--cm-slate)" : "transparent",
                fontFamily: F.m, fontSize: 10,
                color: i <= step ? "#fff" : "var(--cm-text-dim)",
              }}>{i < step ? "\u2713" : i + 1}</div>
              <span style={{ fontFamily: F.m, fontSize: 10, color: i === step ? "var(--cm-text-panel-h)" : "var(--cm-text-dim)" }}>{s}</span>
              {i < steps.length - 1 && <div style={{ width: 24, height: "0.5px", background: "var(--cm-border-light)" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div style={{ maxWidth: step === 2 ? 720 : 600, margin: "0 auto", padding: "48px 24px" }}>
        {step === 0 && <JurisdictionStep selected={jurisdiction} onSelect={(j) => { handleJurisdiction(j); }} />}
        {step === 1 && <ConnectStep onConnect={handleConnect} />}
        {step === 2 && <TransformStep provider={provider} />}
        {step === 3 && <PlanStep onSelect={handlePlan} />}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="cm-bg" style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-b)", cursor: "pointer" }}>Back</button>
          ) : <div />}
          {step < 3 && (
            <button type="button" onClick={() => setStep(step + 1)} className="cm-bp" style={{
              padding: "10px 24px", fontSize: 13, fontWeight: 500, fontFamily: F.b, cursor: "pointer",
              color: "var(--cm-cta-panel-c)", background: "var(--cm-cta-panel-bg)", border: "var(--cm-cta-panel-bd)",
            }}>{step === 0 ? "Continue" : step === 1 ? "Skip for now" : "Choose plan"}</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return <Suspense><OnboardingWizard /></Suspense>;
}

