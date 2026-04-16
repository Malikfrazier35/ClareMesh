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

function TransformsContent() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
      if (!profile) return;
      let query = supabase.from("transform_logs").select("*").eq("org_id", profile.org_id).order("created_at", { ascending: false }).limit(50);
      if (filter !== "all") query = query.eq("source_type", filter);
      const { data } = await query;
      setLogs(data || []);
      setLoading(false);
    }
    load();
  }, [filter]);

  const providers = ["all", "plaid", "stripe", "quickbooks", "xero", "csv"];
  const totalIn = logs.reduce((s, l) => s + (l.records_in || 0), 0);
  const totalOut = logs.reduce((s, l) => s + (l.records_out || 0), 0);
  const totalErrors = logs.reduce((s, l) => s + (l.errors || 0), 0);
  const avgMs = logs.length > 0 ? Math.round(logs.reduce((s, l) => s + (l.duration_ms || 0), 0) / logs.length) : 0;

  return (
    <AppShell>
      <div style={{ padding: "24px 32px", maxWidth: 960 }}>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 20, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Transforms</h1>
        <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 24 }}>Transform execution log — every normalization recorded</p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
          <div style={{ padding: "12px 16px", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>RECORDS IN</p>
            <p style={{ fontFamily: F.m, fontSize: 20, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{totalIn.toLocaleString()}</p>
          </div>
          <div style={{ padding: "12px 16px", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>RECORDS OUT</p>
            <p style={{ fontFamily: F.m, fontSize: 20, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{totalOut.toLocaleString()}</p>
          </div>
          <div style={{ padding: "12px 16px", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>ERRORS</p>
            <p style={{ fontFamily: F.m, fontSize: 20, fontWeight: 500, color: totalErrors > 0 ? "#E24B4A" : "var(--cm-text-panel-h)" }}>{totalErrors}</p>
          </div>
          <div style={{ padding: "12px 16px", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>AVG LATENCY</p>
            <p style={{ fontFamily: F.m, fontSize: 20, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{avgMs}ms</p>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid var(--cm-border-light)", marginBottom: 16 }}>
          {providers.map(p => (
            <button key={p} type="button" onClick={() => { setFilter(p); setLoading(true); }} style={{
              padding: "6px 12px", fontSize: 11, fontFamily: F.b, border: "none", cursor: "pointer",
              borderBottom: filter === p ? "2px solid var(--cm-slate)" : "2px solid transparent",
              background: "transparent", color: filter === p ? "var(--cm-text-panel-h)" : "var(--cm-text-dim)",
              fontWeight: filter === p ? 500 : 400, textTransform: "capitalize",
            }}>{p}</button>
          ))}
        </div>

        {/* Log table */}
        {loading ? (
          <p style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading...</p>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>No transforms yet</p>
            <p style={{ fontSize: 12, color: "var(--cm-text-dim)" }}>Run your first transform via the API or connect a provider</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 70px 70px 60px 120px", gap: 0, padding: "8px 12px", background: "var(--cm-terminal)" }}>
              <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>SOURCE</span>
              <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>PROVIDER</span>
              <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>IN</span>
              <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>OUT</span>
              <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>MS</span>
              <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", textAlign: "right" }}>TIME</span>
            </div>
            {logs.map(l => (
              <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 70px 70px 60px 120px", gap: 0, padding: "8px 12px", borderBottom: "0.5px solid var(--cm-border-light)", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.connector_id ? l.connector_id.slice(0, 8) + "..." : "API"}</span>
                <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-b)", textTransform: "capitalize" }}>{l.source_type}</span>
                <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-b)" }}>{l.records_in}</span>
                <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-b)" }}>{l.records_out}</span>
                <span style={{ fontFamily: F.m, fontSize: 11, color: (l.duration_ms || 0) > 100 ? "var(--cm-copper)" : "var(--cm-text-dim)" }}>{l.duration_ms || 0}</span>
                <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", textAlign: "right" }}>{new Date(l.created_at).toLocaleString()}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </AppShell>
  );
}

export default function TransformsPage() { return <Suspense><TransformsContent /></Suspense>; }

