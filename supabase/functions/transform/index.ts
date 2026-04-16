import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ═══ PROVIDER TRANSFORMS ═══

function transformPlaidTransaction(raw: any): any {
  return {
    id: crypto.randomUUID(),
    provider_id: raw.transaction_id || raw.id,
    account_id: raw.account_id,
    date: raw.date ? new Date(raw.date).toISOString() : new Date().toISOString(),
    // Plaid: positive = outflow. ClareMesh: positive = inflow. Flip sign.
    amount: typeof raw.amount === "number" ? -raw.amount : 0,
    currency: (raw.iso_currency_code || raw.unofficial_currency_code || "USD").toUpperCase(),
    description: raw.merchant_name || raw.name || raw.original_description || "Unknown",
    category: Array.isArray(raw.category) ? raw.category : [],
    pending: raw.pending === true,
    metadata: { provider: "plaid", raw_id: raw.transaction_id, payment_channel: raw.payment_channel, location: raw.location },
  };
}

function transformStripeTransaction(raw: any): any {
  return {
    id: crypto.randomUUID(),
    provider_id: raw.id,
    account_id: raw.source?.id || raw.balance_transaction || "stripe_default",
    date: raw.created ? new Date(raw.created * 1000).toISOString() : new Date().toISOString(),
    // Stripe: amounts in cents. Convert to decimal.
    amount: typeof raw.amount === "number" ? raw.amount / 100 : 0,
    currency: (raw.currency || "usd").toUpperCase(),
    description: raw.description || raw.statement_descriptor || `${raw.type || "charge"}`,
    category: raw.type ? [raw.type === "charge" ? "Revenue" : raw.type === "refund" ? "Revenue/Refund" : raw.type] : [],
    pending: raw.status === "pending",
    metadata: { provider: "stripe", type: raw.type, status: raw.status, fee: raw.fee ? raw.fee / 100 : 0 },
  };
}

function transformQuickBooksTransaction(raw: any): any[] {
  // QB JournalEntry: each Line becomes a separate Transaction
  if (raw.Line && Array.isArray(raw.Line)) {
    return raw.Line.filter((l: any) => l.DetailType === "JournalEntryLineDetail").map((line: any) => ({
      id: crypto.randomUUID(),
      provider_id: `${raw.Id}_${line.Id || line.LineNum || 0}`,
      account_id: line.JournalEntryLineDetail?.AccountRef?.value || "unknown",
      date: raw.TxnDate ? new Date(raw.TxnDate).toISOString() : new Date().toISOString(),
      // QB: Debit = positive, Credit = negative
      amount: line.JournalEntryLineDetail?.PostingType === "Debit" ? Math.abs(line.Amount || 0) : -(Math.abs(line.Amount || 0)),
      currency: (raw.CurrencyRef?.value || "USD").toUpperCase(),
      description: line.Description || raw.DocNumber || "Journal Entry",
      category: ["Journal Entry"],
      pending: false,
      metadata: { provider: "quickbooks", doc_number: raw.DocNumber, line_num: line.LineNum },
    }));
  }
  // Single transaction (Invoice, Bill, etc.)
  return [{
    id: crypto.randomUUID(),
    provider_id: raw.Id || raw.id,
    account_id: raw.AccountRef?.value || raw.account_id || "unknown",
    date: raw.TxnDate ? new Date(raw.TxnDate).toISOString() : new Date().toISOString(),
    amount: typeof raw.TotalAmt === "number" ? raw.TotalAmt : (typeof raw.Amount === "number" ? raw.Amount : 0),
    currency: (raw.CurrencyRef?.value || "USD").toUpperCase(),
    description: raw.DocNumber || raw.PrivateNote || "QuickBooks Transaction",
    category: [],
    pending: false,
    metadata: { provider: "quickbooks", type: raw.Type || raw.type, doc_number: raw.DocNumber },
  }];
}

