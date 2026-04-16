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

function SubProcessorsContent() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("sub_processors").select("*").order("name").then(({ data }) => setItems(data || []));
  }, []);

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

      <div style={{ padding: "48px 32px", maxWidth: 960, margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 12 }}>
          <a href="/security/trust-center" style={{ color: "var(--cm-text-dim)", textDecoration: "none" }}>Trust Center</a>
          <span style={{ color: "var(--cm-text-dim)" }}>/</span>
          <span style={{ color: "var(--cm-text-panel-h)" }}>Sub-processors</span>
        </div>

        <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2.5, color: "var(--cm-slate)", marginBottom: 12 }}>SUB-PROCESSORS</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 36, letterSpacing: -1, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>
          Third-party services we use
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--cm-text-panel-b)", marginBottom: 32, maxWidth: 600 }}>
          ClareMesh uses the following sub-processors to deliver our service. All sub-processors are bound by Data Processing Addendums (DPAs) and reviewed annually for SOC 2 Type II compliance.
        </p>

        {/* Notification policy callout */}
        <div style={{ padding: "16px 20px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", marginBottom: 32 }}>
          <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-copper)", marginBottom: 6 }}>NOTIFICATION POLICY</p>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-h)", lineHeight: 1.6 }}>
            New sub-processors are announced 30 days in advance via email to all customer admins. Subscribe by emailing <a href="mailto:security@claremesh.com?subject=Sub-processor%20updates" style={{ color: "var(--cm-slate)" }}>security@claremesh.com</a>.
          </p>
        </div>

        {/* Sub-processors list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "0.5px solid var(--cm-border-light)" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 140px 180px", gap: 0, padding: "12px 20px", background: "var(--cm-terminal)", borderBottom: "0.5px solid var(--cm-border-light)" }}>
            <span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1.5, color: "var(--cm-text-dim)" }}>VENDOR</span>
            <span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1.5, color: "var(--cm-text-dim)" }}>PURPOSE</span>
            <span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1.5, color: "var(--cm-text-dim)" }}>LOCATION</span>
            <span style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1.5, color: "var(--cm-text-dim)" }}>CERTIFICATIONS</span>
          </div>
          {items.map((s, i) => (
            <div key={s.id} style={{ display: "grid", gridTemplateColumns: "180px 1fr 140px 180px", gap: 0, padding: "16px 20px", borderBottom: i < items.length - 1 ? "0.5px solid var(--cm-border-light)" : "none", alignItems: "start" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{s.name}</span>
              <div>
                <p style={{ fontSize: 13, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{s.purpose}</p>
                <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{(s.data_categories || []).join(" · ")}</p>
              </div>
              <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-b)" }}>{s.location}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {(s.security_certifications || []).map((c: string, j: number) => (
                  <span key={j} style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-copper)" }}>· {c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "var(--cm-text-dim)", marginTop: 24 }}>
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
    </div>
  );
}

export default function SubProcessorsPage() { return <Suspense><SubProcessorsContent /></Suspense>; }

