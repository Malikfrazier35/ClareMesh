"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

function Logo() {
  return (
    <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="14" height="14" fill="var(--cm-text-hero-h)" opacity={.1}/>
      <rect x="12" y="12" width="14" height="14" fill="var(--cm-text-hero-h)" opacity={.2}/>
      <rect x="22" y="22" width="14" height="14" fill="var(--cm-text-hero-h)" opacity={.35}/>
      <circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/>
      <line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/>
      <line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const authError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(authError === "auth_failed" ? "Authentication failed. Try again." : "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  const handleOAuth = async (provider: "google" | "github") => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Enter your email first."); return; }
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    });
    if (resetError) { setError(resetError.message); return; }
    setError("");
    alert("Password reset email sent. Check your inbox.");
  };

  const m = (x: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: F.m, ...x });
  const input: React.CSSProperties = { width: "100%", padding: "12px 14px", fontSize: 14, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", outline: "none" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", fontFamily: F.b }}>

      {/* Left — dark brand wall */}
      <div style={{ background: "var(--cm-hero)", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: "var(--cm-grid-op)", background: "repeating-linear-gradient(0deg,transparent,transparent 39px,var(--cm-slate) 39px,var(--cm-slate) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,var(--cm-slate) 39px,var(--cm-slate) 40px)", pointerEvents: "none" }} />
        <svg style={{ position: "absolute", inset: 0, width: "110%", left: "-5%", height: "100%", pointerEvents: "none", opacity: "var(--cm-topo-op)" }} viewBox="0 0 1600 800" preserveAspectRatio="none">
          {[120, 240, 360, 480, 600, 720].map((y, i) => (
            <path key={i} d={`M-100 ${y}Q400 ${y - 25} 800 ${y}T1700 ${y}`} fill="none" stroke="var(--cm-slate)" strokeWidth={i === 2 ? 1 : 0.5} />
          ))}
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 32 }}>
            <Logo /><span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 16, color: "var(--cm-text-hero-h)" }}>ClareMesh</span>
          </a>
          <p style={{ fontFamily: F.d, fontWeight: 700, fontSize: "clamp(28px,3.5vw,40px)", letterSpacing: -1.5, lineHeight: 1.05, color: "var(--cm-text-hero-h)", marginBottom: 10 }}>Welcome back</p>
          <p style={{ fontSize: 14, color: "var(--cm-text-hero-b)", lineHeight: 1.7 }}>Your data is where you left it.</p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ background: "var(--cm-panel)", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 440, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, marginBottom: 24, color: "var(--cm-text-panel-h)" }}>Sign in</h1>

        {error && (
          <div style={{ padding: "10px 14px", marginBottom: 16, background: "var(--cm-panel-inset)", border: "0.5px solid var(--cm-border-light)", fontSize: 13, color: "#A32D2D" }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--cm-text-panel-b)", display: "block", marginBottom: 5 }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={input} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: "var(--cm-text-panel-b)", display: "block", marginBottom: 5 }}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" style={input} />
          </div>

          <button type="submit" disabled={loading} className="cm-bp" style={{ width: "100%", padding: 14, fontSize: 14, fontWeight: 500, fontFamily: F.b, color: "var(--cm-cta-panel-c)", background: "var(--cm-cta-panel-bg)", border: "var(--cm-cta-panel-bd)", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
          <div style={{ flex: 1, height: "0.5px", background: "var(--cm-border-light)" }} />
          <span style={{ fontSize: 12, color: "var(--cm-text-dim)" }}>or</span>
          <div style={{ flex: 1, height: "0.5px", background: "var(--cm-border-light)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <button type="button" onClick={() => handleOAuth("google")} className="cm-bg" style={{ padding: 12, fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", cursor: "pointer" }}>Google</button>
          <button type="button" onClick={() => handleOAuth("github")} className="cm-bg" style={{ padding: 12, fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", cursor: "pointer" }}>GitHub</button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <button type="button" onClick={handleForgotPassword} style={{ color: "var(--cm-slate)", background: "none", border: "none", cursor: "pointer", fontFamily: F.b, fontSize: 12 }}>Forgot password?</button>
          <span style={{ color: "var(--cm-text-dim)" }}>No account? <a href="/signup" style={{ color: "var(--cm-slate)", fontWeight: 500, textDecoration: "none" }}>Sign up</a></span>
        </div>
      </div>
    </div>
  );
}
