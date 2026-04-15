"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

function Nav({ active }: { active: string }) {
  const links = ["Dashboard", "Connectors", "Transforms", "Sync", "Compliance", "Settings"];
  return (
    <div style={{ padding: "12px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <nav style={{ display: "flex", gap: 16 }}>
          {links.map((item) => (
            <a key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: 12, fontFamily: F.b, color: item === active ? "var(--cm-text-panel-h)" : "var(--cm-text-panel-b)", textDecoration: "none", fontWeight: item === active ? 500 : 400 }}>{item}</a>
          ))}
        </nav>
      </div>
    </div>
  );
}

function SyncContent() {
  const router = useRouter();
  const [org, setOrg] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
      if (profile) {
        const { data: o } = await supabase.from("organizations").select("*").eq("id", profile.org_id).single();
        setOrg(o);
        const { data: c } = await supabase.from("sync_channels").select("*").eq("org_id", profile.org_id).order("created_at", { ascending: false });
        setChannels(c || []);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cm-panel)", fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading...</div>
  );

  const isScale = org?.plan === "scale" || org?.plan === "enterprise";

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <Nav active="Sync" />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Sync channels</h1>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>Bi-directional data sync between connectors. {isScale ? `${channels.length} active channels` : "Requires Scale plan."}</p>
        </div>

        {!isScale ? (
          <div style={{ padding: 40, textAlign: "center", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Bi-directional sync requires Scale</p>
            <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 4, lineHeight: 1.7, maxWidth: 400, margin: "0 auto 16px" }}>Sync channels keep your financial data consistent across sources in real-time. Conflict detection, auto-resolution, and full audit trail included.</p>
            <a href="/pricing" style={{ display: "inline-block", padding: "10px 20px", fontSize: 13, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", textDecoration: "none" }}>Upgrade to Scale — $799/mo</a>
          </div>
        ) : channels.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>No sync channels yet</p>
            <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 16, lineHeight: 1.7 }}>Create a channel between two connectors to start syncing data bi-directionally.</p>
            <button type="button" style={{ padding: "10px 20px", fontSize: 13, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", border: "none", cursor: "pointer" }}>Create sync channel</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {channels.map((ch) => (
              <div key={ch.id} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{ch.name || `Channel ${ch.id.slice(0, 8)}`}</p>
                  <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>
                    {ch.source_connector_id?.slice(0, 8)} → {ch.dest_connector_id?.slice(0, 8)} / every {ch.sync_interval_minutes || 15}min
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, background: ch.status === "active" || ch.status === "idle" ? "var(--cm-green)" : ch.status === "syncing" ? "var(--cm-copper)" : "var(--cm-text-dim)" }} />
                  <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-mono)" }}>{(ch.status || "idle").toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sync documentation */}
        {isScale && (
          <div style={{ marginTop: 32, padding: 16, background: "var(--cm-terminal)", border: "0.5px solid var(--cm-terminal-bd)" }}>
            <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)", marginBottom: 8 }}>SYNC ENGINE</p>
            <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-hero-b)", lineHeight: 2 }}>
              Sync interval: every 15 minutes (configurable)<br />
              Conflict resolution: source_wins | dest_wins | latest_wins | field_merge | manual<br />
              Echo suppression: cm_sync_origin metadata prevents infinite loops<br />
              Retry: 3 attempts with exponential backoff on source/dest failures
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SyncPage() {
  return <Suspense><SyncContent /></Suspense>;
}

