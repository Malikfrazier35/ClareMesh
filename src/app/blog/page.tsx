"use client";
import { Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const POSTS = [
  {
    slug: "we-open-sourced-our-financial-data-schema",
    title: "We open-sourced our financial data schema. Here's why.",
    excerpt: "Two years ago we started writing normalization code for a treasury product. We ended up writing it four times across four codebases before realizing every fintech team solves the same problem. Here's the case for open-source financial data infrastructure — and why we bet our business on it.",
    date: "April 30, 2026",
    readTime: "11 min",
    category: "Philosophy",
    tags: ["Open Source", "Strategy", "Fintech"],
  },
  {
    slug: "why-month-end-close-still-takes-5-days",
    title: "Why month-end close still takes 5 days in 2026",
    excerpt: "It's Monday morning of close week. Somewhere, a controller is staring at 17 open browser tabs. If you run finance in 2026, this scene is familiar. Here's where the five days actually go — and what would need to be true to get to one.",
    date: "April 23, 2026",
    readTime: "14 min",
    category: "Finance Operations",
    tags: ["Month-End Close", "Finance Ops", "Data Architecture"],
  },
  {
    slug: "5-bugs-every-plaid-integration-ships",
    title: "5 bugs every Plaid integration ships (and how to catch them)",
    excerpt: "Every team that integrates Plaid for the first time writes roughly the same code, ships it to production, and then — six to eighteen months later — discovers the same five bugs. Here they are, and how to catch them.",
    date: "April 16, 2026",
    readTime: "12 min",
    category: "Engineering",
    tags: ["Plaid", "Fintech", "Normalization"],
  },
];

function BlogIndexContent() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: "0.5px solid var(--cm-border-light)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          <a href="/schema" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Schema</a>
          <a href="/docs" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Docs</a>
          <a href="/playground" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Playground</a>
          <a href="/blog" style={{ color: "var(--cm-text-panel-h)", textDecoration: "none", fontWeight: 500 }}>Blog</a>
          <a href="/pricing" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Pricing</a>
        </div>
      </nav>

      <div style={{ padding: "72px 32px 48px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2.5, color: "var(--cm-slate)", marginBottom: 12 }}>BLOG</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 48, letterSpacing: -1.5, lineHeight: 1.05, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>
          Notes from the data layer
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--cm-text-panel-b)", maxWidth: 560 }}>
          Technical writing from the ClareMesh team on financial data normalization, fintech API design, compliance engineering, and the weird edge cases we find.
        </p>
      </div>

      <div style={{ padding: "0 32px 64px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: "0.5px solid var(--cm-border-light)" }}>
          {POSTS.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} style={{
              display: "block", padding: "32px 0", borderBottom: "0.5px solid var(--cm-border-light)",
              textDecoration: "none",
            }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-copper)" }}>{post.category.toUpperCase()}</span>
                <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{post.date}</span>
                <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>· {post.readTime} read</span>
              </div>
              <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, lineHeight: 1.2, color: "var(--cm-text-panel-h)", marginBottom: 10 }}>
                {post.title}
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--cm-text-panel-b)", marginBottom: 12 }}>
                {post.excerpt}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: F.m, fontSize: 9, padding: "2px 8px", border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-b)" }}>{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: "24px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", textAlign: "center" }}>
          <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-copper)", marginBottom: 8 }}>NEW POSTS WEEKLY</p>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>
            Technical deep-dives on fintech infrastructure, data normalization, compliance, and close acceleration.
          </p>
          <a href="https://github.com/Malikfrazier35/ClareMesh" target="_blank" rel="noopener" style={{ display: "inline-block", marginTop: 12, fontFamily: F.m, fontSize: 11, color: "var(--cm-slate)", textDecoration: "none" }}>
            Follow on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function BlogIndexPage() { return <Suspense><BlogIndexContent /></Suspense>; }

