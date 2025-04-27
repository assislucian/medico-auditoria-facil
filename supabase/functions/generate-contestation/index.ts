
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
    const { participationIds } = await req.json();
    
    if (!participationIds || !Array.isArray(participationIds) || participationIds.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid participation IDs" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
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

    // Get user info
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError) {
      return new Response(JSON.stringify({ error: "Failed to get user info", details: userError }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Fetch all participation data
    const { data: participations, error: participationsError } = await supabaseClient
      .from("v_payment_audit")
      .select("*")
      .in("participation_id", participationIds);
      
    if (participationsError) {
      return new Response(JSON.stringify({ error: "Failed to fetch participation data", details: participationsError }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    if (!participations || participations.length === 0) {
      return new Response(JSON.stringify({ error: "No participation data found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Group by guide number
    const guideGroups = participations.reduce((acc, part) => {
      if (!acc[part.guide_number]) {
        acc[part.guide_number] = [];
      }
      acc[part.guide_number].push(part);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Create contestation records
    const contestationPromises = participationIds.map(async (partId) => {
      const participation = participations.find(p => p.participation_id === partId);
      if (!participation) return null;
      
      // Get standard response for this type of contestation
      const { data: standardResponse } = await supabaseClient
        .from("standard_responses")
        .select("response_text")
        .eq("reason_type", "underpaid")
        .single();
        
      const responseText = standardResponse?.response_text || 
        `Contestamos o valor pago referente ao procedimento ${participation.codigo} - ${participation.procedimento} ` +
        `que deveria ter sido pago no valor de ${participation.expected_value.toFixed(2)} conforme tabela CBHPM vigente, ` +
        `mas foi pago apenas ${participation.valor_pago.toFixed(2)}, gerando uma diferença de ${Math.abs(participation.difference).toFixed(2)}.`;
      
      return supabaseClient
        .from("contestations")
        .insert({
          participation_id: partId,
          reason_type: "underpaid",
          response_text: responseText,
          status: "pending"
        });
    });
    
    await Promise.all(contestationPromises);
    
    // Generate document URL (simulated)
    const documentUrl = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/reports/contestation-${Date.now()}.pdf`;
    
    // Log activity
    await supabaseClient
      .from("activity_logs")
      .insert({
        user_id: user.id,
        action_type: "contestation",
        entity_type: "contestation",
        entity_id: participationIds[0], // Use first participation as reference
        description: `Generated contestation for ${participationIds.length} procedures`
      });
    
    return new Response(JSON.stringify({
      success: true,
      message: `Contestação gerada para ${participationIds.length} procedimentos`,
      documentUrl,
      contestedCount: participationIds.length
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error generating contestation:", error);
    return new Response(JSON.stringify({ error: "Internal error", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
