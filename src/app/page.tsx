"use client";

import { useEffect, useRef } from "react";

function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="14" height="14" fill="var(--slate)" opacity="0.15" />
      <rect x="12" y="12" width="14" height="14" fill="var(--slate)" opacity="0.3" />
      <rect x="22" y="22" width="14" height="14" fill="var(--slate)" opacity="0.5" />
      <circle cx="11" cy="11" r="2" fill="var(--slate)" />
      <circle cx="20" cy="20" r="2" fill="var(--slate)" />
      <circle cx="29" cy="29" r="2" fill="var(--slate)" />
      <line x1="11" y1="11" x2="20" y2="20" stroke="var(--slate)" strokeWidth="0.75" />
      <line x1="20" y1="20" x2="29" y2="29" stroke="var(--slate)" strokeWidth="0.75" />
    </svg>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", letterSpacing: "2.5px", color: "var(--warm-400)", textAlign: "center", marginBottom: "8px" }}>
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: "28px", textAlign: "center", letterSpacing: "-0.5px", marginBottom: "12px" }}>
      {children}
    </h2>
  );
}

function Divider() {
  return <div style={{ borderTop: "0.5px solid var(--warm-100)" }} />;
}

export default function Home() {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!revealRef.current) return;
    const els = revealRef.current.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(20px)";
      (el as HTMLElement).style.transition = "opacity 0.6s ease, transform 0.6s ease";
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const features = [
    { label: "[ SCHEMA ]", title: "Unified object model", desc: "Account, Transaction, Entity, Balance, Forecast. Published, versioned, MIT-licensed. TypeScript and Python types." },
    { label: "[ TRANSFORMS ]", title: "Normalize anything", desc: "Plaid, Stripe, QuickBooks, Xero, NetSuite, CSV. Raw API response in, clean schema out. One function call." },
    { label: "[ SYNC ]", title: "Bi-directional sync", desc: "Diff-based change detection, configurable conflict resolution, immutable append-only audit trail." },
    { label: "[ COMPLIANCE ]", title: "22 controls built in", desc: "SOC 2, GDPR, CCPA, PCI, SOX. Readiness dashboard. Automatic enforcement on deploy." },
    { label: "[ INFRA ]", title: "Runs on your stack", desc: "Deploy on Supabase, Vercel, or Cloudflare. Your data never touches our servers. Zero-access architecture." },
    { label: "[ METERED ]", title: "Usage-based pricing", desc: "Open tier free forever. Build at $199/mo. Scale at $799/mo. Overage billed, never throttled." },
  ];

  const layers = [
    { name: "Transform", pkg: "@claremesh/transforms", desc: "Normalize raw API responses into unified types", color: "#0F6E56", bg: "#E1F5EE" },
    { name: "Schema", pkg: "@claremesh/schema", desc: "Account, Transaction, Entity, Balance, Forecast", color: "#534AB7", bg: "#EEEDFE" },
    { name: "Sync", pkg: "@claremesh/sync", desc: "Bi-directional, conflict resolution, audit trail", color: "#993C1D", bg: "#FAECE7" },
  ];

  const tiers = [
    { tier: "OPEN", name: "Open", price: "$0", sub: "free forever", features: ["Schema + types", "JSON validation", "MIT licensed"], cta: "npm install", primary: false, featured: false },
    { tier: "BUILD", name: "Build", price: "$199", sub: "/month + usage", features: ["5 connectors", "50K transforms/mo", "4 compliance controls"], cta: "Start building", primary: false, featured: false },
    { tier: "SCALE", name: "Scale", price: "$799", sub: "/month + usage", features: ["Unlimited connectors", "Bi-directional sync", "14 compliance controls"], cta: "Start scaling", primary: true, featured: true },
    { tier: "ENTERPRISE", name: "Enterprise", price: "Custom", sub: "annual contract", features: ["Dedicated sync infra", "SOC 2 Type II", "All 22 controls"], cta: "Contact sales", primary: false, featured: false },
  ];

  const frameworks = [
    { fw: "SOC 2", status: "Type II in progress" },
    { fw: "GDPR", status: "Compliant" },
    { fw: "CCPA", status: "Compliant" },
    { fw: "PCI DSS", status: "Level 1" },
    { fw: "SOX", status: "Sec. 404" },
  ];

  const footerCols = [
    { title: "PRODUCT", links: ["Schema", "Transforms", "Sync", "Pricing", "Changelog"] },
    { title: "DEVELOPERS", links: ["Documentation", "API reference", "Quickstart", "Status"] },
    { title: "COMPANY", links: ["About", "Blog", "Security", "Contact"] },
    { title: "LEGAL", links: ["Privacy", "Terms", "DPA", "Sub-processors"] },
  ];

  return (
    <div ref={revealRef} className="min-h-screen" style={{ background: "var(--warm-white)", color: "var(--warm-900)" }}>

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-8 py-3 sticky top-0 z-50" style={{ borderBottom: "0.5px solid var(--warm-100)", background: "rgba(250,250,248,0.92)", backdropFilter: "blur(12px)" }}>
        <a href="/" className="flex items-center gap-2 no-underline">
          <Logo />
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--warm-900)" }}>ClareMesh</span>
        </a>
        <div className="flex items-center gap-8" style={{ fontSize: "13px", color: "var(--warm-600)" }}>
          {["Schema", "Docs", "Pricing", "Security"].map((l) => (
            <a key={l} href={`/${l.toLowerCase()}`} className="hover:text-black transition-colors no-underline" style={{ color: "var(--warm-600)" }}>{l}</a>
          ))}
          <a href="/login" className="transition-colors no-underline font-medium" style={{ color: "var(--slate)" }}>Sign in</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ padding: "100px 32px 88px" }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1400 500" preserveAspectRatio="none" style={{ opacity: 0.035 }}>
          {[...Array(11)].map((_, i) => (
            <path key={i} d={`M0 ${250 + (i - 5) * 22}Q350 ${250 + (i - 5) * 22 - 35} 700 ${250 + (i - 5) * 22}T1400 ${250 + (i - 5) * 22}`} fill="none" stroke="currentColor" strokeWidth={i === 5 ? 1.5 : Math.max(0.12, 1.1 - Math.abs(i - 5) * 0.22)} />
          ))}
        </svg>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: "var(--slate)", marginBottom: "20px" }}>
            FINANCIAL DATA INFRASTRUCTURE
          </p>
          <h1 style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 800, fontSize: "clamp(40px, 5.5vw, 60px)", letterSpacing: "-1.5px", lineHeight: 1.05, marginBottom: "24px" }}>
            Clarity through connection
          </h1>
          <p style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--warm-600)", maxWidth: "500px", margin: "0 auto 36px" }}>
            An open-source financial data schema and bi-directional sync SDK that runs on your own infrastructure.
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/signup" className="px-8 py-3 text-sm font-medium text-white transition-all hover:opacity-90 no-underline" style={{ background: "var(--slate)" }}>Get started free</a>
            <a href="/docs" className="px-8 py-3 text-sm font-medium transition-all hover:bg-gray-50 no-underline" style={{ border: "0.5px solid var(--warm-200)", color: "var(--warm-800)" }}>View schema</a>
          </div>
          <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "11px", color: "var(--warm-400)", marginTop: "20px" }}>
            npm install @claremesh/schema
          </p>
        </div>
      </section>

      <Divider />

      {/* ── FEATURE GRID ── */}
      <section className="grid grid-cols-3" data-reveal>
        {features.map((f, i) => (
          <div key={i} className="p-8 transition-colors hover:bg-white" style={{ borderRight: (i + 1) % 3 !== 0 ? "0.5px solid var(--warm-100)" : "none", borderBottom: i < 3 ? "0.5px solid var(--warm-100)" : "none" }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "11px", color: "var(--slate)", marginBottom: "12px" }}>{f.label}</p>
            <p className="font-medium mb-2" style={{ fontSize: "15px" }}>{f.title}</p>
            <p style={{ fontSize: "13px", color: "var(--warm-600)", lineHeight: 1.7 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      <Divider />

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "72px 32px" }} data-reveal>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <SectionTitle>Connect once. Normalize everything. Sync everywhere.</SectionTitle>
          <p style={{ fontSize: "14px", color: "var(--warm-600)", textAlign: "center", maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.7 }}>
            Raw financial data from any source flows through three layers and emerges as a unified, validated, sync-ready object model.
          </p>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {["Plaid", "Stripe", "QuickBooks", "Xero", "NetSuite", "CSV"].map((s) => (
              <span key={s} className="px-4 py-2 transition-colors hover:bg-white" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "11px", border: "0.5px solid var(--warm-200)", color: "var(--warm-600)" }}>{s}</span>
            ))}
          </div>

          <div className="text-center mb-2" style={{ color: "var(--warm-200)", fontSize: "18px" }}>&#8595;</div>

          <div className="space-y-2 mb-4">
            {layers.map((l) => (
              <div key={l.name} className="flex items-center justify-between px-6 py-4" style={{ background: l.bg, borderLeft: `3px solid ${l.color}` }}>
                <div>
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: l.color }}>{l.name}</span>
                  <span style={{ fontSize: "12px", color: l.color, opacity: 0.6, marginLeft: "12px" }}>{l.desc}</span>
                </div>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: l.color, opacity: 0.5 }}>{l.pkg}</span>
              </div>
            ))}
          </div>

          <div className="text-center mb-2" style={{ color: "var(--warm-200)", fontSize: "18px" }}>&#8595;</div>

          <div className="flex justify-center gap-2 flex-wrap">
            {["Your treasury app", "Your FP&A platform", "Your close system"].map((s) => (
              <span key={s} className="px-4 py-2" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "11px", border: "0.5px solid var(--warm-200)", color: "var(--warm-600)" }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── SUITE INTEGRATION ── */}
      <section data-reveal>
        <div style={{ padding: "48px 32px 16px", textAlign: "center" }}>
          <SectionLabel>SUITE INTEGRATION</SectionLabel>
          <SectionTitle>One pipe. Three products. Zero triple-integration.</SectionTitle>
          <p style={{ fontSize: "14px", color: "var(--warm-600)", maxWidth: "480px", margin: "0 auto 8px", lineHeight: 1.7 }}>
            A customer connects QuickBooks once through ClareMesh. Every product in the suite reads from the same schema and writes back through the same sync layer.
          </p>
        </div>
        <div className="grid grid-cols-3" style={{ borderTop: "0.5px solid var(--warm-100)" }}>
          {[
            { name: "Vaultline", role: "Treasury", reads: "Cash, balances, projections", writes: "Alert rules, scenarios" },
            { name: "Castford", role: "FP&A", reads: "P&L, variance, budgets", writes: "Forecasts, board packages" },
            { name: "Ashford Ledger", role: "Month-end close", reads: "GL, transactions, entities", writes: "Reconciliation, journal entries" },
          ].map((p, i) => (
            <div key={i} className="p-8" style={{ borderRight: i < 2 ? "0.5px solid var(--warm-100)" : "none" }}>
              <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: "15px", marginBottom: "2px" }}>{p.name}</p>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "var(--slate)", marginBottom: "16px" }}>{p.role}</p>
              <p style={{ fontSize: "12px", color: "var(--warm-600)", marginBottom: "6px" }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "var(--warm-400)", marginRight: "6px" }}>READS</span>{p.reads}
              </p>
              <p style={{ fontSize: "12px", color: "var(--warm-600)" }}>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "var(--warm-400)", marginRight: "6px" }}>WRITES</span>{p.writes}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── CODE PREVIEW ── */}
      <section style={{ padding: "72px 32px" }} data-reveal>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>DEVELOPER EXPERIENCE</SectionLabel>
          <SectionTitle>Normalized data in four lines</SectionTitle>
          <p style={{ fontSize: "14px", color: "var(--warm-600)", textAlign: "center", maxWidth: "440px", margin: "0 auto 32px", lineHeight: 1.7 }}>
            Install the SDK, import the transform, pass your raw API data. Get back a validated, typed, sync-ready financial object.
          </p>

          <div style={{ border: "0.5px solid var(--warm-100)" }}>
            <div className="flex" style={{ borderBottom: "0.5px solid var(--warm-100)", background: "var(--warm-50)" }}>
              <span className="px-4 py-2" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "var(--warm-400)", borderRight: "0.5px solid var(--warm-100)" }}>terminal</span>
              <span className="px-4 py-2" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "var(--warm-800)", borderBottom: "1.5px solid var(--slate)", marginBottom: "-1px" }}>transform.ts</span>
              <span className="px-4 py-2" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "var(--warm-400)" }}>output.json</span>
            </div>
            <div style={{ padding: "24px", fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: "13px", lineHeight: 2.0, overflowX: "auto" }}>
              <div><span style={{ color: "#185FA5" }}>import</span> {"{ transformPlaidAccount }"} <span style={{ color: "#185FA5" }}>from</span> <span style={{ color: "#0F6E56" }}>&apos;@claremesh/transforms/plaid&apos;</span>;</div>
              <div><span style={{ color: "#185FA5" }}>import</span> <span style={{ color: "#185FA5" }}>type</span> {"{ Account }"} <span style={{ color: "#185FA5" }}>from</span> <span style={{ color: "#0F6E56" }}>&apos;@claremesh/schema&apos;</span>;</div>
              <br />
              <div style={{ color: "var(--warm-400)" }}>{"// Raw Plaid response \u2192 normalized ClareMesh Account"}</div>
              <div><span style={{ color: "#185FA5" }}>const</span> account: <span style={{ color: "#534AB7" }}>Account</span> = transformPlaidAccount(plaidData, {"{"}</div>
              <div style={{ paddingLeft: "24px" }}>org_id: <span style={{ color: "#0F6E56" }}>&apos;org_d8afc85d&apos;</span>,</div>
              <div style={{ paddingLeft: "24px" }}>entity_id: <span style={{ color: "#0F6E56" }}>&apos;ent_acme_01&apos;</span>,</div>
              <div>{"}"});</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "11px", color: "var(--warm-400)" }}>
              12ms per transform. Schema v2.4.1 validated. Zero data egress.
            </p>
            <a href="/docs" className="no-underline" style={{ fontSize: "12px", color: "var(--slate)", fontWeight: 500 }}>Read the docs &#8594;</a>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PRICING ── */}
      <section data-reveal>
        <div style={{ padding: "48px 32px 12px", textAlign: "center" }}>
          <SectionLabel>PRICING</SectionLabel>
          <SectionTitle>Simple, usage-based pricing</SectionTitle>
          <p style={{ fontSize: "14px", color: "var(--warm-600)", marginBottom: "32px" }}>Start free with the open schema. Pay only when you need transforms, sync, or compliance.</p>
        </div>
        <div className="grid grid-cols-4" style={{ borderTop: "0.5px solid var(--warm-100)", borderBottom: "0.5px solid var(--warm-100)" }}>
          {tiers.map((t, i) => (
            <div key={i} className="p-8 flex flex-col" style={{ borderRight: i < 3 ? "0.5px solid var(--warm-100)" : "none", ...(t.featured ? { borderLeft: "2px solid var(--slate)", borderRight: "2px solid var(--slate)", margin: "0 -1px", position: "relative" as const, zIndex: 1 } : {}) }}>
              {t.featured && <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "9px", letterSpacing: "1.5px", color: "var(--slate)", marginBottom: "8px" }}>MOST POPULAR</span>}
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "9px", letterSpacing: "1.5px", color: "var(--warm-400)", marginBottom: "8px" }}>{t.tier}</span>
              <span style={{ fontSize: "15px", fontWeight: 500, marginBottom: "4px" }}>{t.name}</span>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "32px", fontWeight: 500, marginBottom: "2px" }}>{t.price}</span>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "11px", color: "var(--warm-400)", marginBottom: "20px" }}>{t.sub}</span>
              <div className="space-y-2 mb-auto">
                {t.features.map((f) => (
                  <p key={f} style={{ fontSize: "12px", color: "var(--warm-600)", paddingLeft: "12px", borderLeft: "1.5px solid var(--warm-200)" }}>{f}</p>
                ))}
              </div>
              <a href={t.tier === "ENTERPRISE" ? "/contact" : "/signup"} className="block text-center py-3 mt-8 text-sm font-medium transition-all hover:opacity-90 no-underline" style={{ background: t.primary ? "var(--slate)" : "transparent", color: t.primary ? "white" : "var(--warm-800)", border: t.primary ? "none" : "0.5px solid var(--warm-200)" }}>{t.cta}</a>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <a href="/pricing" className="no-underline" style={{ fontSize: "12px", color: "var(--slate)", fontWeight: 500 }}>View full pricing with feature comparison &#8594;</a>
        </div>
      </section>

      <Divider />

      {/* ── ENTERPRISE CALLOUT ── */}
      <section style={{ padding: "72px 32px", background: "var(--warm-50)" }} data-reveal>
        <div className="max-w-xl mx-auto text-center">
          <SectionLabel>BUILT FOR REGULATED INDUSTRIES</SectionLabel>
          <SectionTitle>Your data never leaves your infrastructure</SectionTitle>
          <p style={{ fontSize: "15px", color: "var(--warm-600)", lineHeight: 1.7, marginBottom: "28px" }}>
            22 compliance controls across SOC 2, GDPR, CCPA, PCI, and SOX. Automatic enforcement on deploy. ClareMesh runs on your Supabase, your Vercel, your Cloudflare. No data passes through our servers.
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/security" className="px-7 py-3 text-sm font-medium text-white transition-all hover:opacity-90 no-underline" style={{ background: "var(--slate)" }}>View security details</a>
            <a href="/docs/compliance" className="px-7 py-3 text-sm font-medium transition-all hover:bg-white no-underline" style={{ border: "0.5px solid var(--warm-200)", color: "var(--warm-800)" }}>Compliance docs</a>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="grid grid-cols-5" style={{ borderTop: "0.5px solid var(--warm-100)" }}>
        {frameworks.map((f, i) => (
          <div key={i} className="py-5 text-center" style={{ borderRight: i < 4 ? "0.5px solid var(--warm-100)" : "none" }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{f.fw}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "var(--warm-400)" }}>{f.status}</div>
          </div>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "0.5px solid var(--warm-100)" }}>
        <div className="grid grid-cols-4" style={{ borderBottom: "0.5px solid var(--warm-100)" }}>
          {footerCols.map((col, i) => (
            <div key={i} className="p-8" style={{ borderRight: i < 3 ? "0.5px solid var(--warm-100)" : "none" }}>
              <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", color: "var(--warm-400)", marginBottom: "14px" }}>{col.title}</p>
              {col.links.map((link) => (
                <a key={link} href="#" className="block text-sm transition-colors hover:text-black no-underline" style={{ color: "var(--warm-600)", marginBottom: "10px" }}>{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-2">
            <Logo size={14} />
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "var(--warm-400)" }}>CLAREMESH &copy; 2026 FINANCIAL HOLDING LLC</span>
          </div>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "10px", color: "var(--warm-400)" }}>Clarity through connection</span>
        </div>
      </footer>
    </div>
  );
}
