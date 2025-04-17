
/**
 * Edge Function to process uploaded files and generate analysis
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

// Types
interface DoctorParticipation {
  code: string;
  name: string;
  role: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface ProcedureExtracted {
  codigo: string;
  procedimento: string;
  papel: string;
  valorCBHPM: number;
  valorPago: number;
  diferenca: number;
  pago: boolean;
  guia: string;
  beneficiario: string;
  doctors: DoctorParticipation[];
}

interface ExtractedData {
  demonstrativoInfo: {
    numero: string;
    competencia: string;
    hospital: string;
    data: string;
    beneficiario: string;
  };
  procedimentos: ProcedureExtracted[];
  totais: {
    valorCBHPM: number;
    valorPago: number;
    diferenca: number;
    procedimentosNaoPagos: number;
  };
}

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
    const { uploadIds, crmRegistrado } = await req.json();
    
    // Validate input
    if (!uploadIds || !Array.isArray(uploadIds) || uploadIds.length === 0) {
      return new Response(JSON.stringify({ error: 'No upload IDs provided' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }

    console.log(`Processing analysis for ${uploadIds.length} uploads, user ${user.id}, CRM filter: ${crmRegistrado || 'none'}`);
    
    // Fetch upload records
    const { data: uploads, error: uploadsError } = await supabase
      .from('uploads')
      .select('*')
      .in('id', uploadIds)
      .eq('user_id', user.id);
    
    if (uploadsError || !uploads || uploads.length === 0) {
      return new Response(JSON.stringify({ 
        success: false,
        error: uploadsError?.message || 'No uploads found with the provided IDs'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      });
    }

    // Extract data from uploads (simplified simulation for edge function)
    // In production, this would use more sophisticated extraction logic
    const hasGuias = uploads.some(u => u.file_type === 'guia');
    const hasDemonstrativos = uploads.some(u => u.file_type === 'demonstrativo');
    
    // Determine processing mode
    const processMode = hasGuias && hasDemonstrativos 
      ? 'complete' 
      : hasGuias 
        ? 'guia-only'
        : 'demonstrativo-only';
    
    console.log(`Processing mode: ${processMode}`);
    
    // Simulate extracting data (in production this would use OCR or more sophisticated parsing)
    // This is simplified for the edge function
    const extractedData: ExtractedData = {
      demonstrativoInfo: {
        numero: `PROC${Date.now()}`,
        competencia: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        hospital: uploads[0]?.hospital || 'Hospital não especificado',
        data: new Date().toLocaleDateString('pt-BR'),
        beneficiario: 'Paciente exemplo'
      },
      procedimentos: [
        {
          codigo: "30602246",
          procedimento: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
          papel: "Cirurgiao",
          valorCBHPM: 3772.88,
          valorPago: 3200.50,
          diferenca: -572.38,
          pago: true,
          guia: "10467538",
          beneficiario: "THAYSE BORGES",
          doctors: [
            {
              code: "8425",
              name: "FERNANDA MABEL BATISTA DE AQUINO",
              role: "Cirurgiao",
              startTime: "19/08/2024 14:09",
              endTime: "19/08/2024 15:24",
              status: "Fechada"
            }
          ]
        }
      ],
      totais: {
        valorCBHPM: 3772.88,
        valorPago: 3200.50,
        diferenca: -572.38,
        procedimentosNaoPagos: 0
      }
    };
    
    // Save analysis to database
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        user_id: user.id,
        file_name: uploads[0]?.file_name || 'Multiple files',
        file_type: processMode,
        hospital: extractedData.demonstrativoInfo.hospital,
        competencia: extractedData.demonstrativoInfo.competencia,
        numero: extractedData.demonstrativoInfo.numero,
        summary: {
          totalPago: extractedData.totais.valorPago,
          totalCBHPM: extractedData.totais.valorCBHPM,
          totalDiferenca: extractedData.totais.diferenca,
          procedimentosTotal: extractedData.procedimentos.length,
          procedimentosNaoPagos: extractedData.totais.procedimentosNaoPagos
        }
      })
      .select('id')
      .single();
    
    if (analysisError) {
      console.error('Failed to save analysis results:', analysisError);
      return new Response(JSON.stringify({ 
        success: false,
        error: analysisError.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }
    
    const analysisId = analysisData.id;
    
    // Save procedures
    const proceduresData = extractedData.procedimentos.map(proc => ({
      analysis_id: analysisId,
      codigo: proc.codigo,
      procedimento: proc.procedimento,
      papel: proc.papel,
      valor_cbhpm: proc.valorCBHPM,
      valor_pago: proc.valorPago,
      diferenca: proc.diferenca,
      pago: proc.pago,
      guia: proc.guia,
      beneficiario: proc.beneficiario,
      doctors: proc.doctors
    }));
    
    const { error: proceduresError } = await supabase
      .from('procedure_results')
      .insert(proceduresData);
    
    if (proceduresError) {
      console.error('Failed to save procedure results:', proceduresError);
      // Try to rollback
      await supabase.from('analysis_results').delete().eq('id', analysisId);
      return new Response(JSON.stringify({ 
        success: false,
        error: proceduresError.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }
    
    // Update history
    await supabase.from('analysis_history').insert({
      user_id: user.id,
      type: processMode,
      description: `${extractedData.demonstrativoInfo.hospital} - ${extractedData.demonstrativoInfo.competencia}`,
      procedimentos: extractedData.procedimentos.length,
      glosados: extractedData.totais.procedimentosNaoPagos,
      hospital: extractedData.demonstrativoInfo.hospital
    });
    
    // Update upload status
    await supabase
      .from('uploads')
      .update({ status: 'processado' })
      .in('id', uploadIds);
    
    // Return success
    return new Response(JSON.stringify({ 
      success: true,
      analysisId,
      proceduresCount: extractedData.procedimentos.length,
      extractedData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error processing analysis:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'An unknown error occurred while processing analysis'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
