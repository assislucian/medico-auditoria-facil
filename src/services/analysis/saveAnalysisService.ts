
import { supabase } from '@/integrations/supabase/client';
import { type ExtractedData } from '@/types';

export async function saveAnalysisToDatabase(data: ExtractedData) {
  try {
    const { procedures } = data;

    // Map the procedures to the format expected by the procedure_results table
    const procedureResultsData = procedures.map(proc => ({
      codigo: proc.codigo,
      procedimento: proc.procedimento,
      guia: proc.guia,
      papel: proc.papel || '',
      valor_cbhpm: proc.valorCBHPM || 0,
      valor_pago: proc.valorPago || 0,
      diferenca: proc.diferenca || 0,
      pago: !!proc.pago,
      beneficiario: proc.beneficiario || '',
      doctors: proc.doctors || []
    }));

    // First, save the analysis to get its ID
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        file_name: 'analysis-' + Date.now(),
        file_type: 'json',
        user_id: (await supabase.auth.getUser()).data.user?.id || '',
        summary: {
          totalCBHPM: data.totais?.valorCBHPM || 0,
          totalPago: data.totais?.valorPago || 0,
          totalDiferenca: data.totais?.diferenca || 0,
          procedimentosNaoPagos: data.totais?.procedimentosNaoPagos || 0,
          procedimentosTotal: procedures.length
        }
      })
      .select('id')
      .single();

    if (analysisError) {
      throw analysisError;
    }

    // Then save the procedures with the analysis ID
    const { data: savedProcedures, error: proceduresError } = await supabase
      .from('procedure_results')
      .insert(procedureResultsData.map(proc => ({
        ...proc,
        analysis_id: analysisData.id
      })))
      .select();

    if (proceduresError) {
      throw proceduresError;
    }

    return { success: true, data: savedProcedures };
  } catch (error) {
    console.error('Error saving analysis:', error);
    return { success: false, error };
  }
}
