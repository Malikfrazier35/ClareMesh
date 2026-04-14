"use client";
import { useEffect, useRef } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};
const C = {
  s: "#4F6D7A", s2: "#3A5361", dk: "#141312", dk2: "#0D0C0B", dk3: "#2A2926",
  w: "#FAFAF8", w5: "#F5F4F0", w1: "#E8E6E0", w2: "#D4D1C9", w4: "#9C998F",
  w6: "#6B6860", w8: "#3D3B36", w9: "#1E1D1A", cp: "#9D7356", wall: "#E2E0D8",
};
const m = (x: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: F.m, ...x });
const bd = "0.5px solid #E8E6E0";
const bdd = "0.5px solid #2A2926";

function Logo({ dark = false, size = 20 }: { dark?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="14" height="14" fill={dark?"#E8E6E0":"#4F6D7A"} opacity={dark?.1:.15}/>
      <rect x="12" y="12" width="14" height="14" fill={dark?"#E8E6E0":"#4F6D7A"} opacity={dark?.2:.3}/>
      <rect x="22" y="22" width="14" height="14" fill={dark?"#E8E6E0":"#4F6D7A"} opacity={dark?.35:.5}/>
      <circle cx="11" cy="11" r="2" fill="#4F6D7A"/><circle cx="20" cy="20" r="2" fill="#4F6D7A"/><circle cx="29" cy="29" r="2" fill="#4F6D7A"/>
      <line x1="11" y1="11" x2="20" y2="20" stroke="#4F6D7A" strokeWidth="0.75"/>
      <line x1="20" y1="20" x2="29" y2="29" stroke="#4F6D7A" strokeWidth="0.75"/>
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
  const gap = <div style={{ height: 56 }} />;

  return (
    <>
      {/* ═══ FIXED BACKGROUND WALL — persists entire page ═══ */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: C.wall, overflow: "hidden" }}>
        {/* Topographic contours */}
        <svg className="cm-topo cm-wallpulse" style={{ position: "absolute", inset: 0, width: "130%", height: "100%", left: "-15%", pointerEvents: "none" }} viewBox="0 0 2000 1400" preserveAspectRatio="none">
          {[80,160,240,320,400,480,560,660,740,820,920,1000,1080,1180,1260,1340].map((y,i)=>(
            <path key={i} d={`M-100 ${y}Q500 ${y-28+Math.sin(i*0.7)*15} 1000 ${y}T2100 ${y}`} fill="none"
              stroke={[3,8,13].includes(i)?C.s:C.w4}
              strokeWidth={[3,8,13].includes(i)?0.8:[0,6,11,15].includes(i)?0.2:0.4}
              opacity={[3,8,13].includes(i)?0.1:[0,6,11,15].includes(i)?0.25:0.35}/>
          ))}
        </svg>
        {/* Dot grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }}>
          <defs><pattern id="gd" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="0.6" fill={C.w6}/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#gd)"/>
        </svg>
        {/* Floating data fragments */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <span className="cm-f1" style={m({ position:"absolute",left:"6%",bottom:"-20px",fontSize:8,color:C.w4,opacity:.1,whiteSpace:"nowrap"})}>acc_8f2a91c4 | asset | $43,200</span>
          <span className="cm-f2" style={m({ position:"absolute",left:"25%",bottom:"-40px",fontSize:8,color:C.w4,opacity:.08,whiteSpace:"nowrap",animationDelay:"3s"})}>txn_amount: 1840.00 | debit</span>
          <span className="cm-f3" style={m({ position:"absolute",left:"55%",bottom:"-10px",fontSize:8,color:C.w4,opacity:.09,whiteSpace:"nowrap",animationDelay:"6s"})}>entity_id: ent_acme_01</span>
          <span className="cm-f1" style={m({ position:"absolute",left:"75%",bottom:"-50px",fontSize:8,color:C.s,opacity:.06,whiteSpace:"nowrap",animationDelay:"9s"})}>transform: plaid → claremesh</span>
          <span className="cm-f2" style={m({ position:"absolute",left:"40%",bottom:"-30px",fontSize:8,color:C.w4,opacity:.07,whiteSpace:"nowrap",animationDelay:"12s"})}>balance: 127,849 | USD</span>
          <span className="cm-f3" style={m({ position:"absolute",left:"88%",bottom:"-15px",fontSize:8,color:C.w4,opacity:.08,whiteSpace:"nowrap",animationDelay:"4s"})}>sync_ok: true | 12ms</span>
          <span className="cm-f1" style={m({ position:"absolute",left:"15%",bottom:"-60px",fontSize:8,color:C.w4,opacity:.06,whiteSpace:"nowrap",animationDelay:"7s"})}>schema: v2.4.1 | validated</span>
          <span className="cm-f2" style={m({ position:"absolute",left:"65%",bottom:"-35px",fontSize:8,color:C.s,opacity:.05,whiteSpace:"nowrap",animationDelay:"1s"})}>consent: granted | purpose: sync</span>
          <span className="cm-f3" style={m({ position:"absolute",left:"48%",bottom:"-55px",fontSize:8,color:C.w4,opacity:.07,whiteSpace:"nowrap",animationDelay:"15s"})}>CM-AC-001 | passing</span>
          <span className="cm-f1" style={m({ position:"absolute",left:"3%",bottom:"-45px",fontSize:8,color:C.w4,opacity:.09,whiteSpace:"nowrap",animationDelay:"10s"})}>currency: "USD" | institution_id</span>
        </div>
      </div>

      {/* ═══ SCROLLING CONTENT ═══ */}
      <div ref={r} style={{ position: "relative", zIndex: 1, fontFamily: F.b }}>

        {/* ── DARK HERO (covers wall) ── */}
        <div style={{ background: C.dk, position: "relative", overflow: "hidden" }}>
          <div className="cm-scan" style={{ position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,rgba(79,109,122,.25),transparent)`,pointerEvents:"none",zIndex:3 }}/>
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.03,pointerEvents:"none" }}>
            <defs><pattern id="dg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0L0 0 0 40" fill="none" stroke={C.s} strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dg)"/>
          </svg>
          <svg className="cm-topo" style={{ position:"absolute",inset:0,width:"110%",left:"-5%",height:"100%",pointerEvents:"none",opacity:.05 }} viewBox="0 0 1600 400" preserveAspectRatio="none">
            {[100,180,260,340].map((y,i)=>(<path key={i} d={`M-100 ${y}Q400 ${y-25} 800 ${y}T1700 ${y}`} fill="none" stroke={C.s} strokeWidth={i===1?1.2:.6}/>))}
          </svg>

          <nav style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 32px",borderBottom:`0.5px solid rgba(250,250,248,.06)`,position:"sticky",top:0,zIndex:50,background:"rgba(20,19,18,.85)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)" }}>
            <a href="/" style={{ display:"flex",alignItems:"center",gap:8,textDecoration:"none" }}><Logo dark/><span style={{ fontFamily:F.d,fontWeight:700,fontSize:15,color:C.w1 }}>ClareMesh</span></a>
            <div style={{ display:"flex",alignItems:"center",gap:24,fontSize:13 }}>
              {["Schema","Docs","Pricing","Security"].map(l=>(<a key={l} href={`/${l.toLowerCase()}`} className="cm-nl cm-nl-d" style={{ color:C.w6,textDecoration:"none" }}>{l}</a>))}
              <a href="/login" className="cm-nl cm-nl-d" style={{ color:C.w4,textDecoration:"none",fontWeight:500 }}>Sign in</a>
            </div>
          </nav>

          <div style={{ position:"relative",zIndex:2,padding:"72px 32px 64px",maxWidth:580 }}>
            <div className="cm-a1" style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
              <span className="cm-pulse" style={{ width:6,height:6,background:"#0F6E56",display:"inline-block" }}/>
              <span style={m({ fontSize:9,color:C.w6 })}>SYSTEM OPERATIONAL</span>
              <span style={m({ fontSize:9,color:C.w8 })}>|</span>
              <span style={m({ fontSize:9,color:C.w8 })}>schema v2.4.1</span>
              <span style={m({ fontSize:9,color:C.w8 })}>|</span>
              <span style={m({ fontSize:9,color:C.w8 })}>22 controls</span>
            </div>
            <p className="cm-a2" style={m({ fontSize:10,letterSpacing:2.5,color:C.s,marginBottom:12 })}>FINANCIAL DATA INFRASTRUCTURE</p>
            <div className="cm-acc" style={{ height:2,background:C.cp,width:40,marginBottom:20 }}/>
            <h1 className="cm-a3" style={{ fontFamily:F.d,fontWeight:700,fontSize:"clamp(44px,5.5vw,64px)",letterSpacing:-2,lineHeight:1.02,marginBottom:18,color:C.w }}>Clarity through<br/>connection</h1>
            <p className="cm-a4" style={{ fontSize:15,lineHeight:1.7,color:C.w4,maxWidth:400,marginBottom:28 }}>An open-source financial data schema and bi-directional sync SDK. Runs on your infrastructure. Your data never leaves.</p>
            <div className="cm-a5" style={{ background:C.dk2,border:bdd,padding:"14px 16px",marginBottom:24 }}>
              <div style={m({ fontSize:9,color:C.w8,marginBottom:6 })}>~/claremesh</div>
              <div style={m({ fontSize:12,color:C.w1 })}><span style={{ color:C.s }}>$</span> npm install @claremesh/schema @claremesh/transforms<span className="cm-blink" style={{ display:"inline-block",width:7,height:13,background:C.s,marginLeft:3,verticalAlign:"text-bottom" }}/></div>
            </div>
            <div className="cm-a5" style={{ display:"flex",gap:10 }}>
              <a href="/signup" className="cm-bp" style={{ padding:"13px 28px",fontSize:13,fontWeight:500,color:C.dk,background:C.w,textDecoration:"none" }}>Get started free</a>
              <a href="/docs" style={{ padding:"13px 28px",fontSize:13,fontWeight:500,color:C.w6,border:`0.5px solid ${C.w8}`,textDecoration:"none" }}>View schema</a>
            </div>
          </div>
        </div>

        {/* Wall gap (fixed bg visible) */}
        {gap}

        {/* ── FEATURES ── */}
        <div style={panel}><div style={{ borderTop:bd }}/>
          <section className="cm-rv cm-sg" style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr" }}>
            {[
              {l:"[ SCHEMA ]",t:"Unified object model",d:"Account, Transaction, Entity, Balance, Forecast. Published, versioned, MIT-licensed. TypeScript and Python types."},
              {l:"[ TRANSFORMS ]",t:"Normalize anything",d:"Plaid, Stripe, QuickBooks, Xero, NetSuite, CSV. Raw API response in, clean schema out. One function call."},
              {l:"[ SYNC ]",t:"Bi-directional sync",d:"Diff-based change detection, configurable conflict resolution, immutable append-only audit trail."},
              {l:"[ COMPLIANCE ]",t:"22 controls built in",d:"SOC 2, GDPR, CCPA, PCI, SOX. Readiness dashboard. Automatic enforcement on deploy."},
              {l:"[ INFRA ]",t:"Runs on your stack",d:"Deploy on Supabase, Vercel, or Cloudflare. Your data never touches our servers. Zero-access architecture."},
              {l:"[ METERED ]",t:"Usage-based pricing",d:"Open tier free forever. Build at $199/mo. Scale at $799/mo. Overage billed, never throttled."},
            ].map((f,i)=>(<div key={i} className="cm-cell" style={{ padding:32,borderRight:(i+1)%3!==0?bd:"none",borderBottom:i<3?bd:"none" }}>
              <p style={m({ fontSize:11,color:C.s,marginBottom:12 })}>{f.l}</p>
              <p style={{ fontSize:15,fontWeight:600,marginBottom:8,fontFamily:F.d }}>{f.t}</p>
              <p style={{ fontSize:13,color:C.w6,lineHeight:1.7 }}>{f.d}</p>
            </div>))}
          </section>
        </div>

        {gap}

        {/* ── ARCHITECTURE ── */}
        <div style={panel}>
          <section className="cm-rv" style={{ borderTop:bd,borderBottom:bd,padding:"64px 32px" }}>
            <div style={{ maxWidth:720,margin:"0 auto" }}>
              <p style={m({ fontSize:10,letterSpacing:2.5,color:C.w4,textAlign:"center",marginBottom:8 })}>HOW IT WORKS</p>
              <h2 style={{ fontFamily:F.d,fontWeight:700,fontSize:28,textAlign:"center",letterSpacing:-.5,marginBottom:12 }}>Connect once. Normalize everything. Sync everywhere.</h2>
              <p style={{ fontSize:14,color:C.w6,textAlign:"center",maxWidth:460,margin:"0 auto 40px",lineHeight:1.7 }}>Raw financial data from any source flows through three layers and emerges as a unified, validated, sync-ready object model.</p>
              <div style={{ display:"flex",justifyContent:"center",gap:8,marginBottom:28,flexWrap:"wrap" }}>
                {["Plaid","Stripe","QuickBooks","Xero","NetSuite","CSV"].map(s=>(<span key={s} style={m({ fontSize:11,padding:"8px 16px",border:bd,color:C.w6,background:C.w5 })}>{s}</span>))}
              </div>
              <div style={{ textAlign:"center",color:C.w2,fontSize:18,margin:"4px 0" }}>&#8595;</div>
              <div style={{ display:"flex",flexDirection:"column",gap:6,margin:"8px 0" }}>
                {[{n:"Transform",p:"@claremesh/transforms",c:"#0F6E56",bg:"#E1F5EE"},{n:"Schema",p:"@claremesh/schema",c:"#534AB7",bg:"#EEEDFE"},{n:"Sync",p:"@claremesh/sync",c:"#993C1D",bg:"#FAECE7"}].map(l=>(
                  <div key={l.n} className="cm-layer" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 24px",background:l.bg,borderLeft:`3px solid ${l.c}` }}>
                    <span style={{ fontFamily:F.d,fontWeight:700,fontSize:15,color:l.c }}>{l.n}</span>
                    <span style={m({ fontSize:10,color:l.c,opacity:.4 })}>{l.p}</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign:"center",color:C.w2,fontSize:18,margin:"4px 0" }}>&#8595;</div>
              <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:8,flexWrap:"wrap" }}>
                {["Your treasury app","Your FP&A platform","Your close system"].map(s=>(<span key={s} style={m({ fontSize:11,padding:"8px 16px",border:bd,color:C.w6,background:C.w5 })}>{s}</span>))}
              </div>
            </div>
          </section>
        </div>

        {gap}

        {/* ── SUITE ── */}
        <div style={panel}>
          <section className="cm-rv">
            <div style={{ padding:"56px 32px 16px",textAlign:"center",borderTop:bd }}>
              <p style={m({ fontSize:10,letterSpacing:2.5,color:C.w4,textAlign:"center",marginBottom:8 })}>SUITE INTEGRATION</p>
              <h2 style={{ fontFamily:F.d,fontWeight:700,fontSize:28,textAlign:"center",letterSpacing:-.5,marginBottom:12 }}>One pipe. Three products.</h2>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderTop:bd,borderBottom:bd }}>
              {[{n:"Vaultline",ro:"Treasury",rd:"Cash, balances, projections",wr:"Alert rules, scenarios",bc:"#00A3B4"},{n:"Castford",ro:"FP&A",rd:"P&L, variance, budgets",wr:"Forecasts, board packages",bc:"#3B6FA0"},{n:"Ashford Ledger",ro:"Month-end close",rd:"GL, transactions, entities",wr:"Reconciliation, journal entries",bc:"#7B5EA7"}].map((p,i)=>(
                <div key={i} className="cm-cell" style={{ padding:32,borderRight:i<2?bd:"none",borderLeft:`2px solid ${p.bc}` }}>
                  <p style={{ fontFamily:F.d,fontWeight:700,fontSize:15,marginBottom:2 }}>{p.n}</p>
                  <p style={m({ fontSize:10,color:C.s,marginBottom:16 })}>{p.ro}</p>
                  <p style={{ fontSize:12,color:C.w6,marginBottom:6 }}><span style={m({ fontSize:10,color:C.w4,marginRight:6 })}>READS</span>{p.rd}</p>
                  <p style={{ fontSize:12,color:C.w6 }}><span style={m({ fontSize:10,color:C.w4,marginRight:6 })}>WRITES</span>{p.wr}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {gap}

        {/* ── CODE ── */}
        <div style={panel}>
          <section className="cm-rv" style={{ borderTop:bd,borderBottom:bd,padding:"64px 32px" }}>
            <div style={{ maxWidth:720,margin:"0 auto" }}>
              <p style={m({ fontSize:10,letterSpacing:2.5,color:C.w4,textAlign:"center",marginBottom:8 })}>DEVELOPER EXPERIENCE</p>
              <h2 style={{ fontFamily:F.d,fontWeight:700,fontSize:28,textAlign:"center",letterSpacing:-.5,marginBottom:36 }}>Normalized data in four lines</h2>
              <div style={{ border:bd,overflow:"hidden" }}>
                <div style={{ display:"flex",borderBottom:bd,background:C.w5 }}>
                  <span style={m({ fontSize:10,color:C.w4,padding:"10px 16px",borderRight:bd })}>terminal</span>
                  <span style={m({ fontSize:10,color:C.w8,padding:"10px 16px",borderBottom:`1.5px solid ${C.s}`,marginBottom:-1 })}>transform.ts</span>
                  <span style={m({ fontSize:10,color:C.w4,padding:"10px 16px" })}>output.json</span>
                </div>
                <div style={m({ fontSize:13,lineHeight:2.0,padding:"24px 28px",overflowX:"auto" })}>
                  <div><span style={{ color:"#185FA5" }}>import</span>{" { transformPlaidAccount } "}<span style={{ color:"#185FA5" }}>from</span> <span style={{ color:"#0F6E56" }}>&apos;@claremesh/transforms/plaid&apos;</span>;</div>
                  <div><span style={{ color:"#185FA5" }}>import type</span>{" { Account } "}<span style={{ color:"#185FA5" }}>from</span> <span style={{ color:"#0F6E56" }}>&apos;@claremesh/schema&apos;</span>;</div>
                  <br/>
                  <div style={{ color:C.w4 }}>{"//"} Raw Plaid response {"\u2192"} normalized ClareMesh Account</div>
                  <div><span style={{ color:"#185FA5" }}>const</span> account: <span style={{ color:"#534AB7" }}>Account</span> = transformPlaidAccount(plaidData, {"{"}</div>
                  <div style={{ paddingLeft:24 }}>org_id: <span style={{ color:"#0F6E56" }}>&apos;org_d8afc85d&apos;</span>,</div>
                  <div style={{ paddingLeft:24 }}>entity_id: <span style={{ color:"#0F6E56" }}>&apos;ent_acme_01&apos;</span>,</div>
                  <div>{"}"});</div>
                </div>
              </div>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:16 }}>
                <p style={m({ fontSize:11,color:C.w4 })}>12ms per transform. Schema v2.4.1 validated. Zero data egress.</p>
                <a href="/docs" style={{ fontSize:12,color:C.s,fontWeight:500,textDecoration:"none" }}>Read the docs &#8594;</a>
              </div>
            </div>
          </section>
        </div>

        {gap}

        {/* ── PRICING ── */}
        <div style={panel}>
          <section className="cm-rv">
            <div style={{ padding:"56px 32px 12px",textAlign:"center",borderTop:bd }}>
              <p style={m({ fontSize:10,letterSpacing:2.5,color:C.w4,textAlign:"center",marginBottom:8 })}>PRICING</p>
              <h2 style={{ fontFamily:F.d,fontWeight:700,fontSize:28,textAlign:"center",letterSpacing:-.5,marginBottom:36 }}>Simple, usage-based pricing</h2>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",borderTop:bd,borderBottom:bd }}>
              {[
                {t:"OPEN",n:"Open",p:"$0",su:"free forever",fs:["Schema + types","JSON validation","MIT licensed"],ct:"npm install",pr:false,po:false},
                {t:"BUILD",n:"Build",p:"$199",su:"/month + usage",fs:["5 connectors","50K transforms/mo","4 compliance controls"],ct:"Start building",pr:false,po:false},
                {t:"SCALE",n:"Scale",p:"$799",su:"/month + usage",fs:["Unlimited connectors","Bi-directional sync","14 compliance controls"],ct:"Start scaling",pr:true,po:true},
                {t:"ENTERPRISE",n:"Enterprise",p:"Custom",su:"annual contract",fs:["Dedicated sync infra","SOC 2 Type II","All 22 controls"],ct:"Contact sales",pr:false,po:false},
              ].map((t,i)=>(
                <div key={i} className="cm-pc" style={{ padding:32,display:"flex",flexDirection:"column",borderRight:i<3?bd:"none",...(t.po?{borderLeft:`2px solid ${C.s2}`,borderRight:`2px solid ${C.s2}`,margin:"0 -1px",position:"relative" as const,zIndex:1}:{}) }}>
                  {t.po&&<span style={m({ fontSize:9,letterSpacing:1.5,color:C.s,marginBottom:8 })}>RECOMMENDED</span>}
                  <span style={m({ fontSize:9,letterSpacing:1.5,color:C.w4,marginBottom:8 })}>{t.t}</span>
                  <span style={{ fontSize:15,fontWeight:600,marginBottom:4,fontFamily:F.d }}>{t.n}</span>
                  <span style={m({ fontSize:36,fontWeight:500,marginBottom:2,lineHeight:1 })}>{t.p}</span>
                  <span style={m({ fontSize:11,color:C.w4,marginBottom:24 })}>{t.su}</span>
                  <div style={{ display:"flex",flexDirection:"column",gap:8,flex:1 }}>
                    {t.fs.map(f=>(<p key={f} style={{ fontSize:12,color:C.w6,paddingLeft:12,borderLeft:`1.5px solid ${C.w2}` }}>{f}</p>))}
                  </div>
                  <a href={t.t==="ENTERPRISE"?"/contact":"/signup"} className={t.pr?"cm-bp":"cm-bg"} style={{ display:"block",textAlign:"center",padding:14,marginTop:32,fontSize:13,fontWeight:500,textDecoration:"none",background:t.pr?C.s2:C.w5,color:t.pr?"#fff":C.w8,border:t.pr?"none":bd,...(t.pr?{boxShadow:"0 1px 3px rgba(0,0,0,.1)"}:{}) }}>{t.ct}</a>
                </div>
              ))}
            </div>
          </section>
        </div>

        {gap}

        {/* ── DARK COMPLIANCE (covers wall) ── */}
        <div style={{ background:C.dk,padding:"64px 32px",color:C.w1,position:"relative",zIndex:2 }}>
          <div className="cm-rv" style={{ maxWidth:600,margin:"0 auto",textAlign:"center" }}>
            <p style={m({ fontSize:10,letterSpacing:2.5,color:C.s,marginBottom:8 })}>COMPLIANCE</p>
            <h2 style={{ fontFamily:F.d,fontWeight:700,fontSize:28,letterSpacing:-.5,marginBottom:14,color:C.w }}>22 controls. Zero egress.</h2>
            <p style={{ fontSize:14,color:C.w6,lineHeight:1.7,marginBottom:32,maxWidth:440,display:"inline-block" }}>Your data never touches our servers. Every control enforced at the edge function and RLS layer on your own Supabase instance.</p>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:0,marginBottom:28 }}>
              {[{f:"SOC 2",ct:"8",c:"#4F6D7A"},{f:"GDPR",ct:"6",c:"#0F6E56"},{f:"CCPA",ct:"4",c:"#854F0B"},{f:"PCI",ct:"2",c:"#534AB7"},{f:"SOX",ct:"2",c:"#993C1D"}].map((fw,i)=>(
                <div key={i} style={{ padding:"16px 8px",textAlign:"center",border:bdd,borderLeft:i===0?bdd:"none" }}>
                  <div style={m({ fontSize:12,fontWeight:500,color:C.w1,marginBottom:3 })}>{fw.f}</div>
                  <div style={m({ fontSize:9,color:fw.c })}>{fw.ct} controls</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <a href="/security" className="cm-bp" style={{ padding:"13px 28px",fontSize:13,fontWeight:500,color:C.dk,background:C.w,textDecoration:"none" }}>Security details</a>
              <a href="/docs/compliance" style={{ padding:"13px 28px",fontSize:13,fontWeight:500,color:C.w6,border:`0.5px solid ${C.w8}`,textDecoration:"none" }}>View all 22 controls</a>
            </div>
          </div>
        </div>

        {/* ── DARK FOOTER ── */}
        <footer style={{ background:C.dk,borderTop:bdd,position:"relative",zIndex:2 }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",borderBottom:bdd }}>
            {[{t:"PRODUCT",ls:["Schema","Transforms","Sync","Pricing","Changelog"]},{t:"DEVELOPERS",ls:["Documentation","API reference","Quickstart","Status"]},{t:"COMPANY",ls:["About","Blog","Security","Contact"]},{t:"LEGAL",ls:["Privacy","Terms","DPA","Sub-processors"]}].map((col,i)=>(
              <div key={i} style={{ padding:32,borderRight:i<3?bdd:"none" }}>
                <p style={m({ fontSize:10,letterSpacing:1.5,color:C.w8,marginBottom:16 })}>{col.t}</p>
                {col.ls.map(link=>(<a key={link} href="#" className="cm-fl-d" style={{ display:"block",fontSize:13,color:C.w6,textDecoration:"none",marginBottom:10 }}>{link}</a>))}
              </div>
            ))}
          </div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 32px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}><Logo dark size={14}/><span style={m({ fontSize:10,color:C.w8 })}>CLAREMESH &copy; 2026 FINANCIAL HOLDING LLC</span></div>
            <span style={m({ fontSize:10,color:C.w8 })}>Clarity through connection</span>
          </div>
        </footer>
      </div>
    </>
  );
}
