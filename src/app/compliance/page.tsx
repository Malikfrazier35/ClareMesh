"use client";
import AuthGate from "@/components/AuthGate";
import AppShellNew from "@/components/AppShell";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import AppShell from "@/components/AppShell";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const supabase = createClient(
  "https://ddevkorgiutduydelhgv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZXZrb3JnaXV0ZHV5ZGVsaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODI0NDIsImV4cCI6MjA5MTc1ODQ0Mn0.J42xtXgMJ0J4DdTwg3eCHKafOHTe0Tb6WRlTwZ9B-eE"
);

const FRAMEWORK_CONTROLS: Record<string, { id: string; title: string; enforcement: string }[]> = {
  "SOC 2": [
    { id: "CM-EN-001", title: "AES-256 encryption at rest", enforcement: "automatic" },
    { id: "CM-EN-002", title: "TLS 1.3 encryption in transit", enforcement: "automatic" },
    { id: "CM-AC-001", title: "Row-level security on all tables", enforcement: "automatic" },
    { id: "CM-AC-002", title: "JWT-based authentication", enforcement: "automatic" },
    { id: "CM-AU-001", title: "Immutable audit log", enforcement: "automatic" },
    { id: "CM-AU-002", title: "Transform provenance tracking", enforcement: "automatic" },
    { id: "CM-AV-001", title: "Multi-region availability", enforcement: "infrastructure" },
    { id: "CM-AV-002", title: "Automated backup and recovery", enforcement: "infrastructure" },
  ],
  "GDPR": [
    { id: "CM-PR-001", title: "Data subject access request pipeline", enforcement: "semi-automatic" },
    { id: "CM-PR-002", title: "Right to erasure compliance", enforcement: "semi-automatic" },
    { id: "CM-PR-003", title: "Consent record tracking", enforcement: "automatic" },
    { id: "CM-PR-004", title: "Data residency controls", enforcement: "configurable" },
  ],
  "CCPA": [
    { id: "CM-CC-001", title: "Do Not Sell compliance", enforcement: "automatic" },
    { id: "CM-CC-002", title: "Consumer data inventory", enforcement: "automatic" },
  ],
  "PCI DSS": [
    { id: "CM-PC-001", title: "No raw card data storage", enforcement: "by design" },
    { id: "CM-PC-002", title: "Tokenized payment references", enforcement: "automatic" },
  ],
  "SOX": [
    { id: "CM-SX-001", title: "Change management audit trail", enforcement: "automatic" },
    { id: "CM-SX-002", title: "Segregation of duties", enforcement: "configurable" },
    { id: "CM-SX-003", title: "Data lineage and provenance", enforcement: "automatic" },
  ],
};

function ComplianceContent() {
  const [activeFramework, setActiveFramework] = useState("SOC 2");
  const [controls, setControls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
      if (!profile) return;
      const { data } = await supabase.from("compliance_controls").select("*").eq("org_id", profile.org_id);
      setControls(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const frameworks = Object.keys(FRAMEWORK_CONTROLS);
  const currentControls = FRAMEWORK_CONTROLS[activeFramework] || [];
  const totalAll = Object.values(FRAMEWORK_CONTROLS).flat().length;
  const passingDB = controls.filter(c => c.status === "passing").length;

  return (
    <AppShell>
      <div style={{ padding: "24px 32px", maxWidth: 960 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 20, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Compliance</h1>
            <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)" }}>Control status across {totalAll} controls in {frameworks.length} frameworks</p>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
          <div style={{ padding: "16px 20px", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginBottom: 4 }}>TOTAL CONTROLS</p>
            <p style={{ fontFamily: F.m, fontSize: 24, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{totalAll}</p>
          </div>
          <div style={{ padding: "16px 20px", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginBottom: 4 }}>FRAMEWORKS</p>
            <p style={{ fontFamily: F.m, fontSize: 24, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{frameworks.length}</p>
          </div>
          <div style={{ padding: "16px 20px", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginBottom: 4 }}>ENFORCEMENT</p>
            <p style={{ fontFamily: F.m, fontSize: 24, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Automatic</p>
          </div>
        </div>

        {/* Framework tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid var(--cm-border-light)", marginBottom: 16 }}>
          {frameworks.map(fw => (
            <button key={fw} type="button" onClick={() => setActiveFramework(fw)} style={{
              padding: "8px 14px", fontSize: 11, fontFamily: F.b, cursor: "pointer", border: "none",
              borderBottom: activeFramework === fw ? "2px solid var(--cm-slate)" : "2px solid transparent",
              background: "transparent",
              color: activeFramework === fw ? "var(--cm-text-panel-h)" : "var(--cm-text-dim)",
              fontWeight: activeFramework === fw ? 500 : 400,
            }}>{fw} <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", marginLeft: 4 }}>{FRAMEWORK_CONTROLS[fw].length}</span></button>
          ))}
        </div>

        {/* Controls list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {currentControls.map((ctrl) => {
            const dbCtrl = controls.find(c => c.control_id === ctrl.id);
            const status = dbCtrl?.status || "passing";
            return (
              <div key={ctrl.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 80px", gap: 0, padding: "10px 16px", borderBottom: "0.5px solid var(--cm-border-light)", alignItems: "center" }}>
                <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{ctrl.id}</span>
                <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)" }}>{ctrl.title}</span>
                <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{ctrl.enforcement}</span>
                <span style={{ fontFamily: F.m, fontSize: 10, textAlign: "right", color: status === "passing" ? "var(--cm-copper)" : status === "needs_config" ? "var(--cm-text-dim)" : "#E24B4A", padding: "2px 6px", border: "0.5px solid var(--cm-border-light)" }}>
                  {status === "passing" ? "PASS" : status === "needs_config" ? "CONFIG" : "FAIL"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

export default function CompliancePage() {
  return <Suspense><ComplianceContent /></Suspense>;
}

