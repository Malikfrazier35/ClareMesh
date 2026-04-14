import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const url = new URL(req.url);
    const version = url.searchParams.get("version");

    let query = supabase.from("schema_versions").select("*").order("published_at", { ascending: false });

    if (version) {
      query = query.eq("version", version);
    }

    const { data, error } = await query.limit(1).single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: "Schema version not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      version: data.version,
      published_at: data.published_at,
      deprecated_at: data.deprecated_at,
      schema: data.schema_json,
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
        "X-ClareMesh-Schema": data.version,
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Schema registry error", detail: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

