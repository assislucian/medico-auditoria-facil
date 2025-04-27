
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

    // Get file URL
    const { data: { signedUrl }, error: urlError } = await supabaseClient
      .storage
      .from("uploads")
      .createSignedUrl(fileId, 60);

    if (urlError) {
      return new Response(JSON.stringify({ error: "Failed to get file URL", details: urlError }), {
        status: 500,
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

    // Create guide record
    const { data: guide, error: guideError } = await supabaseClient
      .from("guides")
      .insert({
        file_path: fileId,
        guide_number: metadata.guideNumber || `GUIDE-${Date.now()}`,
        hospital: metadata.hospital || "Unknown Hospital",
        execution_date: metadata.executionDate || new Date().toISOString().split("T")[0],
        user_id: user.id
      })
      .select()
      .single();

    if (guideError) {
      return new Response(JSON.stringify({ error: "Failed to create guide record", details: guideError }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Log the activity
    await supabaseClient
      .from("activity_logs")
      .insert({
        user_id: user.id,
        action_type: "upload",
        entity_type: "guide",
        entity_id: guide.id,
        description: `Uploaded guide ${metadata.guideNumber || "unknown"}`
      });

    return new Response(JSON.stringify({
      success: true,
      guideId: guide.id,
      message: "Guide uploaded successfully"
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing guide upload:", error);
    return new Response(JSON.stringify({ error: "Internal error", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
