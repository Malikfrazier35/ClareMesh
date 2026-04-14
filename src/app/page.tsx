export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--warm-white)" }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 py-3"
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
          <span
            className="text-sm font-medium"
            style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700 }}
          >
            ClareMesh
          </span>
        </div>
        <div className="flex gap-6 text-xs" style={{ color: "var(--warm-600)" }}>
          <a href="/docs" className="hover:text-black transition-colors">Schema</a>
          <a href="/docs" className="hover:text-black transition-colors">Docs</a>
          <a href="/pricing" className="hover:text-black transition-colors">Pricing</a>
          <a href="/security" className="hover:text-black transition-colors">Security</a>
          <a
            href="/login"
            className="hover:text-black transition-colors font-medium"
            style={{ color: "var(--slate)" }}
          >
            Sign in
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        {/* Topographic contours */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          style={{ opacity: 0.04 }}
        >
          <path d="M0 200Q300 160 600 200T1200 200" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 180Q300 140 600 180T1200 180" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M0 220Q300 180 600 220T1200 220" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M0 160Q300 120 600 160T1200 160" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <path d="M0 240Q300 200 600 240T1200 240" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <path d="M0 140Q300 100 600 140T1200 140" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <path d="M0 260Q300 220 600 260T1200 260" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </svg>

        <div className="relative z-10">
          <p
            className="mb-4"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "10px",
              letterSpacing: "2.5px",
              color: "var(--slate)",
            }}
          >
            FINANCIAL DATA INFRASTRUCTURE
          </p>
          <h1
            className="mb-4"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 5vw, 48px)",
              letterSpacing: "-0.5px",
              color: "var(--warm-900)",
            }}
          >
            Clarity through connection
          </h1>
          <p
            className="mx-auto mb-8 max-w-xl"
            style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--warm-600)" }}
          >
            An open-source financial data schema and bi-directional sync SDK that
            runs on your own infrastructure.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/signup"
              className="px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--slate)" }}
            >
              Get started free
            </a>
            <a
              href="/docs"
              className="px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
              style={{ border: "0.5px solid var(--warm-200)", color: "var(--warm-800)" }}
            >
              View schema
            </a>
          </div>
        </div>
      </section>

      {/* Feature Grid — 3x2 cell borders */}
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
            className="p-6"
            style={{
              borderRight: (i + 1) % 3 !== 0 ? "0.5px solid var(--warm-100)" : "none",
              borderBottom: i < 3 ? "0.5px solid var(--warm-100)" : "none",
            }}
          >
            <p
              className="mb-2"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "11px",
                color: "var(--slate)",
              }}
            >
              {f.label}
            </p>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--warm-900)" }}>
              {f.title}
            </p>
            <p className="text-xs" style={{ color: "var(--warm-600)", lineHeight: 1.6 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Trust Bar */}
      <section
        className="grid grid-cols-5"
        style={{ borderTop: "0.5px solid var(--warm-100)" }}
      >
        {["SOC 2", "GDPR", "CCPA", "PCI DSS", "SOX"].map((fw, i) => (
          <div
            key={i}
            className="py-4 text-center"
            style={{
              borderRight: i < 4 ? "0.5px solid var(--warm-100)" : "none",
              fontFamily: "'Geist Mono', monospace",
              fontSize: "12px",
              color: "var(--warm-600)",
            }}
          >
            {fw}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 flex justify-between items-center"
        style={{ borderTop: "0.5px solid var(--warm-100)" }}
      >
        <p
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "10px",
            color: "var(--warm-400)",
          }}
        >
          CLAREMESH &copy; 2026 FINANCIAL HOLDING LLC
        </p>
        <div className="flex gap-4 text-xs" style={{ color: "var(--warm-400)" }}>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/security">Security</a>
          <a href="/status">Status</a>
        </div>
      </footer>
    </div>
  );
}
