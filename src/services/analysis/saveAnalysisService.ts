
import { ExtractedData } from '@/types/upload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

/**
 * Save analysis data to Supabase
 * @param data Extracted data from the analysis
 * @param filesUsed Array of file IDs and types used in the analysis
 * @returns Analysis ID if saved successfully
 */
export const saveAnalysis = async (
  data: ExtractedData,
  filesUsed: { id: string; type: string }[]
): Promise<string | null> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast.error('Você precisa estar logado para salvar análises');
      return null;
    }

    // Insert analysis results
    const { data: analysis, error } = await supabase
      .from('analysis_results')
      .insert({
        user_id: session.session.user.id,
        file_type: filesUsed.map(f => f.type).join(','),
        file_name: filesUsed[0]?.id || 'local-analysis',
        numero: data.demonstrativoInfo?.numero || '',
        competencia: data.demonstrativoInfo?.competencia || '',
        hospital: data.demonstrativoInfo?.hospital || '',
        summary: {
          totalCBHPM: data.totais.valorCBHPM,
          totalPago: data.totais.valorPago,
          totalDiferenca: data.totais.diferenca,
          procedimentosNaoPagos: data.totais.procedimentosNaoPagos,
          procedimentosTotal: data.procedimentos.length
        }
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }

    // Insert procedure results - properly casting to Json where needed
    const proceduresData = data.procedimentos.map(proc => ({
      analysis_id: analysis.id,
      codigo: proc.codigo,
      procedimento: proc.procedimento,
      papel: proc.papel,
      valor_cbhpm: proc.valorCBHPM,
      valor_pago: proc.valorPago,
      diferenca: proc.diferenca,
      pago: proc.pago,
      guia: proc.guia,
      beneficiario: proc.beneficiario,
      doctors: proc.doctors as unknown as Json
    }));

    if (proceduresData.length > 0) {
      const { error: procError } = await supabase
        .from('procedure_results')
        .insert(proceduresData);

      if (procError) {
        console.error('Error saving procedure results:', procError);
        // Don't throw here, we still want to return the analysis ID
      }
    }

    return analysis.id;
  } catch (error) {
    console.error('Error in saveAnalysis:', error);
    toast.error('Erro ao salvar análise', {
      description: 'Tente novamente mais tarde.',
    });
    return null;
  }
};

// Export additional function that may be needed elsewhere
export const saveAnalysisToDatabase = saveAnalysis;
