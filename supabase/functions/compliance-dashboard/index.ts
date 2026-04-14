import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Missing authorization" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Get org with jurisdiction
    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile) return new Response(JSON.stringify({ error: "No organization" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: org } = await supabase.from("organizations").select("id, jurisdiction, plan").eq("id", profile.org_id).single();
    if (!org) return new Response(JSON.stringify({ error: "Organization not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Get applicable controls filtered by jurisdiction
    const { data: controls } = await supabase
      .from("compliance_control_definitions")
      .select("*")
      .contains("jurisdictions", [org.jurisdiction || "US"]);

    // Get org's control statuses
    const { data: statuses } = await supabase
      .from("compliance_controls")
      .select("*")
      .eq("org_id", org.id);

    // Merge: for each applicable control, find the org's status (or mark as "not_configured")
    const statusMap = new Map((statuses || []).map((s: any) => [s.control_id, s]));

    const merged = (controls || []).map((c: any) => {
      const status = statusMap.get(c.control_id);
      return {
        control_id: c.control_id,
        category: c.category,
        title: c.title,
        description: c.description,
        frameworks: c.frameworks,
        regulatory_refs: c.regulatory_refs,
        tier_required: c.tier_required,
        auto_enforced: c.auto_enforced,
        status: status?.status || "not_configured",
        last_evaluated_at: status?.last_evaluated_at || null,
        evidence_url: status?.evidence_url || null,
      };
    });

    const summary = {
      total: merged.length,
      passing: merged.filter((c: any) => c.status === "passing").length,
      needs_config: merged.filter((c: any) => c.status === "needs_config").length,
      not_configured: merged.filter((c: any) => c.status === "not_configured").length,
      failing: merged.filter((c: any) => c.status === "failing").length,
    };

    return new Response(JSON.stringify({
      jurisdiction: org.jurisdiction,
      plan: org.plan,
      summary,
      controls: merged,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Compliance dashboard error", detail: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

