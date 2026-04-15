"use client";
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

function SettingsContent() {
  const [tab, setTab] = useState("general");
  const [org, setOrg] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!p) return;
      setProfile(p);
      const { data: o } = await supabase.from("organizations").select("*").eq("id", p.org_id).single();
      setOrg(o);
      const { data: keys } = await supabase.from("api_keys").select("id, name, prefix, created_at, last_used_at, status").eq("org_id", p.org_id).order("created_at", { ascending: false });
      setApiKeys(keys || []);
      setLoading(false);
    }
    load();
  }, []);

  const tabs = ["general", "team", "billing", "api"];

  return (
    <AppShell>
      <div style={{ padding: "24px 32px", maxWidth: 960 }}>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 20, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>Settings</h1>

        <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid var(--cm-border-light)", marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{
              padding: "8px 16px", fontSize: 12, fontFamily: F.b, border: "none", cursor: "pointer",
              borderBottom: tab === t ? "2px solid var(--cm-slate)" : "2px solid transparent",
              background: "transparent", color: tab === t ? "var(--cm-text-panel-h)" : "var(--cm-text-dim)",
              fontWeight: tab === t ? 500 : 400, textTransform: "capitalize",
            }}>{t === "api" ? "API keys" : t}</button>
          ))}
        </div>

        {loading ? <p style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading...</p> : (
          <>
            {tab === "general" && (
              <div style={{ maxWidth: 480 }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>Organization name</label>
                  <input type="text" defaultValue={org?.name || ""} style={{ width: "100%", padding: "8px 12px", fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)" }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>Your email</label>
                  <input type="text" defaultValue={profile?.email || ""} disabled style={{ width: "100%", padding: "8px 12px", fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", color: "var(--cm-text-dim)" }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>Display name</label>
                  <input type="text" defaultValue={profile?.display_name || ""} style={{ width: "100%", padding: "8px 12px", fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)" }} />
                </div>
                <button type="button" style={{ padding: "8px 16px", fontSize: 12, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", border: "none", cursor: "pointer" }}>Save changes</button>
              </div>
            )}

            {tab === "team" && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Team members</p>
                <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "0.5px solid var(--cm-border-light)" }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{profile?.display_name || profile?.email}</p>
                    <p style={{ fontSize: 11, color: "var(--cm-text-dim)" }}>{profile?.email}</p>
                  </div>
                  <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-copper)", padding: "2px 8px", border: "0.5px solid var(--cm-border-light)" }}>{(profile?.role || "owner").toUpperCase()}</span>
                </div>
                <button type="button" style={{ marginTop: 16, padding: "8px 16px", fontSize: 12, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", cursor: "pointer" }}>Invite team member</button>
              </div>
            )}

            {tab === "billing" && (
              <div>
                <div style={{ padding: 20, border: "0.5px solid var(--cm-border-light)", marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Current plan</p>
                  <p style={{ fontFamily: F.m, fontSize: 20, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{(org?.current_plan || "open").toUpperCase()}</p>
                  <p style={{ fontSize: 11, color: "var(--cm-text-dim)" }}>Stripe customer: {org?.stripe_customer_id || "Not connected"}</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href="/pricing" style={{ padding: "8px 16px", fontSize: 12, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", textDecoration: "none" }}>Change plan</a>
                  {org?.stripe_customer_id && (
                    <button type="button" style={{ padding: "8px 16px", fontSize: 12, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", cursor: "pointer" }}>Manage billing</button>
                  )}
                </div>
              </div>
            )}

            {tab === "api" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>API keys</p>
                  <button type="button" style={{ padding: "6px 12px", fontSize: 11, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", border: "none", cursor: "pointer" }}>Generate key</button>
                </div>
                {apiKeys.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", border: "0.5px solid var(--cm-border-light)" }}>
                    <p style={{ fontSize: 12, color: "var(--cm-text-dim)" }}>No API keys generated yet</p>
                    <p style={{ fontSize: 11, color: "var(--cm-text-dim)", marginTop: 4 }}>Generate a key to authenticate transform API requests</p>
                  </div>
                ) : apiKeys.map(k => (
                  <div key={k.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid var(--cm-border-light)" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{k.name}</p>
                      <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{k.prefix}...****</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: F.m, fontSize: 10, color: k.status === "active" ? "var(--cm-copper)" : "var(--cm-text-dim)" }}>{(k.status || "active").toUpperCase()}</p>
                      <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>Last used: {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "Never"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

export default function SettingsPage() { return <Suspense><SettingsContent /></Suspense>; }

