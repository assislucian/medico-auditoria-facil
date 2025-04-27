
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { fileId, metadata } = await req.json();
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify file exists
    const { data: fileData, error: fileError } = await supabaseClient
      .storage
      .from("uploads")
      .list("", { sortBy: { column: "name", order: "asc" }, search: fileId });

    if (fileError || !fileData || fileData.length === 0) {
      return new Response(JSON.stringify({ error: "File not found", details: fileError }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get user info
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError) {
      return new Response(JSON.stringify({ error: "Failed to get user info", details: userError }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Parse the payment data
    const paymentData = metadata.payments || [];
    
    // Create demonstrativo records for each payment entry
    const demonstrativoRecords = paymentData.map(payment => ({
      guide_number: payment.guideNumber || metadata.guideNumber || `GUIDE-${Date.now()}`,
      codigo: payment.codigo,
      doctor_crm: payment.doctorCrm || user.user_metadata?.crm || "Unknown",
      papel: payment.papel || "Cirurgião",
      qtd: payment.quantidade || 1,
      valor_pago: payment.valorPago || 0
    }));

    // Insert all records
    const { data: demonstrativos, error: demonstrativoError } = await supabaseClient
      .from("demonstrativos")
      .insert(demonstrativoRecords)
      .select();

    if (demonstrativoError) {
      return new Response(JSON.stringify({ error: "Failed to create demonstrativo records", details: demonstrativoError }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Update upload record status
    await supabaseClient
      .from("uploads")
      .update({ status: "processado" })
      .eq("file_path", fileId);

    // Log the activity
    await supabaseClient
      .from("activity_logs")
      .insert({
        user_id: user.id,
        action_type: "upload",
        entity_type: "demonstrativo",
        entity_id: demonstrativos[0]?.id || "multiple",
        description: `Uploaded demonstrativo with ${demonstrativoRecords.length} payment entries`
      });

    return new Response(JSON.stringify({
      success: true,
      demonstrativoCount: demonstrativoRecords.length,
      message: "Demonstrative uploaded and processed successfully"
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing demonstrative upload:", error);
    return new Response(JSON.stringify({ error: "Internal error", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