function transformXeroTransaction(raw: any): any {
  // Xero date format: "/Date(1234567890000+0000)/" or ISO string
  let date = new Date().toISOString();
  if (raw.Date) {
    const match = String(raw.Date).match(/\/Date\((\d+)/);
    date = match ? new Date(parseInt(match[1])).toISOString() : new Date(raw.Date).toISOString();
  }
  return {
    id: crypto.randomUUID(),
    provider_id: raw.BankTransactionID || raw.TransactionID || raw.id,
    account_id: raw.BankAccount?.AccountID || raw.AccountID || "unknown",
    date,
    amount: typeof raw.Total === "number" ? raw.Total : (typeof raw.SubTotal === "number" ? raw.SubTotal : 0),
    currency: (raw.CurrencyCode || "USD").toUpperCase(),
    description: raw.Reference || raw.Contact?.Name || "Xero Transaction",
    category: raw.Type ? [raw.Type] : [],
    pending: raw.Status === "AUTHORISED",
    metadata: { provider: "xero", type: raw.Type, status: raw.Status, contact: raw.Contact?.Name },
  };
}

function transformCSVRow(raw: any): any {
  return {
    id: crypto.randomUUID(),
    provider_id: raw.id || raw.transaction_id || raw.ref || crypto.randomUUID(),
    account_id: raw.account_id || raw.account || "csv_default",
    date: raw.date ? new Date(raw.date).toISOString() : new Date().toISOString(),
    amount: typeof raw.amount === "number" ? raw.amount : parseFloat(raw.amount) || 0,
    currency: (raw.currency || "USD").toUpperCase(),
    description: raw.description || raw.memo || raw.name || "CSV Import",
    category: raw.category ? (Array.isArray(raw.category) ? raw.category : [raw.category]) : [],
    pending: raw.pending === true || raw.pending === "true",
    metadata: { provider: "csv" },
  };
}

// ═══ AUTH: accept both Supabase JWTs and cm_* API keys ═══

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function resolveAuth(authHeader: string): Promise<
  | { ok: true; org_id: string; user_id: string | null; auth_method: "jwt" | "api_key"; scopes: string[] }
  | { ok: false; status: number; error: string }
> {
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  // cm_* API key path — lookup via service_role + verify_api_key RPC
  if (token.startsWith("cm_live_") || token.startsWith("cm_test_")) {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const hash = await sha256Hex(token);
    const { data, error } = await admin.rpc("verify_api_key", { p_key_hash: hash });
    if (error || !data || data.length === 0) {
      return { ok: false, status: 401, error: "Invalid or revoked API key" };
    }
    const row = data[0];
    const scopes = (row.scopes || []) as string[];
    if (!scopes.includes("transform:write")) {
      return { ok: false, status: 403, error: "API key missing required scope: transform:write" };
    }
    return { ok: true, org_id: row.org_id, user_id: null, auth_method: "api_key", scopes };
  }

  // JWT path — use the user's token
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { ok: false, status: 401, error: "Invalid token" };

  const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
  if (!profile) return { ok: false, status: 404, error: "No organization found" };

  return { ok: true, org_id: profile.org_id, user_id: user.id, auth_method: "jwt", scopes: ["*"] };
}

// ═══ MAIN HANDLER ═══

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = performance.now();

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Missing authorization" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const auth = await resolveAuth(authHeader);
    if (!auth.ok) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Service-role client for logging (works for both auth methods)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse body
    const body = await req.json();
    const { provider, records, connector_id } = body;

    if (!provider || !records || !Array.isArray(records)) {
      return new Response(JSON.stringify({ error: "Required: provider (plaid|stripe|quickbooks|xero|csv), records (array)" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Transform
    let transformed: any[] = [];
    let errors = 0;

    for (const record of records) {
      try {
        switch (provider.toLowerCase()) {
          case "plaid":
            transformed.push(transformPlaidTransaction(record));
            break;
          case "stripe":
            transformed.push(transformStripeTransaction(record));
            break;
          case "quickbooks":
          case "qb":
            transformed.push(...transformQuickBooksTransaction(record));
            break;
          case "xero":
            transformed.push(transformXeroTransaction(record));
            break;
          case "csv":
            transformed.push(transformCSVRow(record));
            break;
          default:
            errors++;
        }
      } catch {
        errors++;
      }
    }

    const duration = Math.round(performance.now() - start);

    // Log to transform_logs using service role
    const logData = {
      org_id: auth.org_id,
      connector_id: connector_id || "00000000-0000-0000-0000-000000000000",
      source_type: provider.toLowerCase(),
      records_in: records.length,
      records_out: transformed.length,
      errors,
      duration_ms: duration,
    };

    await supabase.from("transform_logs").insert(logData);

    return new Response(JSON.stringify({
      schema_version: "1.0.0",
      provider: provider.toLowerCase(),
      records_in: records.length,
      records_out: transformed.length,
      errors,
      duration_ms: duration,
      data: transformed,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "X-ClareMesh-Schema": "1.0.0", "X-ClareMesh-Duration": `${duration}ms`, "X-ClareMesh-Auth": auth.auth_method },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Transform failed", detail: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

