
/**
 * Edge Function to retrieve analysis data by ID
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supabase client initialization
const supabaseUrl = 'https://yzrovzblelpnftlegczx.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401 
      });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      });
    }
    
    // Get request body
    const { analysisId } = await req.json();
    
    if (!analysisId) {
      return new Response(JSON.stringify({ error: 'Analysis ID is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // Get the analysis data
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id) // Ensure user can only access their own analyses
      .single();
    
    if (analysisError) {
      return new Response(JSON.stringify({ error: 'Analysis not found or access denied' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      });
    }
    
    // Get the procedures
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (proceduresError) {
      return new Response(JSON.stringify({ error: 'Failed to retrieve procedures' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }
    
    // Format the response
    const formattedData = {
      demonstrativoInfo: {
        numero: analysisData.numero || '',
        competencia: analysisData.competencia || '',
        hospital: analysisData.hospital || '',
        data: new Date(analysisData.created_at).toLocaleDateString('pt-BR'),
        beneficiario: proceduresData[0]?.beneficiario || ''
      },
      procedimentos: proceduresData.map((proc) => ({
        id: proc.id,
        codigo: proc.codigo,
        procedimento: proc.procedimento,
        papel: proc.papel || '',
        valorCBHPM: proc.valor_cbhpm,
        valorPago: proc.valor_pago,
        diferenca: proc.diferenca,
        pago: proc.pago,
        guia: proc.guia || '',
        beneficiario: proc.beneficiario || '',
        doctors: proc.doctors || []
      })),
      totais: {
        valorCBHPM: analysisData.summary?.totalCBHPM || 0,
        valorPago: analysisData.summary?.totalPago || 0,
        diferenca: analysisData.summary?.totalDiferenca || 0,
        procedimentosNaoPagos: analysisData.summary?.procedimentosNaoPagos || 0
      }
    };
    
    return new Response(JSON.stringify(formattedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error retrieving analysis:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'An unknown error occurred while retrieving analysis'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
