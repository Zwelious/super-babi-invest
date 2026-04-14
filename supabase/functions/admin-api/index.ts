import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminPassword = "Password123";
    const authHeader = req.headers.get("x-admin-password");
    if (authHeader !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, ...params } = await req.json();

    switch (action) {
      case "get_members": {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "approve_member": {
        const { error } = await supabase.from("profiles").update({ status: "approved" }).eq("id", params.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "reject_member": {
        const { error } = await supabase.from("profiles").update({ status: "rejected" }).eq("id", params.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "get_deposits": {
        const { data, error } = await supabase
          .from("deposits")
          .select("*, profiles!deposits_user_id_fkey(full_name)")
          .order("created_at", { ascending: false });
        // If join fails, try without
        if (error) {
          const { data: d2, error: e2 } = await supabase.from("deposits").select("*").order("created_at", { ascending: false });
          if (e2) throw e2;
          // Get profiles separately
          const userIds = [...new Set(d2.map((d: any) => d.user_id))];
          const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
          const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.user_id, p.full_name]));
          const enriched = d2.map((d: any) => ({ ...d, member_name: profileMap[d.user_id] || "Unknown" }));
          return new Response(JSON.stringify(enriched), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const enriched = data.map((d: any) => ({ ...d, member_name: d.profiles?.full_name || "Unknown" }));
        return new Response(JSON.stringify(enriched), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "approve_deposit": {
        const { error } = await supabase.from("deposits").update({ status: "approved" }).eq("id", params.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "reject_deposit": {
        const { error } = await supabase.from("deposits").update({ status: "rejected" }).eq("id", params.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "activate_investment": {
        const { deposit_id, user_id, amount, activation_date } = params;
        const actDate = new Date(activation_date);
        const mat6 = new Date(actDate);
        mat6.setMonth(mat6.getMonth() + 6);
        const mat12 = new Date(actDate);
        mat12.setMonth(mat12.getMonth() + 12);

        // Get current rate
        const { data: rates } = await supabase.from("master_rates").select("rate").order("effective_date", { ascending: false }).limit(1);
        const rate = rates?.[0]?.rate || 30;
        const return6 = amount * (rate / 200);
        const return12 = amount * (rate / 100);

        const { error } = await supabase.from("investments").insert({
          user_id,
          deposit_id,
          amount,
          activation_date,
          maturity_6_date: mat6.toISOString().split("T")[0],
          maturity_12_date: mat12.toISOString().split("T")[0],
          return_6: return6,
          return_12: return12,
        });
        if (error) throw error;

        // Update deposit status
        await supabase.from("deposits").update({ status: "activated" }).eq("id", deposit_id);

        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "get_investments": {
        const { data, error } = await supabase.from("investments").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        const userIds = [...new Set(data.map((d: any) => d.user_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
        const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.user_id, p.full_name]));
        const enriched = data.map((d: any) => ({ ...d, member_name: profileMap[d.user_id] || "Unknown" }));
        return new Response(JSON.stringify(enriched), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "get_rates": {
        const { data, error } = await supabase.from("master_rates").select("*").order("effective_date", { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "add_rate": {
        const { error } = await supabase.from("master_rates").insert({ rate: params.rate, effective_date: params.effective_date });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "get_disbursements": {
        const { data, error } = await supabase.from("disbursements").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        const userIds = [...new Set(data.map((d: any) => d.user_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
        const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.user_id, p.full_name]));
        const enriched = data.map((d: any) => ({ ...d, member_name: profileMap[d.user_id] || "Unknown" }));
        return new Response(JSON.stringify(enriched), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "add_disbursement": {
        const { error } = await supabase.from("disbursements").insert({
          user_id: params.user_id,
          investment_id: params.investment_id,
          amount: params.amount,
          type: params.type,
          disbursement_date: params.disbursement_date,
        });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "send_notification": {
        const { error } = await supabase.from("notifications").insert({
          user_id: params.user_id,
          title: params.title,
          message: params.message,
          type: params.type || "general",
        });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "get_notifications": {
        const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        const userIds = [...new Set(data.map((d: any) => d.user_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
        const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.user_id, p.full_name]));
        const enriched = data.map((d: any) => ({ ...d, member_name: profileMap[d.user_id] || "Unknown" }));
        return new Response(JSON.stringify(enriched), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "get_deposit_chart": {
        const { data, error } = await supabase.from("deposits").select("deposit_date, amount").order("deposit_date");
        if (error) throw error;
        // Aggregate by month
        const monthMap: Record<string, number> = {};
        (data || []).forEach((d: any) => {
          const m = d.deposit_date.substring(0, 7); // YYYY-MM
          monthMap[m] = (monthMap[m] || 0) + Number(d.amount);
        });
        const chartData = Object.entries(monthMap).map(([month, amount]) => ({ month, amount }));
        return new Response(JSON.stringify(chartData), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
