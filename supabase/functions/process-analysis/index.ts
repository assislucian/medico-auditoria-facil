
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      });
    }

    console.log('Processing analysis for user:', user.id);
    
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid JSON data'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Extract data from request
    const { uploadIds, fileTypes, crmRegistrado } = requestData;
    
    if (!uploadIds || !Array.isArray(uploadIds) || uploadIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid upload IDs' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    // Get upload records
    const { data: uploads, error: uploadsError } = await supabase
      .from('uploads')
      .select('*')
      .in('id', uploadIds);
      
    if (uploadsError) {
      console.error('Error fetching uploads:', uploadsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch uploads' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

    // Determine processing mode
    const hasGuias = fileTypes?.includes('guia') || false;
    const hasDemonstrativos = fileTypes?.includes('demonstrativo') || false;
    let processMode = 'complete';
    
    if (hasGuias && !hasDemonstrativos) {
      processMode = 'guia-only';
    } else if (!hasGuias && hasDemonstrativos) {
      processMode = 'demonstrativo-only';
    }

    console.log(`Processing ${uploads.length} files in mode: ${processMode}`);

    // Generate analysis ID
    const analysisId = crypto.randomUUID();
    
    // Process files - this would typically involve more complex logic
    // For now, we'll simulate successful processing
    try {
      // Insert analysis result
      const { data: analysisData, error: analysisError } = await supabase
        .from('analysis_results')
        .insert({
          id: analysisId,
          user_id: user.id,
          file_name: uploads.map(u => u.file_name).join(', '),
          file_type: processMode,
          hospital: 'Hospital ' + (Math.floor(Math.random() * 5) + 1),
          competencia: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
          numero: `REF-${Date.now().toString().substring(5)}`,
          summary: {
            totalPago: Math.random() * 5000 + 2000,
            totalCBHPM: Math.random() * 7000 + 3000,
            totalDiferenca: Math.random() * 2000 + 500,
            procedimentosTotal: Math.floor(Math.random() * 15) + 5,
            procedimentosNaoPagos: Math.floor(Math.random() * 5)
          }
        })
        .select('id')
        .single();
      
      if (analysisError) {
        console.error('Error creating analysis:', analysisError);
        throw new Error('Failed to create analysis record');
      }
      
      // Generate some sample procedures
      const proceduresCount = Math.floor(Math.random() * 10) + 5;
      const procedures = Array.from({ length: proceduresCount }, (_, i) => ({
        analysis_id: analysisId,
        user_id: user.id,
        codigo: `${10000 + i}`,
        procedimento: `Procedimento de teste ${i + 1}`,
        papel: Math.random() > 0.5 ? 'Auxiliar' : 'Principal',
        valor_cbhpm: Math.random() * 300 + 50,
        valor_pago: Math.random() * 200 + 40,
        diferenca: Math.random() * 100 + 10,
        pago: Math.random() > 0.3,
        guia: `GUIA-${1000 + i}`,
        beneficiario: `Paciente ${i + 1}`,
        doctors: [{ name: 'Dr. Teste', crm: crmRegistrado || '12345' }]
      }));
      
      // Insert procedures
      const { error: proceduresError } = await supabase
        .from('procedures')
        .insert(procedures);
      
      if (proceduresError) {
        console.error('Error creating procedures:', proceduresError);
        throw new Error('Failed to create procedure records');
      }
      
      // Update uploads status
      await supabase
        .from('uploads')
        .update({ status: 'processado', analysis_id: analysisId })
        .in('id', uploadIds);
      
      // Create a simulated result for the frontend
      const extractedData = {
        demonstrativoInfo: {
          numero: `REF-${Date.now().toString().substring(5)}`,
          competencia: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
          hospital: 'Hospital ' + (Math.floor(Math.random() * 5) + 1),
          data: new Date().toISOString().split('T')[0],
          beneficiario: 'Diversos'
        },
        procedimentos: procedures.map(p => ({
          id: crypto.randomUUID(),
          codigo: p.codigo,
          procedimento: p.procedimento,
          papel: p.papel,
          valorCBHPM: p.valor_cbhpm,
          valorPago: p.valor_pago,
          diferenca: p.diferenca,
          pago: p.pago,
          guia: p.guia,
          beneficiario: p.beneficiario,
          doctors: p.doctors
        })),
        totais: {
          valorCBHPM: procedures.reduce((sum, p) => sum + p.valor_cbhpm, 0),
          valorPago: procedures.reduce((sum, p) => sum + p.valor_pago, 0),
          diferenca: procedures.reduce((sum, p) => sum + p.diferenca, 0),
          procedimentosNaoPagos: procedures.filter(p => !p.pago).length
        }
      };
      
      return new Response(JSON.stringify({
        success: true,
        analysisId,
        extractedData,
        proceduresCount,
        message: `Processado com sucesso ${procedures.length} procedimentos.`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } catch (processingError) {
      console.error('Error processing files:', processingError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Error processing files: ' + processingError.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }
  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'An unexpected error occurred' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
