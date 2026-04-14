export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--warm-white)", color: "var(--warm-900)" }}>
      {/* ── 01. NAV ── */}
      <nav
        className="flex items-center justify-between px-8 py-3"
        style={{ borderBottom: "0.5px solid var(--warm-100)" }}
      >
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="4" width="14" height="14" fill="var(--slate)" opacity="0.15" />
            <rect x="12" y="12" width="14" height="14" fill="var(--slate)" opacity="0.3" />
            <rect x="22" y="22" width="14" height="14" fill="var(--slate)" opacity="0.5" />
            <circle cx="11" cy="11" r="2" fill="var(--slate)" />
            <circle cx="20" cy="20" r="2" fill="var(--slate)" />
            <circle cx="29" cy="29" r="2" fill="var(--slate)" />
            <line x1="11" y1="11" x2="20" y2="20" stroke="var(--slate)" strokeWidth="0.75" />
            <line x1="20" y1="20" x2="29" y2="29" stroke="var(--slate)" strokeWidth="0.75" />
          </svg>
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: "15px" }}>
            ClareMesh
          </span>
        </div>
        <div className="flex items-center gap-8" style={{ fontSize: "13px", color: "var(--warm-600)" }}>
          <a href="/docs" className="hover:text-black transition-colors">Schema</a>
          <a href="/docs" className="hover:text-black transition-colors">Docs</a>
          <a href="/pricing" className="hover:text-black transition-colors">Pricing</a>
          <a href="/security" className="hover:text-black transition-colors">Security</a>
          <a href="/login" className="transition-colors font-medium" style={{ color: "var(--slate)" }}>Sign in</a>
        </div>
      </nav>

      {/* ── 02. HERO ── */}
      <section className="relative overflow-hidden" style={{ padding: "80px 32px 72px" }}>
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1400 500"
          preserveAspectRatio="none"
          style={{ opacity: 0.035 }}
        >
          {[...Array(9)].map((_, i) => (
            <path
              key={i}
              d={`M0 ${250 + (i - 4) * 25}Q350 ${250 + (i - 4) * 25 - 40} 700 ${250 + (i - 4) * 25}T1400 ${250 + (i - 4) * 25}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={i === 4 ? 1.5 : Math.max(0.15, 1.2 - Math.abs(i - 4) * 0.25)}
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            letterSpacing: "3px",
            color: "var(--slate)",
            marginBottom: "16px",
          }}>
            FINANCIAL DATA INFRASTRUCTURE
          </p>
          <h1 style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(36px, 5vw, 56px)",
            letterSpacing: "-1px",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}>
            Clarity through connection
          </h1>
          <p style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "var(--warm-600)",
            maxWidth: "520px",
            margin: "0 auto 32px",
          }}>
            An open-source financial data schema and bi-directional sync SDK
            that runs on your own infrastructure.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/signup"
              className="px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--slate)" }}
            >
              Get started free
            </a>
            <a
              href="/docs"
              className="px-7 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ border: "0.5px solid var(--warm-200)", color: "var(--warm-800)" }}
            >
              View schema
            </a>
          </div>
        </div>
      </section>

      {/* ── 03. FEATURE GRID ── */}
      <section
        className="grid grid-cols-3"
        style={{ borderTop: "0.5px solid var(--warm-100)" }}
      >
        {[
          { label: "[ SCHEMA ]", title: "Unified object model", desc: "Account, Transaction, Entity, Balance. Published, versioned, MIT-licensed." },
          { label: "[ TRANSFORMS ]", title: "Normalize anything", desc: "Plaid, Stripe, QuickBooks, Xero, NetSuite. One schema out." },
          { label: "[ SYNC ]", title: "Bi-directional sync", desc: "Change detection, conflict resolution, immutable audit trail." },
          { label: "[ COMPLIANCE ]", title: "22 controls built in", desc: "SOC 2, GDPR, CCPA, PCI, SOX. Readiness dashboard included." },
          { label: "[ INFRA ]", title: "Runs on your stack", desc: "Deploy on Supabase, Vercel, or Cloudflare. Your data never leaves." },
          { label: "[ METERED ]", title: "Usage-based pricing", desc: "Open tier free forever. Build at $199/mo. Scale at $799/mo." },
        ].map((f, i) => (
          <div
            key={i}
            className="p-8"
            style={{
              borderRight: (i + 1) % 3 !== 0 ? "0.5px solid var(--warm-100)" : "none",
              borderBottom: i < 3 ? "0.5px solid var(--warm-100)" : "none",
            }}
          >
            <p style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "11px",
              color: "var(--slate)",
              marginBottom: "10px",
            }}>
              {f.label}
            </p>
            <p className="font-medium mb-2" style={{ fontSize: "15px" }}>{f.title}</p>
            <p style={{ fontSize: "13px", color: "var(--warm-600)", lineHeight: 1.7 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ── 04. HOW IT WORKS ── */}
      <section style={{ borderTop: "0.5px solid var(--warm-100)", padding: "56px 32px" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            letterSpacing: "2.5px",
            color: "var(--warm-400)",
            textAlign: "center",
            marginBottom: "8px",
          }}>
            HOW IT WORKS
          </p>
          <h2 style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            textAlign: "center",
            letterSpacing: "-0.3px",
            marginBottom: "40px",
          }}>
            Connect once. Normalize everything. Sync everywhere.
          </h2>

          {/* Sources */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {["Plaid", "Stripe", "QuickBooks", "Xero", "NetSuite"].map((s) => (
              <span
                key={s}
                className="px-4 py-2"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "11px",
                  border: "0.5px solid var(--warm-200)",
                  color: "var(--warm-600)",
                  background: "var(--warm-white)",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Arrow */}
          <div className="text-center" style={{ color: "var(--warm-200)", fontSize: "20px", margin: "4px 0" }}>&#8595;</div>

          {/* Three layers */}
          <div className="space-y-2 mb-6">
            {[
              { name: "Transform", sub: "Normalize raw API responses into unified types", color: "#0F6E56", bg: "#E1F5EE" },
              { name: "Schema", sub: "Account, Transaction, Entity, Balance, Forecast", color: "#534AB7", bg: "#EEEDFE" },
              { name: "Sync", sub: "Bi-directional, conflict resolution, audit trail", color: "#993C1D", bg: "#FAECE7" },
            ].map((layer) => (
              <div
                key={layer.name}
                className="flex items-center justify-between px-6 py-4"
                style={{ background: layer.bg, borderLeft: `3px solid ${layer.color}` }}
              >
                <span style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: layer.color,
                }}>
                  {layer.name}
                </span>
                <span style={{ fontSize: "12px", color: layer.color, opacity: 0.7 }}>{layer.sub}</span>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="text-center" style={{ color: "var(--warm-200)", fontSize: "20px", margin: "4px 0" }}>&#8595;</div>

          {/* Outputs */}
          <div className="flex justify-center gap-2 flex-wrap">
            {["Your treasury app", "Your FP&A app", "Your close app"].map((s) => (
              <span
                key={s}
                className="px-4 py-2"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "11px",
                  border: "0.5px solid var(--warm-200)",
                  color: "var(--warm-600)",
                  background: "var(--warm-white)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05. CODE PREVIEW ── */}
      <section style={{ borderTop: "0.5px solid var(--warm-100)", padding: "56px 32px" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            letterSpacing: "2.5px",
            color: "var(--warm-400)",
            textAlign: "center",
            marginBottom: "8px",
          }}>
            DEVELOPER EXPERIENCE
          </p>
          <h2 style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            textAlign: "center",
            letterSpacing: "-0.3px",
            marginBottom: "32px",
          }}>
            Normalized data in four lines
          </h2>

          <div style={{
            background: "var(--warm-50)",
            border: "0.5px solid var(--warm-100)",
            padding: "24px",
            fontFamily: "'Geist Mono', 'Courier New', monospace",
            fontSize: "13px",
            lineHeight: 2,
            overflowX: "auto",
          }}>
            <div style={{ color: "var(--warm-400)" }}>$ npm install @claremesh/schema @claremesh/transforms</div>
            <br />
            <div>
              <span style={{ color: "#185FA5" }}>import</span>{" "}
              {"{ transformPlaidAccount }"}{" "}
              <span style={{ color: "#185FA5" }}>from</span>{" "}
              <span style={{ color: "#0F6E56" }}>&apos;@claremesh/transforms/plaid&apos;</span>;
            </div>
            <br />
            <div>
              <span style={{ color: "#185FA5" }}>const</span> account = transformPlaidAccount(plaidData, {"{ org_id, entity_id }"});
            </div>
            <div style={{ color: "var(--warm-400)" }}>
              {"// => { id: \"cm_acc_8f2a...\", account_type: \"asset\", balance: { available: 43200 } }"}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: "11px", color: "var(--warm-400)" }}>
              Raw Plaid JSON in. Normalized ClareMesh schema out. Runs on your Supabase.
            </p>
            <a href="/docs" style={{ fontSize: "12px", color: "var(--slate)", fontWeight: 500 }}>
              Read the docs &#8594;
            </a>
          </div>
        </div>
      </section>

      {/* ── 06. PRICING PREVIEW ── */}
      <section style={{ borderTop: "0.5px solid var(--warm-100)" }}>
        <div style={{ padding: "40px 32px 12px", textAlign: "center" }}>
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            letterSpacing: "2.5px",
            color: "var(--warm-400)",
            marginBottom: "8px",
          }}>
            PRICING
          </p>
          <h2 style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            letterSpacing: "-0.3px",
            marginBottom: "8px",
          }}>
            Simple, usage-based pricing
          </h2>
          <p style={{ fontSize: "13px", color: "var(--warm-600)", marginBottom: "32px" }}>
            Start free with the open schema. Pay only when you need transforms, sync, or compliance.
          </p>
        </div>

        <div
          className="grid grid-cols-4"
          style={{ borderTop: "0.5px solid var(--warm-100)", borderBottom: "0.5px solid var(--warm-100)" }}
        >
          {[
            { tier: "OPEN", name: "Open", price: "$0", sub: "free forever", cta: "npm install", primary: false, featured: false },
            { tier: "BUILD", name: "Build", price: "$199", sub: "/month + usage", cta: "Start building", primary: false, featured: false },
            { tier: "SCALE", name: "Scale", price: "$799", sub: "/month + usage", cta: "Start scaling", primary: true, featured: true },
            { tier: "ENTERPRISE", name: "Enterprise", price: "Custom", sub: "annual contract", cta: "Contact sales", primary: false, featured: false },
          ].map((t, i) => (
            <div
              key={i}
              className="p-8 flex flex-col"
              style={{
                borderRight: i < 3 ? "0.5px solid var(--warm-100)" : "none",
                ...(t.featured ? { borderLeft: "2px solid var(--slate)", borderRight: "2px solid var(--slate)", margin: "0 -1px", position: "relative" as const, zIndex: 1 } : {}),
              }}
            >
              {t.featured && (
                <span style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "1.5px",
                  color: "var(--slate)",
                  marginBottom: "8px",
                }}>
                  MOST POPULAR
                </span>
              )}
              <span style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "9px",
                letterSpacing: "1.5px",
                color: "var(--warm-400)",
                marginBottom: "8px",
              }}>
                {t.tier}
              </span>
              <span style={{ fontSize: "15px", fontWeight: 500, marginBottom: "4px" }}>{t.name}</span>
              <span style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "28px",
                fontWeight: 500,
                marginBottom: "2px",
              }}>
                {t.price}
              </span>
              <span style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "11px",
                color: "var(--warm-400)",
                marginBottom: "auto",
              }}>
                {t.sub}
              </span>
              <a
                href={t.tier === "ENTERPRISE" ? "/contact" : "/signup"}
                className="block text-center py-2 mt-6 text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  background: t.primary ? "var(--slate)" : "transparent",
                  color: t.primary ? "white" : "var(--warm-800)",
                  border: t.primary ? "none" : "0.5px solid var(--warm-200)",
                }}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <a href="/pricing" style={{ fontSize: "12px", color: "var(--slate)", fontWeight: 500 }}>
            View full pricing with feature comparison &#8594;
          </a>
        </div>
      </section>

      {/* ── 07. ENTERPRISE CALLOUT ── */}
      <section style={{
        borderTop: "0.5px solid var(--warm-100)",
        padding: "56px 32px",
        background: "var(--warm-50)",
      }}>
        <div className="max-w-xl mx-auto text-center">
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            letterSpacing: "2.5px",
            color: "var(--warm-400)",
            marginBottom: "12px",
          }}>
            BUILT FOR REGULATED INDUSTRIES
          </p>
          <h2 style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            letterSpacing: "-0.3px",
            marginBottom: "12px",
          }}>
            Your data never leaves your infrastructure
          </h2>
          <p style={{
            fontSize: "14px",
            color: "var(--warm-600)",
            lineHeight: 1.7,
            marginBottom: "24px",
          }}>
            22 compliance controls across SOC 2, GDPR, CCPA, PCI, and SOX.
            Automatic enforcement on deploy. ClareMesh runs on your Supabase,
            your Vercel, your Cloudflare. No data passes through our servers.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/security"
              className="px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--slate)", color: "white" }}
            >
              View security details
            </a>
            <a
              href="/docs/compliance"
              className="px-6 py-3 text-sm font-medium transition-colors hover:bg-white"
              style={{ border: "0.5px solid var(--warm-200)", color: "var(--warm-800)" }}
            >
              Compliance docs
            </a>
          </div>
        </div>
      </section>

      {/* ── 08. TRUST BAR ── */}
      <section
        className="grid grid-cols-5"
        style={{ borderTop: "0.5px solid var(--warm-100)" }}
      >
        {[
          { fw: "SOC 2", status: "Type II in progress" },
          { fw: "GDPR", status: "Compliant" },
          { fw: "CCPA", status: "Compliant" },
          { fw: "PCI DSS", status: "Level 1" },
          { fw: "SOX", status: "Sec. 404" },
        ].map((f, i) => (
          <div
            key={i}
            className="py-5 text-center"
            style={{ borderRight: i < 4 ? "0.5px solid var(--warm-100)" : "none" }}
          >
            <div style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "13px",
              fontWeight: 500,
              marginBottom: "2px",
            }}>
              {f.fw}
            </div>
            <div style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "10px",
              color: "var(--warm-400)",
            }}>
              {f.status}
            </div>
          </div>
        ))}
      </section>

      {/* ── 09. FOOTER ── */}
      <footer style={{ borderTop: "0.5px solid var(--warm-100)" }}>
        <div className="grid grid-cols-4 gap-0" style={{ borderBottom: "0.5px solid var(--warm-100)" }}>
          {[
            { title: "Product", links: ["Schema", "Transforms", "Sync", "Pricing"] },
            { title: "Developers", links: ["Documentation", "API reference", "Changelog", "Status"] },
            { title: "Company", links: ["About", "Blog", "Security", "Contact"] },
            { title: "Legal", links: ["Privacy", "Terms", "DPA", "Sub-processors"] },
          ].map((col, i) => (
            <div
              key={i}
              className="p-8"
              style={{ borderRight: i < 3 ? "0.5px solid var(--warm-100)" : "none" }}
            >
              <p style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "10px",
                letterSpacing: "1.5px",
                color: "var(--warm-400)",
                marginBottom: "12px",
              }}>
                {col.title.toUpperCase()}
              </p>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm transition-colors hover:text-black"
                  style={{ color: "var(--warm-600)", marginBottom: "8px" }}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div
          className="flex items-center justify-between px-8 py-4"
        >
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="4" width="14" height="14" fill="var(--slate)" opacity="0.15" />
              <rect x="12" y="12" width="14" height="14" fill="var(--slate)" opacity="0.3" />
              <rect x="22" y="22" width="14" height="14" fill="var(--slate)" opacity="0.5" />
              <circle cx="11" cy="11" r="2" fill="var(--slate)" />
              <circle cx="20" cy="20" r="2" fill="var(--slate)" />
              <circle cx="29" cy="29" r="2" fill="var(--slate)" />
              <line x1="11" y1="11" x2="20" y2="20" stroke="var(--slate)" strokeWidth="0.75" />
              <line x1="20" y1="20" x2="29" y2="29" stroke="var(--slate)" strokeWidth="0.75" />
            </svg>
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "10px",
              color: "var(--warm-400)",
            }}>
              CLAREMESH &copy; 2026 FINANCIAL HOLDING LLC
            </span>
          </div>
          <span style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            color: "var(--warm-400)",
          }}>
            Clarity through connection
          </span>
        </div>
      </footer>
    </div>
  );
}
