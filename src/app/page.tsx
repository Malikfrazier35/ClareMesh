"use client";

import { useEffect, useRef } from "react";

/* ── Cross-platform font stacks ── */
const F = {
  display: "'Instrument Sans', 'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
  body: "'DM Sans', 'SF Pro Text', 'Segoe UI', system-ui, sans-serif",
  mono: "'Geist Mono', 'SF Mono', 'Cascadia Code', 'Consolas', 'Courier New', monospace",
};

/* ── Brand tokens ── */
const C = {
  slate: "#4F6D7A",
  slateLt: "#E8EEF0",
  slate800: "#253D48",
  slate900: "#162A33",
  warmW: "#FAFAF8",
  w50: "#F5F4F0",
  w100: "#E8E6E0",
  w200: "#D4D1C9",
  w400: "#9C998F",
  w600: "#6B6860",
  w800: "#3D3B36",
  w900: "#1E1D1A",
  copper: "#9D7356",
  copperLt: "#F2ECE6",
  bdr: "0.5px solid #E8E6E0",
};

function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="14" height="14" fill={C.slate} opacity={0.15} />
      <rect x="12" y="12" width="14" height="14" fill={C.slate} opacity={0.3} />
      <rect x="22" y="22" width="14" height="14" fill={C.slate} opacity={0.5} />
      <circle cx="11" cy="11" r="2" fill={C.slate} />
      <circle cx="20" cy="20" r="2" fill={C.slate} />
      <circle cx="29" cy="29" r="2" fill={C.slate} />
      <line x1="11" y1="11" x2="20" y2="20" stroke={C.slate} strokeWidth="0.75" />
      <line x1="20" y1="20" x2="29" y2="29" stroke={C.slate} strokeWidth="0.75" />
    </svg>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const els = rootRef.current.querySelectorAll(".cm-reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const mono = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    fontFamily: F.mono, ...extra,
  });

  return (
    <div ref={rootRef} style={{ minHeight: "100vh", background: C.warmW, color: C.w900, fontFamily: F.body }}>

      {/* ═══ NAV ═══ */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 32px", borderBottom: C.bdr, position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,250,248,0.88)", backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Logo />
          <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 15, color: C.w900 }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 13 }}>
          {["Schema", "Docs", "Pricing", "Security"].map((l) => (
            <a key={l} href={`/${l.toLowerCase()}`} className="cm-nav-link" style={{ color: C.w600, textDecoration: "none" }}>{l}</a>
          ))}
          <a href="/login" className="cm-nav-link" style={{ color: C.slate, textDecoration: "none", fontWeight: 500 }}>Sign in</a>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", overflow: "hidden", padding: "108px 32px 96px" }}>
        {/* Animated topographic contours */}
        <svg
          className="cm-topo"
          style={{ position: "absolute", inset: 0, width: "110%", height: "100%", left: "-5%", pointerEvents: "none", opacity: 0.04 }}
          viewBox="0 0 1600 500" preserveAspectRatio="none"
        >
          {[...Array(13)].map((_, i) => (
            <path key={i}
              d={`M-100 ${250 + (i - 6) * 20}Q300 ${250 + (i - 6) * 20 - 30 + Math.sin(i) * 10} 700 ${250 + (i - 6) * 20}T1700 ${250 + (i - 6) * 20}`}
              fill="none" stroke="currentColor"
              strokeWidth={i === 6 ? 1.8 : Math.max(0.1, 1.2 - Math.abs(i - 6) * 0.2)}
            />
          ))}
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p className="cm-hero-label" style={mono({ fontSize: 10, letterSpacing: 3, color: C.slate, marginBottom: 20 })}>
            FINANCIAL DATA INFRASTRUCTURE
          </p>

          {/* Copper accent line */}
          <div className="cm-accent" style={{ height: 2, background: C.copper, margin: "0 auto 24px", width: 40 }} />

          <h1 className="cm-hero-title" style={{
            fontFamily: F.display, fontWeight: 700, fontSize: "clamp(42px, 5.5vw, 64px)",
            letterSpacing: -2, lineHeight: 1.02, marginBottom: 24, color: C.w900,
          }}>
            Clarity through<br />connection
          </h1>

          <p className="cm-hero-desc" style={{ fontSize: 17, lineHeight: 1.7, color: C.w600, maxWidth: 480, margin: "0 auto 40px" }}>
            An open-source financial data schema and bi-directional sync SDK that runs on your own infrastructure.
          </p>

          <div className="cm-hero-ctas" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <a href="/signup" className="cm-btn-primary" style={{
              padding: "14px 32px", fontSize: 14, fontWeight: 500, color: "#fff",
              background: C.slate, textDecoration: "none", display: "inline-block",
            }}>Get started free</a>
            <a href="/docs" className="cm-btn-ghost" style={{
              padding: "14px 32px", fontSize: 14, fontWeight: 500, color: C.w800,
              border: C.bdr, textDecoration: "none", background: "transparent", display: "inline-block",
            }}>View schema</a>
          </div>

          <p className="cm-hero-npm" style={mono({ fontSize: 11, color: C.w400, marginTop: 24 })}>
            <span style={{ color: C.slate }}>$</span> npm install @claremesh/schema<span className="cm-cursor" style={{ display: "inline-block", width: 7, height: 14, background: C.slate, marginLeft: 2, verticalAlign: "text-bottom" }} />
          </p>
        </div>
      </section>

      <div style={{ borderTop: C.bdr }} />

      {/* ═══ FEATURES ═══ */}
      <section className="cm-reveal cm-stagger" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {[
          { label: "[ SCHEMA ]", title: "Unified object model", desc: "Account, Transaction, Entity, Balance, Forecast. Published, versioned, MIT-licensed. TypeScript and Python types." },
          { label: "[ TRANSFORMS ]", title: "Normalize anything", desc: "Plaid, Stripe, QuickBooks, Xero, NetSuite, CSV. Raw API response in, clean schema out. One function call." },
          { label: "[ SYNC ]", title: "Bi-directional sync", desc: "Diff-based change detection, configurable conflict resolution, immutable append-only audit trail." },
          { label: "[ COMPLIANCE ]", title: "22 controls built in", desc: "SOC 2, GDPR, CCPA, PCI, SOX. Readiness dashboard. Automatic enforcement on deploy." },
          { label: "[ INFRA ]", title: "Runs on your stack", desc: "Deploy on Supabase, Vercel, or Cloudflare. Your data never touches our servers. Zero-access architecture." },
          { label: "[ METERED ]", title: "Usage-based pricing", desc: "Open tier free forever. Build at $199/mo. Scale at $799/mo. Overage billed, never throttled." },
        ].map((f, i) => (
          <div key={i} className="cm-cell" style={{
            padding: 32, borderRight: (i + 1) % 3 !== 0 ? C.bdr : "none",
            borderBottom: i < 3 ? C.bdr : "none",
          }}>
            <p style={mono({ fontSize: 11, color: C.slate, marginBottom: 12 })}>{f.label}</p>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, fontFamily: F.display }}>{f.title}</p>
            <p style={{ fontSize: 13, color: C.w600, lineHeight: 1.7 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      <div style={{ borderTop: C.bdr }} />

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="cm-reveal" style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={mono({ fontSize: 10, letterSpacing: 2.5, color: C.w400, textAlign: "center", marginBottom: 8 })}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: F.display, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 12 }}>
            Connect once. Normalize everything. Sync everywhere.
          </h2>
          <p style={{ fontSize: 14, color: C.w600, textAlign: "center", maxWidth: 460, margin: "0 auto 44px", lineHeight: 1.7 }}>
            Raw financial data from any source flows through three layers and emerges as a unified, validated, sync-ready object model.
          </p>

          {/* Sources */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {["Plaid", "Stripe", "QuickBooks", "Xero", "NetSuite", "CSV"].map((s) => (
              <span key={s} style={mono({ fontSize: 11, padding: "8px 16px", border: C.bdr, color: C.w600, background: C.warmW })}>
                {s}
              </span>
            ))}
          </div>

          <div style={{ textAlign: "center", color: C.w200, fontSize: 20, margin: "4px 0" }}>&#8595;</div>

          {/* Three layers */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "8px 0" }}>
            {[
              { name: "Transform", pkg: "@claremesh/transforms", desc: "Normalize raw API responses into unified types", color: "#0F6E56", bg: "#E1F5EE" },
              { name: "Schema", pkg: "@claremesh/schema", desc: "Account, Transaction, Entity, Balance, Forecast", color: "#534AB7", bg: "#EEEDFE" },
              { name: "Sync", pkg: "@claremesh/sync", desc: "Bi-directional, conflict resolution, audit trail", color: "#993C1D", bg: "#FAECE7" },
            ].map((l) => (
              <div key={l.name} className="cm-layer" style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 24px", background: l.bg, borderLeft: `3px solid ${l.color}`,
              }}>
                <div>
                  <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 15, color: l.color }}>{l.name}</span>
                  <span style={{ fontSize: 12, color: l.color, opacity: 0.55, marginLeft: 12 }}>{l.desc}</span>
                </div>
                <span style={mono({ fontSize: 10, color: l.color, opacity: 0.4 })}>{l.pkg}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", color: C.w200, fontSize: 20, margin: "4px 0" }}>&#8595;</div>

          {/* Outputs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {["Your treasury app", "Your FP&A platform", "Your close system"].map((s) => (
              <span key={s} style={mono({ fontSize: 11, padding: "8px 16px", border: C.bdr, color: C.w600 })}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ borderTop: C.bdr }} />

      {/* ═══ SUITE INTEGRATION ═══ */}
      <section className="cm-reveal">
        <div style={{ padding: "56px 32px 16px", textAlign: "center" }}>
          <p style={mono({ fontSize: 10, letterSpacing: 2.5, color: C.w400, textAlign: "center", marginBottom: 8 })}>SUITE INTEGRATION</p>
          <h2 style={{ fontFamily: F.display, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 12 }}>
            One pipe. Three products. Zero triple-integration.
          </h2>
          <p style={{ fontSize: 14, color: C.w600, maxWidth: 460, margin: "0 auto 8px", lineHeight: 1.7 }}>
            A customer connects QuickBooks once through ClareMesh. Every product reads from the same schema and writes back through the same sync layer.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: C.bdr }}>
          {[
            { name: "Vaultline", role: "Treasury", reads: "Cash, balances, projections", writes: "Alert rules, scenarios" },
            { name: "Castford", role: "FP&A", reads: "P&L, variance, budgets", writes: "Forecasts, board packages" },
            { name: "Ashford Ledger", role: "Month-end close", reads: "GL, transactions, entities", writes: "Reconciliation, journal entries" },
          ].map((p, i) => (
            <div key={i} className="cm-cell" style={{ padding: 32, borderRight: i < 2 ? C.bdr : "none" }}>
              <p style={{ fontFamily: F.display, fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{p.name}</p>
              <p style={mono({ fontSize: 10, color: C.slate, marginBottom: 16 })}>{p.role}</p>
              <p style={{ fontSize: 12, color: C.w600, marginBottom: 6 }}>
                <span style={mono({ fontSize: 10, color: C.w400, marginRight: 6 })}>READS</span>{p.reads}
              </p>
              <p style={{ fontSize: 12, color: C.w600 }}>
                <span style={mono({ fontSize: 10, color: C.w400, marginRight: 6 })}>WRITES</span>{p.writes}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ borderTop: C.bdr }} />

      {/* ═══ CODE PREVIEW ═══ */}
      <section className="cm-reveal" style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={mono({ fontSize: 10, letterSpacing: 2.5, color: C.w400, textAlign: "center", marginBottom: 8 })}>DEVELOPER EXPERIENCE</p>
          <h2 style={{ fontFamily: F.display, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 12 }}>
            Normalized data in four lines
          </h2>
          <p style={{ fontSize: 14, color: C.w600, textAlign: "center", maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Install the SDK, import the transform, pass your raw API data. Get back a validated, typed, sync-ready financial object.
          </p>

          <div style={{ border: C.bdr, overflow: "hidden" }}>
            {/* Tab bar */}
            <div style={{ display: "flex", borderBottom: C.bdr, background: C.w50 }}>
              <span className="cm-code-tab" style={mono({ fontSize: 10, color: C.w400, padding: "10px 16px", borderRight: C.bdr })}>terminal</span>
              <span className="cm-code-tab cm-code-tab-active" style={mono({ fontSize: 10, padding: "10px 16px" })}>transform.ts</span>
              <span className="cm-code-tab" style={mono({ fontSize: 10, color: C.w400, padding: "10px 16px" })}>output.json</span>
            </div>
            {/* Code block */}
            <div style={mono({ fontSize: 13, lineHeight: 2.0, padding: "24px 28px", overflowX: "auto" })}>
              <div><span style={{ color: "#185FA5" }}>import</span>{" { transformPlaidAccount } "}<span style={{ color: "#185FA5" }}>from</span> <span style={{ color: "#0F6E56" }}>&apos;@claremesh/transforms/plaid&apos;</span>;</div>
              <div><span style={{ color: "#185FA5" }}>import type</span>{" { Account } "}<span style={{ color: "#185FA5" }}>from</span> <span style={{ color: "#0F6E56" }}>&apos;@claremesh/schema&apos;</span>;</div>
              <br />
              <div style={{ color: C.w400 }}>{"//"} Raw Plaid response {"\u2192"} normalized ClareMesh Account</div>
              <div><span style={{ color: "#185FA5" }}>const</span> account: <span style={{ color: "#534AB7" }}>Account</span> = transformPlaidAccount(plaidData, {"{"}</div>
              <div style={{ paddingLeft: 24 }}>org_id: <span style={{ color: "#0F6E56" }}>&apos;org_d8afc85d&apos;</span>,</div>
              <div style={{ paddingLeft: 24 }}>entity_id: <span style={{ color: "#0F6E56" }}>&apos;ent_acme_01&apos;</span>,</div>
              <div>{"}"});</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <p style={mono({ fontSize: 11, color: C.w400 })}>12ms per transform. Schema v2.4.1 validated. Zero data egress.</p>
            <a href="/docs" style={{ fontSize: 12, color: C.slate, fontWeight: 500, textDecoration: "none" }}>Read the docs &#8594;</a>
          </div>
        </div>
      </section>

      <div style={{ borderTop: C.bdr }} />

      {/* ═══ PRICING ═══ */}
      <section className="cm-reveal">
        <div style={{ padding: "56px 32px 12px", textAlign: "center" }}>
          <p style={mono({ fontSize: 10, letterSpacing: 2.5, color: C.w400, textAlign: "center", marginBottom: 8 })}>PRICING</p>
          <h2 style={{ fontFamily: F.display, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 12 }}>
            Simple, usage-based pricing
          </h2>
          <p style={{ fontSize: 14, color: C.w600, marginBottom: 36 }}>Start free with the open schema. Pay only when you need transforms, sync, or compliance.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderTop: C.bdr, borderBottom: C.bdr }}>
          {[
            { tier: "OPEN", name: "Open", price: "$0", sub: "free forever", feats: ["Schema + types", "JSON validation", "MIT licensed"], cta: "npm install", primary: false, pop: false },
            { tier: "BUILD", name: "Build", price: "$199", sub: "/month + usage", feats: ["5 connectors", "50K transforms/mo", "4 compliance controls"], cta: "Start building", primary: false, pop: false },
            { tier: "SCALE", name: "Scale", price: "$799", sub: "/month + usage", feats: ["Unlimited connectors", "Bi-directional sync", "14 compliance controls"], cta: "Start scaling", primary: true, pop: true },
            { tier: "ENTERPRISE", name: "Enterprise", price: "Custom", sub: "annual contract", feats: ["Dedicated sync infra", "SOC 2 Type II", "All 22 controls"], cta: "Contact sales", primary: false, pop: false },
          ].map((t, i) => (
            <div key={i} className="cm-price-card" style={{
              padding: 32, display: "flex", flexDirection: "column",
              borderRight: i < 3 ? C.bdr : "none",
              ...(t.pop ? { borderLeft: `2px solid ${C.slate}`, borderRight: `2px solid ${C.slate}`, margin: "0 -1px", position: "relative", zIndex: 1 } : {}),
            }}>
              {t.pop && <span style={mono({ fontSize: 9, letterSpacing: 1.5, color: C.slate, marginBottom: 8 })}>MOST POPULAR</span>}
              <span style={mono({ fontSize: 9, letterSpacing: 1.5, color: C.w400, marginBottom: 8 })}>{t.tier}</span>
              <span style={{ fontSize: 15, fontWeight: 500, marginBottom: 4, fontFamily: F.display }}>{t.name}</span>
              <span style={mono({ fontSize: 36, fontWeight: 500, marginBottom: 2, lineHeight: 1 })}>{t.price}</span>
              <span style={mono({ fontSize: 11, color: C.w400, marginBottom: 24 })}>{t.sub}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {t.feats.map((f) => (
                  <p key={f} style={{ fontSize: 12, color: C.w600, paddingLeft: 12, borderLeft: `1.5px solid ${C.w200}` }}>{f}</p>
                ))}
              </div>
              <a href={t.tier === "ENTERPRISE" ? "/contact" : "/signup"}
                className={t.primary ? "cm-btn-primary" : "cm-btn-ghost"}
                style={{
                  display: "block", textAlign: "center", padding: 14, marginTop: 32,
                  fontSize: 13, fontWeight: 500, textDecoration: "none",
                  background: t.primary ? C.slate : "transparent",
                  color: t.primary ? "#fff" : C.w800,
                  border: t.primary ? "none" : C.bdr,
                }}>{t.cta}</a>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: 16 }}>
          <a href="/pricing" style={{ fontSize: 12, color: C.slate, fontWeight: 500, textDecoration: "none" }}>
            View full pricing with feature comparison &#8594;
          </a>
        </div>
      </section>

      <div style={{ borderTop: C.bdr }} />

      {/* ═══ ENTERPRISE CALLOUT ═══ */}
      <section className="cm-reveal" style={{ padding: "80px 32px", background: C.w50 }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <p style={mono({ fontSize: 10, letterSpacing: 2.5, color: C.w400, textAlign: "center", marginBottom: 8 })}>BUILT FOR REGULATED INDUSTRIES</p>
          <h2 style={{ fontFamily: F.display, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 16 }}>
            Your data never leaves your infrastructure
          </h2>
          <p style={{ fontSize: 15, color: C.w600, lineHeight: 1.7, marginBottom: 32 }}>
            22 compliance controls across SOC 2, GDPR, CCPA, PCI, and SOX. Automatic enforcement on deploy.
            ClareMesh runs on your Supabase, your Vercel, your Cloudflare. No data passes through our servers.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <a href="/security" className="cm-btn-primary" style={{
              padding: "14px 28px", fontSize: 13, fontWeight: 500, color: "#fff",
              background: C.slate, textDecoration: "none",
            }}>View security details</a>
            <a href="/docs/compliance" className="cm-btn-ghost" style={{
              padding: "14px 28px", fontSize: 13, fontWeight: 500, color: C.w800,
              border: C.bdr, textDecoration: "none", background: "transparent",
            }}>Compliance docs</a>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", borderTop: C.bdr }}>
        {[
          { fw: "SOC 2", status: "Type II in progress" },
          { fw: "GDPR", status: "Compliant" },
          { fw: "CCPA", status: "Compliant" },
          { fw: "PCI DSS", status: "Level 1" },
          { fw: "SOX", status: "Sec. 404" },
        ].map((f, i) => (
          <div key={i} className="cm-trust" style={{ padding: "22px 0", textAlign: "center", borderRight: i < 4 ? C.bdr : "none" }}>
            <div style={mono({ fontSize: 13, fontWeight: 500, marginBottom: 3 })}>{f.fw}</div>
            <div style={mono({ fontSize: 10, color: C.w400 })}>{f.status}</div>
          </div>
        ))}
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: C.bdr }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: C.bdr }}>
          {[
            { title: "PRODUCT", links: ["Schema", "Transforms", "Sync", "Pricing", "Changelog"] },
            { title: "DEVELOPERS", links: ["Documentation", "API reference", "Quickstart", "Status"] },
            { title: "COMPANY", links: ["About", "Blog", "Security", "Contact"] },
            { title: "LEGAL", links: ["Privacy", "Terms", "DPA", "Sub-processors"] },
          ].map((col, i) => (
            <div key={i} style={{ padding: 32, borderRight: i < 3 ? C.bdr : "none" }}>
              <p style={mono({ fontSize: 10, letterSpacing: 1.5, color: C.w400, marginBottom: 16 })}>{col.title}</p>
              {col.links.map((link) => (
                <a key={link} href="#" className="cm-footer-link" style={{
                  display: "block", fontSize: 13, color: C.w600, textDecoration: "none", marginBottom: 10,
                }}>{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Logo size={14} />
            <span style={mono({ fontSize: 10, color: C.w400 })}>CLAREMESH &copy; 2026 FINANCIAL HOLDING LLC</span>
          </div>
          <span style={mono({ fontSize: 10, color: C.w400 })}>Clarity through connection</span>
        </div>
      </footer>
    </div>
  );
}
