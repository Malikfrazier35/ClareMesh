"use client";
import { ReactNode } from "react";
import { UserProfile, Organization, canUseSync } from "@/lib/auth";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

type AppShellProps = {
  children: ReactNode;
  profile?: UserProfile;
  org?: Organization;
  activePage?: string;
};

const navItems = [
  { key: "dashboard", label: "Overview", href: "/dashboard", icon: "grid", roles: ["owner", "admin", "member", "viewer"] },
  { key: "connectors", label: "Connectors", href: "/connectors", icon: "plug", roles: ["owner", "admin", "member", "viewer"] },
  { key: "transforms", label: "Transforms", href: "/transforms", icon: "shuffle", roles: ["owner", "admin", "member", "viewer"] },
  { key: "sync", label: "Sync", href: "/sync", icon: "refresh", roles: ["owner", "admin", "member"], planGate: "scale" },
  { key: "compliance", label: "Compliance", href: "/compliance", icon: "shield", roles: ["owner", "admin", "member"] },
  { key: "settings", label: "Settings", href: "/settings", icon: "gear", roles: ["owner", "admin", "member", "viewer"] },
];

function NavIcon({ icon, size = 16 }: { icon: string; size?: number }) {
  const s = { width: size, height: size, stroke: "currentColor", strokeWidth: 1.5, fill: "none" };
  switch (icon) {
    case "grid": return <svg viewBox="0 0 24 24" style={s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "plug": return <svg viewBox="0 0 24 24" style={s}><path d="M12 2v6m-4-2v4m8-4v4M8 10h8v3a4 4 0 01-8 0v-3zM12 17v5"/></svg>;
    case "shuffle": return <svg viewBox="0 0 24 24" style={s}><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.6-8.6c.8-1.1 2-1.7 3.3-1.7H20m0 0l-3-3m3 3l-3 3M2 6h1.4c1.3 0 2.5.6 3.3 1.7l6.6 8.6c.8 1.1 2 1.7 3.3 1.7H20m0 0l-3-3m3 3l-3 3"/></svg>;
    case "refresh": return <svg viewBox="0 0 24 24" style={s}><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>;
    case "shield": return <svg viewBox="0 0 24 24" style={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "gear": return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
    default: return null;
  }
}

export default function AppShell({ children, profile, org, activePage }: AppShellProps) {
  // Backward compatibility: if no auth props, render basic shell
  if (!profile || !org) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: F.b }}>
        <div style={{ width: 220, borderRight: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", padding: "16px" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 24 }}>
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
            <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
          </a>
          {[{l:"Overview",h:"/dashboard"},{l:"Connectors",h:"/connectors"},{l:"Transforms",h:"/transforms"},{l:"Sync",h:"/sync"},{l:"Compliance",h:"/compliance"},{l:"Settings",h:"/settings"}].map(n=>(
            <a key={n.l} href={n.h} style={{display:"block",padding:"8px 12px",fontSize:13,color:"var(--cm-text-panel-b)",textDecoration:"none",marginBottom:2}}>{n.l}</a>
          ))}
        </div>
        <div style={{ flex: 1, background: "var(--cm-panel)", overflow: "auto" }}>{children}</div>
      </div>
    );
  }
  const planLabels: Record<string, string> = { open: "Open", build: "Build", scale: "Scale", enterprise: "Enterprise" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: F.b }}>
      {/* Sidebar */}
      <div style={{ width: 220, borderRight: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", display: "flex", flexDirection: "column" }}>
        {/* Logo + org */}
        <div style={{ padding: "16px 16px 12px" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 12 }}>
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
            <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
          </a>
          <div style={{ padding: "8px 10px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{org.name}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontFamily: F.m, fontSize: 9, padding: "1px 6px", background: "var(--cm-slate)", color: "#fff", letterSpacing: 0.5 }}>{planLabels[org.plan] || org.plan}</span>
              <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>{profile.role}</span>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: "8px 8px", flex: 1 }}>
          {navItems.map((item) => {
            // RBAC gate
            if (!item.roles.includes(profile.role)) return null;

            const isActive = activePage === item.key;
            const isLocked = item.planGate && !canUseSync(org.plan);

            return (
              <a
                key={item.key}
                href={isLocked ? undefined : item.href}
                onClick={isLocked ? (e) => { e.preventDefault(); alert(`Sync requires the Scale plan or above. You're on the ${planLabels[org.plan]} plan.`); } : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 2,
                  fontSize: 13, color: isActive ? "var(--cm-text-panel-h)" : isLocked ? "var(--cm-text-dim)" : "var(--cm-text-panel-b)",
                  background: isActive ? "var(--cm-terminal)" : "transparent",
                  textDecoration: "none", fontWeight: isActive ? 500 : 400,
                  opacity: isLocked ? 0.5 : 1, cursor: isLocked ? "not-allowed" : "pointer",
                }}
              >
                <NavIcon icon={item.icon} />
                <span>{item.label}</span>
                {isLocked && (
                  <span style={{ marginLeft: "auto", fontFamily: F.m, fontSize: 8, padding: "1px 4px", border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-dim)", letterSpacing: 0.5 }}>SCALE</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "12px 16px", borderTop: "0.5px solid var(--cm-border-light)" }}>
          <div style={{ fontSize: 12, color: "var(--cm-text-panel-h)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {profile.display_name || profile.email}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{profile.email}</span>
            <button
              onClick={async () => {
                const { createClient } = await import("@supabase/supabase-js");
                const sb = createClient("https://ddevkorgiutduydelhgv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZXZrb3JnaXV0ZHV5ZGVsaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODI0NDIsImV4cCI6MjA5MTc1ODQ0Mn0.J42xtXgMJ0J4DdTwg3eCHKafOHTe0Tb6WRlTwZ9B-eE");
                await sb.auth.signOut();
                window.location.href = "/login";
              }}
              style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", background: "none", border: "none", cursor: "pointer", padding: "2px 4px", textDecoration: "underline", textUnderlineOffset: "2px" }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, background: "var(--cm-panel)", overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}

