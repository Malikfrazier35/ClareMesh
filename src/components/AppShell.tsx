"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { href: "/connectors", label: "Connectors", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  { href: "/transforms", label: "Transforms", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { href: "/sync", label: "Sync", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
  { href: "/compliance", label: "Compliance", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { href: "/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      {/* Sidebar */}
      <div style={{ width: 200, borderRight: "0.5px solid var(--cm-border-light)", padding: "16px 0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", padding: "0 16px", marginBottom: 24 }}>
          <svg width="14" height="14" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 13, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>

        {/* Nav items */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <a key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", fontSize: 12, textDecoration: "none",
                color: active ? "var(--cm-text-panel-h)" : "var(--cm-text-panel-b)",
                fontWeight: active ? 500 : 400,
                background: active ? "var(--cm-terminal)" : "transparent",
                borderRight: active ? "2px solid var(--cm-slate)" : "2px solid transparent",
              }}>
                <NavIcon d={item.icon} />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ padding: "0 16px", borderTop: "0.5px solid var(--cm-border-light)", paddingTop: 12 }}>
          <a href="/docs" style={{ fontSize: 11, color: "var(--cm-text-dim)", textDecoration: "none", display: "block", marginBottom: 4 }}>Documentation</a>
          <a href="/" style={{ fontSize: 11, color: "var(--cm-text-dim)", textDecoration: "none", display: "block" }}>Back to site</a>
          <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", marginTop: 12 }}>v1.0.0</p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

