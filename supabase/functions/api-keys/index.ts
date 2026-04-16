import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// ═══ CRYPTO HELPERS ═══

// Generate a cm_live_* key: 32 random bytes, base64url-encoded.
// Prefix is "cm_live_" + first 8 chars of the secret for display.
async function generateKey(): Promise<{ fullKey: string; prefix: string; hash: string }> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const secret = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const fullKey = `cm_live_${secret}`;
  const prefix = `cm_live_${secret.slice(0, 8)}`;

  // SHA-256 hash for storage
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(fullKey));
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { fullKey, prefix, hash };
}

// ═══ MAIN HANDLER ═══

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization" }, 401);

    // Authenticate the calling user via their JWT
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return json({ error: "Invalid token" }, 401);

    // Get user's org + role
    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    if (!profile) return json({ error: "No organization" }, 404);

    const url = new URL(req.url);
    const keyIdFromPath = url.pathname.split("/").filter(Boolean).pop();

    // ═══ GET /api-keys — list keys for org ═══
    if (req.method === "GET") {
      const { data: keys, error } = await supabase
        .from("api_keys")
        .select("id, name, key_prefix, key_type, scopes, last_used_at, revoked_at, expires_at, created_at")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false });

      if (error) return json({ error: error.message }, 500);
      return json({ keys: keys || [] });
    }

    // ═══ POST /api-keys — create new key ═══
    if (req.method === "POST") {
      // Only owners and admins can create keys
      if (!profile.role || !["owner", "admin"].includes(profile.role)) {
        return json({ error: "Only owners and admins can create API keys" }, 403);
      }

      const body = await req.json().catch(() => ({}));
      const name = (body.name || "Untitled key").toString().slice(0, 100);
      const scopes = Array.isArray(body.scopes) && body.scopes.length > 0
        ? body.scopes.filter((s: unknown) => typeof s === "string").slice(0, 20)
        : ["transform:read", "transform:write"];
      const expiresInDays = typeof body.expires_in_days === "number" && body.expires_in_days > 0
        ? Math.min(body.expires_in_days, 3650)
        : null;
      const expiresAt = expiresInDays
        ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
        : null;

      const { fullKey, prefix, hash } = await generateKey();

      const { data: inserted, error } = await supabase
        .from("api_keys")
        .insert({
          org_id: profile.org_id,
          key_prefix: prefix,
          key_hash: hash,
          key_type: "live",
          name,
          scopes,
          expires_at: expiresAt,
          created_by: user.id,
        })
        .select("id, name, key_prefix, scopes, expires_at, created_at")
        .single();

      if (error) return json({ error: error.message }, 500);

      // Audit log
      await supabase.from("audit_log").insert({
        org_id: profile.org_id,
        actor_id: user.id,
        action: "api_key.created",
        resource_type: "api_key",
        resource_id: inserted.id,
        metadata: { name, scopes, expires_at: expiresAt },
      });

      // The full key is returned ONCE, never again
      return json({
        ...inserted,
        key: fullKey,
        warning: "This is the only time the full key will be shown. Copy it now and store it securely.",
      }, 201);
    }

    // ═══ DELETE /api-keys/:id — revoke a key ═══
    if (req.method === "DELETE" && keyIdFromPath && keyIdFromPath !== "api-keys") {
      if (!profile.role || !["owner", "admin"].includes(profile.role)) {
        return json({ error: "Only owners and admins can revoke API keys" }, 403);
      }

      const { data: updated, error } = await supabase
        .from("api_keys")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", keyIdFromPath)
        .eq("org_id", profile.org_id)
        .is("revoked_at", null)
        .select("id, name, key_prefix")
        .single();

      if (error || !updated) return json({ error: "Key not found or already revoked" }, 404);

      await supabase.from("audit_log").insert({
        org_id: profile.org_id,
        actor_id: user.id,
        action: "api_key.revoked",
        resource_type: "api_key",
        resource_id: updated.id,
        metadata: { name: updated.name, key_prefix: updated.key_prefix },
      });

      return json({ revoked: true, id: updated.id });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (err) {
    return json({ error: "Internal error", detail: String(err) }, 500);
  }
});
