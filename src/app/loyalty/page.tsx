"use client";
import { Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const MILESTONES = [
  { months: 3, reward: "+2,000 transforms/month", desc: "Your first quarter with us" },
  { months: 6, reward: "30-day audit log on any plan", desc: "Half a year of trust" },
  { months: 12, reward: "+5,000 transforms + custom transforms", desc: "One full year" },
  { months: 18, reward: "+1 connector on any plan", desc: "A year and a half of partnership" },
  { months: 24, reward: "4 compliance controls on any plan", desc: "Two years running" },
  { months: 36, reward: "Priority support on any plan", desc: "Three years of commitment" },
  { months: 48, reward: "10% permanent discount", desc: "Four years — you helped build this" },
];

function LoyaltyContent() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <div style={{ padding: "12px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/pricing" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Pricing</a>
          <a href="/security" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Security</a>
          <a href="/signup" style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", textDecoration: "none", padding: "4px 12px", border: "0.5px solid var(--cm-border-light)" }}>Get started</a>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>We grow with you</h1>
        <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", marginBottom: 40, lineHeight: 1.7, maxWidth: 520 }}>ClareMesh rewards loyalty, not just purchases. The longer you stay, the more you unlock — permanently. No contracts. No lock-in. Just compounding value for compounding trust.</p>

        {/* Promises */}
        <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>Our promises</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
          {[
            { title: "Your price never goes up", desc: "Early adopters and founding customers keep their signup-era pricing forever. We'll never charge you more for growing." },
            { title: "Rewards never expire", desc: "Every milestone you unlock is permanent. Downgrade, take a break, come back in two years — your rewards are waiting." },
            { title: "We'll never remove features you use", desc: "If you had 3 connectors when the free tier allowed it, you keep 3 connectors. Existing users are grandfathered, always." },
            { title: "Your data is always yours", desc: "Cancel anytime. Export everything. We preserve your data for 90 days after cancellation. Your loyalty status is permanent regardless." },
            { title: "Contributors are customers too", desc: "Submit a PR to our open-source repos and you permanently unlock Build-tier features on any plan. Code is currency here." },
          ].map((p, i) => (
            <div key={p.title} style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: 12, padding: "14px 16px", border: "0.5px solid var(--cm-border-light)" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--cm-slate)" }}>{i + 1}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{p.title}</p>
                <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>Loyalty milestones</h2>
        <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 16, lineHeight: 1.7 }}>Milestones unlock automatically based on your tenure. Once unlocked, they're permanent — they stay even if you change plans or take a break.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 40 }}>
          {MILESTONES.map((m) => (
            <div key={m.months} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 0, border: "0.5px solid var(--cm-border-light)" }}>
              <div style={{ padding: "12px 14px", borderRight: "0.5px solid var(--cm-border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: F.m, fontSize: 12, fontWeight: 500, color: "var(--cm-slate)" }}>{m.months} mo</span>
              </div>
              <div style={{ padding: "10px 14px" }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 2 }}>{m.reward}</p>
                <p style={{ fontSize: 10, color: "var(--cm-text-dim)" }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cohorts */}
        <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>Cohorts</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 40 }}>
          {[
            { name: "Founding customers", desc: "First 25 paying customers. Lifetime price lock, +25K transforms, +3 connectors, +5 seats, direct founder access.", badge: "FOUNDING" },
            { name: "Early adopters", desc: "Joined in the first 6 months. Price lock, +10K transforms, +2 connectors, beta feature access.", badge: "EARLY" },
            { name: "Community contributors", desc: "Merged a PR to our open-source repos. +5K transforms, +1 connector, custom transforms unlocked. Always open.", badge: "CONTRIB" },
            { name: "General", desc: "All customers. Full milestone track. Suite discounts. Loyalty score. Every customer matters.", badge: "GENERAL" },
          ].map((c) => (
            <div key={c.name} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{c.name}</p>
                <span style={{ fontFamily: F.m, fontSize: 8, color: "var(--cm-slate)", padding: "1px 6px", border: "0.5px solid var(--cm-slate)" }}>{c.badge}</span>
              </div>
              <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 1.7 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: 32, border: "0.5px solid var(--cm-border-light)" }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Start building your loyalty today</p>
          <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 16 }}>Every day you use ClareMesh counts toward your next milestone.</p>
          <a href="/signup" style={{ display: "inline-block", padding: "10px 24px", fontSize: 13, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", textDecoration: "none" }}>Get started free</a>
        </div>
      </div>
    </div>
  );
}

export default function LoyaltyPage() {
  return <Suspense><LoyaltyContent /></Suspense>;
}

