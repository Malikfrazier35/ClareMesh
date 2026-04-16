"use client";
import { useEffect, useState, Suspense } from "react";
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

const CATEGORY_LABELS: Record<string, string> = {
  encryption: "Encryption",
  access_auth: "Access & Authentication",
  audit_logging: "Audit Logging",
  availability: "Availability & DR",
  app_security: "Application Security",
  network_security: "Network Security",
  vulnerability_mgmt: "Vulnerability Management",
  incident_response: "Incident Response",
  change_management: "Change Management",
  consent_processing: "Consent & Processing",
  data_rights: "Data Subject Rights",
  retention: "Data Retention",
  vendor: "Vendor & Third-Party Risk",
};

function ControlsContent() {
  const [controls, setControls] = useState<any[]>([]);
  const [activeFW, setActiveFW] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("compliance_control_definitions").select("*").order("control_id").then(({ data }) => {
      setControls(data || []);
      setLoading(false);
    });
  }, []);

  // Get unique frameworks
  const allFrameworks = Array.from(new Set(controls.flatMap(c => c.frameworks || []))).sort();
  const filtered = activeFW === "all" ? controls : controls.filter(c => (c.frameworks || []).includes(activeFW));

  // Group by category
  const byCategory: Record<string, any[]> = {};
  filtered.forEach(c => {
    if (!byCategory[c.category]) byCategory[c.category] = [];
    byCategory[c.category].push(c);
  });

  const categoryOrder = [
    "encryption", "access_auth", "audit_logging", "availability",
    "app_security", "network_security", "vulnerability_mgmt", "incident_response",
    "change_management", "consent_processing", "data_rights", "retention", "vendor"
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: "0.5px solid var(--cm-border-light)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          <a href="/security" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Security</a>
          <a href="/security/trust-center" style={{ color: "var(--cm-text-panel-h)", textDecoration: "none", fontWeight: 500 }}>Trust Center</a>
        </div>
      </nav>

      <div style={{ padding: "48px 32px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 12 }}>
          <a href="/security/trust-center" style={{ color: "var(--cm-text-dim)", textDecoration: "none" }}>Trust Center</a>
          <span style={{ color: "var(--cm-text-dim)" }}>/</span>
          <span style={{ color: "var(--cm-text-panel-h)" }}>Compliance Controls</span>
        </div>

        <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2.5, color: "var(--cm-slate)", marginBottom: 12 }}>COMPLIANCE CONTROLS</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 36, letterSpacing: -1, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>
          {controls.length} controls across {Object.keys(byCategory).length} families
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--cm-text-panel-b)", marginBottom: 32, maxWidth: 720 }}>
          Every control we implement, mapped to the regulatory framework it satisfies. Most are automatically enforced at deploy or runtime — no manual configuration required.
        </p>

        {/* Framework filter */}
        <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid var(--cm-border-light)", marginBottom: 24, flexWrap: "wrap" }}>
          {["all", ...allFrameworks].map(fw => (
            <button key={fw} type="button" onClick={() => setActiveFW(fw)} style={{
              padding: "10px 16px", fontSize: 12, fontFamily: F.b, border: "none", cursor: "pointer",
              borderBottom: activeFW === fw ? "2px solid var(--cm-slate)" : "2px solid transparent",
              background: "transparent",
              color: activeFW === fw ? "var(--cm-text-panel-h)" : "var(--cm-text-dim)",
              fontWeight: activeFW === fw ? 500 : 400,
            }}>
              {fw === "all" ? "All" : fw} <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", marginLeft: 4 }}>{fw === "all" ? controls.length : controls.filter(c => (c.frameworks || []).includes(fw)).length}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading controls...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {categoryOrder.filter(cat => byCategory[cat]).map(cat => (
              <section key={cat}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, paddingBottom: 8, borderBottom: "0.5px solid var(--cm-border-light)" }}>
                  <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 16, color: "var(--cm-text-panel-h)" }}>{CATEGORY_LABELS[cat] || cat}</h2>
                  <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{byCategory[cat].length} controls</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {byCategory[cat].map((c, i) => (
                    <div key={c.control_id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 200px 100px", gap: 16, padding: "12px 0", borderBottom: i < byCategory[cat].length - 1 ? "0.5px solid var(--cm-border-light)" : "none", alignItems: "start" }}>
                      <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)" }}>{c.control_id}</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 2 }}>{c.title}</p>
                        <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", lineHeight: 1.6 }}>{c.description}</p>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {(c.frameworks || []).map((fw: string) => (
                          <span key={fw} style={{ fontFamily: F.m, fontSize: 9, padding: "2px 6px", border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-b)" }}>{fw}</span>
                        ))}
                      </div>
                      <span style={{ fontFamily: F.m, fontSize: 9, color: c.auto_enforced ? "var(--cm-copper)" : "var(--cm-text-dim)", textAlign: "right" }}>
                        {c.auto_enforced ? "AUTO" : (c.enforcement_method || []).join(", ").toUpperCase().substring(0, 12)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: "var(--cm-text-dim)", marginTop: 48, paddingTop: 24, borderTop: "0.5px solid var(--cm-border-light)" }}>
          Need a SOC 2 report or custom security questionnaire? <a href="mailto:security@claremesh.com" style={{ color: "var(--cm-slate)", fontWeight: 500 }}>security@claremesh.com</a>
        </p>
      </div>
    </div>
  );
}

export default function ControlsPage() { return <Suspense><ControlsContent /></Suspense>; }

