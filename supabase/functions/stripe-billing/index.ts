import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Plan code mapping from Stripe product IDs
const PRODUCT_TO_PLAN: Record<string, string> = {
  "prod_UL2UFv2kBUycky": "build",
  "prod_UL2UyNusl6fHGd": "scale",
  "prod_UL2UFoHT13TkM5": "pause",
  "prod_UL2UFUloqhatXw": "enterprise",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body = await req.text();
    const event = JSON.parse(body);

    // In production, verify Stripe signature here using the webhook secret
    // const sig = req.headers.get("stripe-signature");

    const type = event.type;
    const obj = event.data?.object;

    switch (type) {
      case "checkout.session.completed": {
        // New subscription created via Checkout
        const customerId = obj.customer;
        const subscriptionId = obj.subscription;
        const customerEmail = obj.customer_email || obj.customer_details?.email;

        if (customerEmail && subscriptionId) {
          // Look up org by email through profiles
          const { data: profile } = await supabase
            .from("profiles")
            .select("org_id")
            .eq("email", customerEmail)
            .single();

          if (profile) {
            // Get subscription to find product/plan
            // For now, update the customer and subscription IDs
            await supabase.from("organizations").update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
            }).eq("id", profile.org_id);

            await supabase.from("audit_log").insert({
              org_id: profile.org_id,
              action: "subscription_created",
              details: { customer_id: customerId, subscription_id: subscriptionId, event_type: type },
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        // Plan change, upgrade, or downgrade
        const customerId = obj.customer;
        const subscriptionId = obj.id;
        const productId = obj.items?.data?.[0]?.price?.product;
        const newPlan = PRODUCT_TO_PLAN[productId] || "open";
        const status = obj.status; // active, past_due, canceled, etc.

        // Find org by stripe_customer_id
        const { data: org } = await supabase
          .from("organizations")
          .select("id, plan")
          .eq("stripe_customer_id", customerId)
          .single();

        if (org) {
          const updates: Record<string, any> = {
            plan: status === "active" ? newPlan : org.plan,
            stripe_subscription_id: subscriptionId,
          };

          // If upgrading from open/pause to a paid plan, record first_paid_at
          if (newPlan !== "open" && newPlan !== "pause" && status === "active") {
            const { data: existing } = await supabase
              .from("organizations")
              .select("first_paid_at")
              .eq("id", org.id)
              .single();
            if (!existing?.first_paid_at) {
              updates.first_paid_at = new Date().toISOString();
            }
          }

          // If downgrading to pause, record which plan they paused from
          if (newPlan === "pause") {
            updates.paused_from_plan = org.plan;
          }

          await supabase.from("organizations").update(updates).eq("id", org.id);

          await supabase.from("audit_log").insert({
            org_id: org.id,
            action: "plan_changed",
            details: { from: org.plan, to: newPlan, status, subscription_id: subscriptionId },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        // Subscription canceled
        const customerId = obj.customer;

        const { data: org } = await supabase
          .from("organizations")
          .select("id, plan")
          .eq("stripe_customer_id", customerId)
          .single();

        if (org) {
          await supabase.from("organizations").update({
            plan: "open",
            stripe_subscription_id: null,
          }).eq("id", org.id);

          await supabase.from("audit_log").insert({
            org_id: org.id,
            action: "subscription_canceled",
            details: { previous_plan: org.plan, customer_id: customerId },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        // Payment failed — alert but don't immediately downgrade
        const customerId = obj.customer;

        const { data: org } = await supabase
          .from("organizations")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (org) {
          await supabase.from("audit_log").insert({
            org_id: org.id,
            action: "payment_failed",
            details: { invoice_id: obj.id, amount_due: obj.amount_due, attempt_count: obj.attempt_count },
          });
        }
        break;
      }

      case "invoice.paid": {
        // Successful payment
        const customerId = obj.customer;

        const { data: org } = await supabase
          .from("organizations")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (org) {
          await supabase.from("audit_log").insert({
            org_id: org.id,
            action: "payment_succeeded",
            details: { invoice_id: obj.id, amount_paid: obj.amount_paid },
          });
        }
        break;
      }

      default:
        // Unhandled event type — log but don't error
        break;
    }

    return new Response(JSON.stringify({ received: true, type }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Webhook handler error", detail: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

