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

const RESOURCES = [
  { title: "Compliance controls", desc: "61 controls across 13 families", href: "/security/controls", category: "DOCUMENTS" },
  { title: "Sub-processors", desc: "7 third-party services we use", href: "/security/sub-processors", category: "DOCUMENTS" },
  { title: "Vulnerability disclosure", desc: "Security researcher policy", href: "/security/vulnerability-disclosure", category: "DOCUMENTS" },
  { title: "Security overview", desc: "Architecture and zero-egress design", href: "/security", category: "DOCUMENTS" },
  { title: "System status", desc: "Real-time uptime and incidents", href: "https://supabase.statuspage.io", category: "OPERATIONAL" },
  { title: "Privacy commitments", desc: "How we handle data", href: "/security#privacy", category: "POLICIES" },
];

function TrustCenterContent() {
  const [stats, setStats] = useState({ controls: 61, frameworks: 14, subProcessors: 7, families: 13 });

  useEffect(() => {
    async function load() {
      const [c, s] = await Promise.all([
        supabase.from("compliance_control_definitions").select("control_id, frameworks", { count: "exact" }),
        supabase.from("sub_processors").select("id", { count: "exact" }),
      ]);
      const allFrameworks = new Set<string>();
      (c.data || []).forEach((row: any) => (row.frameworks || []).forEach((fw: string) => allFrameworks.add(fw)));
      setStats({
        controls: c.count || 61,
        frameworks: allFrameworks.size || 14,
        subProcessors: s.count || 7,
        families: 13,
      });
    }
    load();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      {/* Top nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: "0.5px solid var(--cm-border-light)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          <a href="/schema" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Schema</a>
          <a href="/docs" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Docs</a>
          <a href="/pricing" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Pricing</a>
          <a href="/security" style={{ color: "var(--cm-text-panel-h)", textDecoration: "none", fontWeight: 500 }}>Security</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "72px 32px 48px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2.5, color: "var(--cm-slate)", marginBottom: 12 }}>TRUST CENTER</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 48, letterSpacing: -1.5, lineHeight: 1.05, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>
          Security and compliance, transparently
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--cm-text-panel-b)", maxWidth: 560 }}>
          Every control we enforce, every sub-processor we use, every policy we publish — in one place. Updated with every deploy.
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop: "0.5px solid var(--cm-border-light)", borderBottom: "0.5px solid var(--cm-border-light)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", maxWidth: 960, margin: "0 auto" }}>
          {[
            { v: stats.controls, l: "ACTIVE CONTROLS" },
            { v: stats.frameworks, l: "FRAMEWORKS" },
            { v: stats.families, l: "CONTROL FAMILIES" },
            { v: stats.subProcessors, l: "SUB-PROCESSORS" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "32px 24px", textAlign: "center", borderRight: i < 3 ? "0.5px solid var(--cm-border-light)" : "none" }}>
              <p style={{ fontFamily: F.m, fontSize: 36, fontWeight: 500, color: "var(--cm-text-panel-h)", lineHeight: 1 }}>{s.v}</p>
              <p style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1.5, color: "var(--cm-text-dim)", marginTop: 8 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div style={{ padding: "48px 32px", maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 20, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>Resources</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {RESOURCES.map((r, i) => (
            <a key={i} href={r.href} style={{ display: "block", padding: "20px 24px", border: "0.5px solid var(--cm-border-light)", textDecoration: "none", background: "var(--cm-panel)" }}>
              <p style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1.5, color: "var(--cm-slate)", marginBottom: 8 }}>{r.category}</p>
              <p style={{ fontFamily: F.d, fontSize: 16, fontWeight: 600, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{r.title}</p>
              <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>{r.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={{ borderTop: "0.5px solid var(--cm-border-light)", padding: "32px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>
          Need a SOC 2 report, signed DPA, or custom security questionnaire? <a href="mailto:security@claremesh.com" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Email security@claremesh.com</a>
        </p>
      </div>
    </div>
  );
}

export default function TrustCenterPage() { return <Suspense><TrustCenterContent /></Suspense>; }

