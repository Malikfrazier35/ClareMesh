"use client";
import { useEffect, useRef } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};
const C = {
  s: "#4F6D7A", s2: "#3A5361", bg: "#E2E0D8", w: "#FAFAF8", w5: "#F5F4F0",
  w1: "#E8E6E0", w2: "#D4D1C9", w4: "#9C998F", w6: "#6B6860", w8: "#3D3B36",
  w9: "#1E1D1A", cp: "#9D7356", bd: "0.5px solid #E8E6E0",
};
const m = (x: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: F.m, ...x });

function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="14" height="14" fill={C.s} opacity={0.15} />
      <rect x="12" y="12" width="14" height="14" fill={C.s} opacity={0.3} />
      <rect x="22" y="22" width="14" height="14" fill={C.s} opacity={0.5} />
      <circle cx="11" cy="11" r="2" fill={C.s} /><circle cx="20" cy="20" r="2" fill={C.s} /><circle cx="29" cy="29" r="2" fill={C.s} />
      <line x1="11" y1="11" x2="20" y2="20" stroke={C.s} strokeWidth="0.75" />
      <line x1="20" y1="20" x2="29" y2="29" stroke={C.s} strokeWidth="0.75" />
    </svg>
  );
}

export default function Home() {
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!r.current) return;
    const els = r.current.querySelectorAll(".cm-rv");
    const o = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("vis"); o.unobserve(e.target); }
    }), { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => o.observe(el));
    return () => o.disconnect();
  }, []);

  const panel: React.CSSProperties = { background: C.w, position: "relative", zIndex: 2 };
  const gap = <div style={{ height: 48 }} />;

  return (
    <>
      {/* ═══ FIXED BACKGROUND WALL ═══ */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: C.bg, overflow: "hidden" }}>
        <svg className="cm-topo cm-pulse" style={{ position: "absolute", inset: 0, width: "120%", height: "100%", left: "-10%", pointerEvents: "none" }} viewBox="0 0 1800 1200" preserveAspectRatio="none">
          {[100,180,260,340,420,500,580,680,760,840,940,1020,1100].map((y, i) => (
            <path key={i} d={`M-100 ${y}Q450 ${y - 30} 900 ${y}T1900 ${y}`} fill="none" stroke={i === 3 || i === 8 ? C.s : C.w4}
              strokeWidth={i === 3 || i === 8 ? (i === 3 ? 1 : 0.6) : [0.3, 0.5, 0.8, 0, 0.8, 0.5, 0.3, 0.3, 0, 0.3, 0.4, 0.25, 0.2][i]}
              opacity={i === 3 ? 0.12 : i === 8 ? 0.08 : [0.5, 0.4, 0.35, 0, 0.35, 0.4, 0.5, 0.45, 0, 0.4, 0.35, 0.3, 0.25][i]} />
          ))}
        </svg>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}>
          <defs>
            <pattern id="gd" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="24" cy="24" r="0.6" fill={C.w6} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gd)" />
        </svg>
      </div>

      {/* ═══ SCROLLING CONTENT ═══ */}
      <div ref={r} style={{ position: "relative", zIndex: 1, fontFamily: F.b }}>

        {/* NAV (glass over wall) */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: "0.5px solid rgba(0,0,0,.06)", position: "sticky", top: 0, zIndex: 50, background: "rgba(226,224,216,.75)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Logo /><span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: C.w9 }}>ClareMesh</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 13 }}>
            {["Schema","Docs","Pricing","Security"].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} className="cm-nl" style={{ color: C.w6, textDecoration: "none" }}>{l}</a>
            ))}
            <a href="/login" className="cm-nl" style={{ color: C.s2, textDecoration: "none", fontWeight: 600 }}>Sign in</a>
          </div>
        </nav>

        {/* HERO (transparent — wall shows through) */}
        <section style={{ padding: "108px 32px 80px", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <p className="cm-a1" style={m({ fontSize: 10, letterSpacing: 3, color: C.s, marginBottom: 16 })}>FINANCIAL DATA INFRASTRUCTURE</p>
            <div className="cm-acc" style={{ height: 2, background: C.cp, margin: "0 auto 24px", width: 40 }} />
            <h1 className="cm-a2" style={{ fontFamily: F.d, fontWeight: 700, fontSize: "clamp(44px,5.5vw,64px)", letterSpacing: -2, lineHeight: 1.02, marginBottom: 20, color: C.w9 }}>
              Clarity through<br />connection
            </h1>
            <p className="cm-a3" style={{ fontSize: 16, lineHeight: 1.7, color: C.w6, maxWidth: 440, margin: "0 auto 36px" }}>
              An open-source financial data schema and bi-directional sync SDK that runs on your own infrastructure.
            </p>
            <div className="cm-a4" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a href="/signup" className="cm-bp" style={{ padding: "14px 32px", fontSize: 14, fontWeight: 500, color: "#fff", background: C.s2, textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,.1)" }}>Get started free</a>
              <a href="/docs" className="cm-bg" style={{ padding: "14px 32px", fontSize: 14, fontWeight: 500, color: C.w8, border: `0.5px solid ${C.w2}`, textDecoration: "none", background: "rgba(250,250,248,.7)" }}>View schema</a>
            </div>
            <p className="cm-a5" style={m({ fontSize: 11, color: C.w4, marginTop: 24 })}>
              <span style={{ color: C.s }}>$</span> npm install @claremesh/schema
              <span className="cm-blink" style={{ display: "inline-block", width: 7, height: 14, background: C.s, marginLeft: 2, verticalAlign: "text-bottom" }} />
            </p>
          </div>
        </section>

        {/* ═══ FEATURES PANEL ═══ */}
        <div style={panel}>
          <div style={{ borderTop: C.bd }} />
          <section className="cm-rv cm-sg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              { l: "[ SCHEMA ]", t: "Unified object model", d: "Account, Transaction, Entity, Balance, Forecast. Published, versioned, MIT-licensed. TypeScript and Python types." },
              { l: "[ TRANSFORMS ]", t: "Normalize anything", d: "Plaid, Stripe, QuickBooks, Xero, NetSuite, CSV. Raw API response in, clean schema out. One function call." },
              { l: "[ SYNC ]", t: "Bi-directional sync", d: "Diff-based change detection, configurable conflict resolution, immutable append-only audit trail." },
              { l: "[ COMPLIANCE ]", t: "22 controls built in", d: "SOC 2, GDPR, CCPA, PCI, SOX. Readiness dashboard. Automatic enforcement on deploy." },
              { l: "[ INFRA ]", t: "Runs on your stack", d: "Deploy on Supabase, Vercel, or Cloudflare. Your data never touches our servers. Zero-access architecture." },
              { l: "[ METERED ]", t: "Usage-based pricing", d: "Open tier free forever. Build at $199/mo. Scale at $799/mo. Overage billed, never throttled." },
            ].map((f, i) => (
              <div key={i} className="cm-cell" style={{ padding: 32, borderRight: (i+1)%3!==0?C.bd:"none", borderBottom: i<3?C.bd:"none" }}>
                <p style={m({ fontSize: 11, color: C.s, marginBottom: 12 })}>{f.l}</p>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, fontFamily: F.d }}>{f.t}</p>
                <p style={{ fontSize: 13, color: C.w6, lineHeight: 1.7 }}>{f.d}</p>
              </div>
            ))}
          </section>
        </div>

        {gap}

        {/* ═══ ARCHITECTURE PANEL ═══ */}
        <div style={panel}>
          <section className="cm-rv" style={{ borderTop: C.bd, borderBottom: C.bd, padding: "64px 32px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <p style={m({ fontSize: 10, letterSpacing: 2.5, color: C.w4, textAlign: "center", marginBottom: 8 })}>HOW IT WORKS</p>
              <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 12 }}>Connect once. Normalize everything. Sync everywhere.</h2>
              <p style={{ fontSize: 14, color: C.w6, textAlign: "center", maxWidth: 460, margin: "0 auto 44px", lineHeight: 1.7 }}>Raw financial data from any source flows through three layers and emerges as a unified, validated, sync-ready object model.</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
                {["Plaid","Stripe","QuickBooks","Xero","NetSuite","CSV"].map(s => (
                  <span key={s} style={m({ fontSize: 11, padding: "8px 16px", border: C.bd, color: C.w6, background: C.w5 })}>{s}</span>
                ))}
              </div>
              <div style={{ textAlign: "center", color: C.w2, fontSize: 20, margin: "4px 0" }}>&#8595;</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "8px 0" }}>
                {[
                  { n: "Transform", p: "@claremesh/transforms", d: "Normalize raw API responses into unified types", c: "#0F6E56", bg: "#E1F5EE" },
                  { n: "Schema", p: "@claremesh/schema", d: "Account, Transaction, Entity, Balance, Forecast", c: "#534AB7", bg: "#EEEDFE" },
                  { n: "Sync", p: "@claremesh/sync", d: "Bi-directional, conflict resolution, audit trail", c: "#993C1D", bg: "#FAECE7" },
                ].map(l => (
                  <div key={l.n} className="cm-layer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: l.bg, borderLeft: `3px solid ${l.c}` }}>
                    <div><span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: l.c }}>{l.n}</span><span style={{ fontSize: 12, color: l.c, opacity: 0.55, marginLeft: 12 }}>{l.d}</span></div>
                    <span style={m({ fontSize: 10, color: l.c, opacity: 0.4 })}>{l.p}</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", color: C.w2, fontSize: 20, margin: "4px 0" }}>&#8595;</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {["Your treasury app","Your FP&A platform","Your close system"].map(s => (
                  <span key={s} style={m({ fontSize: 11, padding: "8px 16px", border: C.bd, color: C.w6, background: C.w5 })}>{s}</span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {gap}

        {/* ═══ SUITE PANEL ═══ */}
        <div style={panel}>
          <section className="cm-rv">
            <div style={{ padding: "56px 32px 16px", textAlign: "center", borderTop: C.bd }}>
              <p style={m({ fontSize: 10, letterSpacing: 2.5, color: C.w4, textAlign: "center", marginBottom: 8 })}>SUITE INTEGRATION</p>
              <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 12 }}>One pipe. Three products. Zero triple-integration.</h2>
              <p style={{ fontSize: 14, color: C.w6, maxWidth: 460, margin: "0 auto 8px", lineHeight: 1.7 }}>A customer connects QuickBooks once through ClareMesh. Every product reads from the same schema.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: C.bd, borderBottom: C.bd }}>
              {[
                { n: "Vaultline", ro: "Treasury", rd: "Cash, balances, projections", wr: "Alert rules, scenarios" },
                { n: "Castford", ro: "FP&A", rd: "P&L, variance, budgets", wr: "Forecasts, board packages" },
                { n: "Ashford Ledger", ro: "Month-end close", rd: "GL, transactions, entities", wr: "Reconciliation, journal entries" },
              ].map((p, i) => (
                <div key={i} className="cm-cell" style={{ padding: 32, borderRight: i<2?C.bd:"none" }}>
                  <p style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{p.n}</p>
                  <p style={m({ fontSize: 10, color: C.s, marginBottom: 16 })}>{p.ro}</p>
                  <p style={{ fontSize: 12, color: C.w6, marginBottom: 6 }}><span style={m({ fontSize: 10, color: C.w4, marginRight: 6 })}>READS</span>{p.rd}</p>
                  <p style={{ fontSize: 12, color: C.w6 }}><span style={m({ fontSize: 10, color: C.w4, marginRight: 6 })}>WRITES</span>{p.wr}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {gap}

        {/* ═══ CODE PANEL ═══ */}
        <div style={panel}>
          <section className="cm-rv" style={{ borderTop: C.bd, borderBottom: C.bd, padding: "64px 32px" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <p style={m({ fontSize: 10, letterSpacing: 2.5, color: C.w4, textAlign: "center", marginBottom: 8 })}>DEVELOPER EXPERIENCE</p>
              <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 12 }}>Normalized data in four lines</h2>
              <p style={{ fontSize: 14, color: C.w6, textAlign: "center", maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.7 }}>Install the SDK, import the transform, pass your raw API data. Get back a validated, typed, sync-ready financial object.</p>
              <div style={{ border: C.bd, overflow: "hidden" }}>
                <div style={{ display: "flex", borderBottom: C.bd, background: C.w5 }}>
                  <span style={m({ fontSize: 10, color: C.w4, padding: "10px 16px", borderRight: C.bd })}>terminal</span>
                  <span style={m({ fontSize: 10, color: C.w8, padding: "10px 16px", borderBottom: `1.5px solid ${C.s}`, marginBottom: -1 })}>transform.ts</span>
                  <span style={m({ fontSize: 10, color: C.w4, padding: "10px 16px" })}>output.json</span>
                </div>
                <div style={m({ fontSize: 13, lineHeight: 2.0, padding: "24px 28px", overflowX: "auto" })}>
                  <div><span style={{ color: "#185FA5" }}>import</span>{" { transformPlaidAccount } "}<span style={{ color: "#185FA5" }}>from</span> <span style={{ color: "#0F6E56" }}>&apos;@claremesh/transforms/plaid&apos;</span>;</div>
                  <div><span style={{ color: "#185FA5" }}>import type</span>{" { Account } "}<span style={{ color: "#185FA5" }}>from</span> <span style={{ color: "#0F6E56" }}>&apos;@claremesh/schema&apos;</span>;</div>
                  <br />
                  <div style={{ color: C.w4 }}>{"//"} Raw Plaid response {"\u2192"} normalized ClareMesh Account</div>
                  <div><span style={{ color: "#185FA5" }}>const</span> account: <span style={{ color: "#534AB7" }}>Account</span> = transformPlaidAccount(plaidData, {"{"}</div>
                  <div style={{ paddingLeft: 24 }}>org_id: <span style={{ color: "#0F6E56" }}>&apos;org_d8afc85d&apos;</span>,</div>
                  <div style={{ paddingLeft: 24 }}>entity_id: <span style={{ color: "#0F6E56" }}>&apos;ent_acme_01&apos;</span>,</div>
                  <div>{"}"});</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                <p style={m({ fontSize: 11, color: C.w4 })}>12ms per transform. Schema v2.4.1 validated. Zero data egress.</p>
                <a href="/docs" style={{ fontSize: 12, color: C.s, fontWeight: 500, textDecoration: "none" }}>Read the docs &#8594;</a>
              </div>
            </div>
          </section>
        </div>

        {gap}

        {/* ═══ PRICING PANEL ═══ */}
        <div style={panel}>
          <section className="cm-rv">
            <div style={{ padding: "56px 32px 12px", textAlign: "center", borderTop: C.bd }}>
              <p style={m({ fontSize: 10, letterSpacing: 2.5, color: C.w4, textAlign: "center", marginBottom: 8 })}>PRICING</p>
              <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 12 }}>Simple, usage-based pricing</h2>
              <p style={{ fontSize: 14, color: C.w6, marginBottom: 36 }}>Start free with the open schema. Pay only when you need transforms, sync, or compliance.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderTop: C.bd, borderBottom: C.bd }}>
              {[
                { t: "OPEN", n: "Open", p: "$0", su: "free forever", fs: ["Schema + types","JSON validation","MIT licensed"], ct: "npm install", pr: false, po: false },
                { t: "BUILD", n: "Build", p: "$199", su: "/month + usage", fs: ["5 connectors","50K transforms/mo","4 compliance controls"], ct: "Start building", pr: false, po: false },
                { t: "SCALE", n: "Scale", p: "$799", su: "/month + usage", fs: ["Unlimited connectors","Bi-directional sync","14 compliance controls"], ct: "Start scaling", pr: true, po: true },
                { t: "ENTERPRISE", n: "Enterprise", p: "Custom", su: "annual contract", fs: ["Dedicated sync infra","SOC 2 Type II","All 22 controls"], ct: "Contact sales", pr: false, po: false },
              ].map((t, i) => (
                <div key={i} className="cm-pc" style={{ padding: 32, display: "flex", flexDirection: "column", borderRight: i<3?C.bd:"none", ...(t.po?{ borderLeft: `2px solid ${C.s2}`, borderRight: `2px solid ${C.s2}`, margin: "0 -1px", position: "relative" as const, zIndex: 1 }:{}) }}>
                  {t.po && <span style={m({ fontSize: 9, letterSpacing: 1.5, color: C.s, marginBottom: 8 })}>MOST POPULAR</span>}
                  <span style={m({ fontSize: 9, letterSpacing: 1.5, color: C.w4, marginBottom: 8 })}>{t.t}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, fontFamily: F.d }}>{t.n}</span>
                  <span style={m({ fontSize: 36, fontWeight: 500, marginBottom: 2, lineHeight: 1 })}>{t.p}</span>
                  <span style={m({ fontSize: 11, color: C.w4, marginBottom: 24 })}>{t.su}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    {t.fs.map(f => (<p key={f} style={{ fontSize: 12, color: C.w6, paddingLeft: 12, borderLeft: `1.5px solid ${C.w2}` }}>{f}</p>))}
                  </div>
                  <a href={t.t==="ENTERPRISE"?"/contact":"/signup"} className={t.pr?"cm-bp":"cm-bg"}
                    style={{ display: "block", textAlign: "center", padding: 14, marginTop: 32, fontSize: 13, fontWeight: 500, textDecoration: "none",
                      background: t.pr?C.s2:"transparent", color: t.pr?"#fff":C.w8, border: t.pr?"none":C.bd,
                      ...(t.pr?{ boxShadow: "0 1px 3px rgba(0,0,0,.1)" }:{ background: C.w5 }) }}>{t.ct}</a>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", padding: 16, borderBottom: C.bd }}>
              <a href="/pricing" style={{ fontSize: 12, color: C.s, fontWeight: 500, textDecoration: "none" }}>View full pricing with feature comparison &#8594;</a>
            </div>
          </section>
        </div>

        {gap}

        {/* ═══ ENTERPRISE + TRUST + FOOTER PANEL ═══ */}
        <div style={panel}>
          <section className="cm-rv" style={{ padding: "72px 32px", background: C.w5, borderTop: C.bd, borderBottom: C.bd }}>
            <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
              <p style={m({ fontSize: 10, letterSpacing: 2.5, color: C.w4, textAlign: "center", marginBottom: 8 })}>BUILT FOR REGULATED INDUSTRIES</p>
              <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, textAlign: "center", letterSpacing: -0.5, marginBottom: 16 }}>Your data never leaves your infrastructure</h2>
              <p style={{ fontSize: 15, color: C.w6, lineHeight: 1.7, marginBottom: 32 }}>22 compliance controls across SOC 2, GDPR, CCPA, PCI, and SOX. Automatic enforcement on deploy. ClareMesh runs on your Supabase, your Vercel, your Cloudflare. No data passes through our servers.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <a href="/security" className="cm-bp" style={{ padding: "14px 28px", fontSize: 13, fontWeight: 500, color: "#fff", background: C.s2, textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,.1)" }}>View security details</a>
                <a href="/docs/compliance" className="cm-bg" style={{ padding: "14px 28px", fontSize: 13, fontWeight: 500, color: C.w8, border: `0.5px solid ${C.w2}`, textDecoration: "none", background: C.w }}>Compliance docs</a>
              </div>
            </div>
          </section>

          <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", borderBottom: C.bd }}>
            {[{ f: "SOC 2", st: "Type II in progress" },{ f: "GDPR", st: "Compliant" },{ f: "CCPA", st: "Compliant" },{ f: "PCI DSS", st: "Level 1" },{ f: "SOX", st: "Sec. 404" }].map((fw, i) => (
              <div key={i} className="cm-tr" style={{ padding: "22px 0", textAlign: "center", borderRight: i<4?C.bd:"none" }}>
                <div style={m({ fontSize: 13, fontWeight: 500, marginBottom: 3 })}>{fw.f}</div>
                <div style={m({ fontSize: 10, color: C.w4 })}>{fw.st}</div>
              </div>
            ))}
          </section>

          <footer>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: C.bd }}>
              {[
                { t: "PRODUCT", ls: ["Schema","Transforms","Sync","Pricing","Changelog"] },
                { t: "DEVELOPERS", ls: ["Documentation","API reference","Quickstart","Status"] },
                { t: "COMPANY", ls: ["About","Blog","Security","Contact"] },
                { t: "LEGAL", ls: ["Privacy","Terms","DPA","Sub-processors"] },
              ].map((col, i) => (
                <div key={i} style={{ padding: 32, borderRight: i<3?C.bd:"none" }}>
                  <p style={m({ fontSize: 10, letterSpacing: 1.5, color: C.w4, marginBottom: 16 })}>{col.t}</p>
                  {col.ls.map(link => (<a key={link} href="#" className="cm-fl" style={{ display: "block", fontSize: 13, color: C.w6, textDecoration: "none", marginBottom: 10 }}>{link}</a>))}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Logo size={14} /><span style={m({ fontSize: 10, color: C.w4 })}>CLAREMESH &copy; 2026 FINANCIAL HOLDING LLC</span>
              </div>
              <span style={m({ fontSize: 10, color: C.w4 })}>Clarity through connection</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
