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

function SyncContent() {
  const [channels, setChannels] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [plan, setPlan] = useState<string>("open");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
      if (!profile) return;
      const { data: org } = await supabase.from("organizations").select("current_plan").eq("id", profile.org_id).single();
      setPlan(org?.current_plan || "open");
      const [chRes, evRes] = await Promise.all([
        supabase.from("sync_channels").select("*").eq("org_id", profile.org_id).order("created_at", { ascending: false }),
        supabase.from("sync_events").select("*").eq("org_id", profile.org_id).order("created_at", { ascending: false }).limit(20),
      ]);
      setChannels(chRes.data || []);
      setEvents(evRes.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const isScale = plan === "scale" || plan === "enterprise";

  return (
    <AuthGate>{({ profile, org }) => (
    <AppShell profile={profile} org={org} activePage="sync">
      <div style={{ padding: "24px 32px", maxWidth: 960 }}>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 20, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Sync</h1>
        <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 24 }}>Bi-directional data synchronization between connectors</p>

        {!isScale ? (
          <div style={{ textAlign: "center", padding: "48px 24px", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Bi-directional sync requires Scale plan</p>
            <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 16, maxWidth: 400, margin: "0 auto 16px" }}>Sync channels let you push normalized data back to providers in their native format — with conflict resolution, checksums, and dry-run previews.</p>
            <a href="/pricing" style={{ display: "inline-block", padding: "8px 16px", fontSize: 12, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", textDecoration: "none" }}>Upgrade to Scale — $799/mo</a>
            <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginTop: 12 }}>Current plan: {plan.toUpperCase()}</p>
          </div>
        ) : loading ? (
          <p style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading sync channels...</p>
        ) : (
          <>
            {/* Channels */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Sync channels</p>
                <button type="button" style={{ padding: "6px 12px", fontSize: 11, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", border: "none", cursor: "pointer" }}>Create channel</button>
              </div>
              {channels.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", border: "0.5px solid var(--cm-border-light)" }}>
                  <p style={{ fontSize: 12, color: "var(--cm-text-dim)" }}>No sync channels configured</p>
                  <p style={{ fontSize: 11, color: "var(--cm-text-dim)", marginTop: 4 }}>Create a channel to sync data between two connectors</p>
                </div>
              ) : channels.map(ch => (
                <div key={ch.id} style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr 100px 80px", gap: 8, padding: "12px 16px", borderBottom: "0.5px solid var(--cm-border-light)", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)" }}>{ch.source_connector_id?.slice(0, 8)}...</span>
                  <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)", textAlign: "center" }}>{ch.direction === "bidirectional" ? "<->" : "->"}</span>
                  <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)" }}>{ch.dest_connector_id?.slice(0, 8)}...</span>
                  <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{ch.schedule || "manual"}</span>
                  <span style={{ fontFamily: F.m, fontSize: 10, color: ch.status === "active" ? "var(--cm-copper)" : "var(--cm-text-dim)", padding: "2px 6px", border: "0.5px solid var(--cm-border-light)", textAlign: "center" }}>{(ch.status || "IDLE").toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Recent events */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Recent sync events</p>
              {events.length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--cm-text-dim)", padding: "16px 0" }}>No sync events yet</p>
              ) : events.map(ev => (
                <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid var(--cm-border-light)" }}>
                  <div>
                    <span style={{ fontFamily: F.m, fontSize: 10, color: ev.status === "success" ? "var(--cm-copper)" : ev.status === "error" ? "#E24B4A" : "var(--cm-text-dim)", padding: "2px 6px", border: "0.5px solid var(--cm-border-light)", marginRight: 8 }}>{(ev.status || "PENDING").toUpperCase()}</span>
                    <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)" }}>{ev.records_synced || 0} records</span>
                  </div>
                  <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{new Date(ev.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
    )}}</AuthGate>
  );
}

export default function SyncPage() { return <Suspense><SyncContent /></Suspense>; }

