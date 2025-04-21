
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface License {
  crm: string;
  active: boolean;
  expires_at: string | null;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Extract Bearer token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: missing Authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");

    // Get user metadata with JWT claims, including crm and role
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized: invalid token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Extract CRM and role from user's raw user metadata or token claims
    const userMetadata = user.user_metadata || {};
    const crm = (userMetadata.crm as string) || "";
    const role = (userMetadata.role as string) || "";

    if (!crm || !role) {
      return new Response(JSON.stringify({ error: "Unauthorized: missing crm or role in token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Check licenses table for active license of given crm
    const licenseQuery = await supabase
      .from<License>("licenses")
      .select("crm, active, expires_at")
      .eq("crm", crm)
      .eq("active", true)
      .lte("expires_at", new Date().toISOString())
      .maybeSingle();

    if (!licenseQuery.data || licenseQuery.error) {
      return new Response(JSON.stringify({ error: "Licença inativa ou não encontrada" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }
    // At this point license is active

    // Get analysisId from query param since this is the generate-compare function
    const url = new URL(req.url);
    const analysisId = url.searchParams.get("analysisId");
    if (!analysisId) {
      return new Response(JSON.stringify({ error: "Missing analysis ID" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Confirm analysis belongs to same crm in analyses table
    const { data: analysisData, error: analysisError } = await supabase
      .from("analysis_results")
      .select("crm")
      .eq("id", analysisId)
      .single();

    if (analysisError || analysisData.crm !== crm) {
      return new Response(JSON.stringify({ error: "Análise não encontrada ou acesso negado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Fetch procedures (procedure_results) linked to analysis and filter by role and honorarios, ignoring consultas
    const { data: procedures, error: proceduresError } = await supabase
      .from("procedure_results")
      .select("*")
      .eq("analysis_id", analysisId)
      .eq("papel", role)
      .not("codigo", "in", ["CONSULTA", "CONSULTORIA", "CONS"]) // ignoring consults by code name
      .gte("valor_cbhpm", 0);

    if (proceduresError) {
      console.error("Error fetching procedures:", proceduresError);
      return new Response(JSON.stringify({ error: "Erro interno ao buscar procedimentos" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (!procedures || procedures.length === 0) {
      // Return zero for total honorarios if no data
      return new Response(
        JSON.stringify({
          total_honorarios: 0,
          details: [],
          summary: { total: 0 },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Calculate total honorarios applying role specific logic
    let totalHonorarios = 0;

    procedures.forEach((proc) => {
      const valor = proc.valor_cbhpm || 0;
      if (role === "primeiro_auxiliar") {
        totalHonorarios += valor * 0.3;
      } else {
        totalHonorarios += valor;
      }
    });

    // Form response data including total and detail lines
    const responseData = {
      total_honorarios: totalHonorarios,
      details: procedures,
      summary: { total: totalHonorarios },
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in generate-compare function:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
