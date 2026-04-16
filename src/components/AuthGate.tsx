"use client";
import { useState, useEffect, ReactNode } from "react";
import { getAuthState, UserProfile, Organization } from "@/lib/auth";

type AuthGateProps = {
  children: (props: { profile: UserProfile; org: Organization }) => ReactNode;
  requireAdmin?: boolean;
};

export default function AuthGate({ children, requireAdmin }: AuthGateProps) {
  const [state, setState] = useState<{
    loading: boolean;
    profile: UserProfile | null;
    org: Organization | null;
    suspended: boolean;
  }>({ loading: true, profile: null, org: null, suspended: false });

  useEffect(() => {
    async function check() {
      const result = await getAuthState();
      if (result.redirect) {
        window.location.href = result.redirect;
        return;
      }
      if (requireAdmin && result.profile && !["owner", "admin"].includes(result.profile.role)) {
        window.location.href = "/dashboard";
        return;
      }
      setState({
        loading: false,
        profile: result.profile,
        org: result.org,
        suspended: result.suspended || false,
      });
    }
    check();
  }, [requireAdmin]);

  if (state.loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 24, height: 24, border: "2px solid var(--cm-border-light)", borderTopColor: "var(--cm-slate)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 13, color: "var(--cm-text-dim)" }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (state.suspended) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',system-ui,sans-serif", padding: 32 }}>
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, letterSpacing: 2, color: "#E24B4A", marginBottom: 16 }}>ACCOUNT SUSPENDED</div>
          <h1 style={{ fontFamily: "'Instrument Sans',system-ui,sans-serif", fontWeight: 700, fontSize: 24, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Your account has been suspended</h1>
          <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", lineHeight: 1.6, marginBottom: 24 }}>
            This is usually due to a failed payment. Please update your billing information to restore access.
          </p>
          <a href="/settings?tab=billing" style={{ display: "inline-block", padding: "10px 24px", fontSize: 14, fontWeight: 600, color: "#fff", background: "var(--cm-slate)", textDecoration: "none" }}>
            Update billing
          </a>
        </div>
      </div>
    );
  }

  if (!state.profile || !state.org) return null;

  return <>{children({ profile: state.profile, org: state.org })}</>;
}

