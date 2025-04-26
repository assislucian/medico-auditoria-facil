
import { supabase } from '@/integrations/supabase/client';
import { fetchAnalysisById, fetchProceduresByAnalysisId } from '@/utils/supabase';

interface AnalysisSummary {
  totalCBHPM?: number;
  totalPago?: number;
  totalDiferenca?: number;
  procedimentosNaoPagos?: number;
  procedimentosTotal?: number;
  [key: string]: any;
}

/**
 * Retrieves analysis by ID with all related data
 */
export async function getAnalysisById(analysisId: string) {
  try {
    console.log('Buscando análise por ID:', analysisId);
    
    const analysisData = await fetchAnalysisById(analysisId);
    if (!analysisData) {
      console.log('Análise não encontrada');
      return null;
    }
    
    const proceduresData = await fetchProceduresByAnalysisId(analysisId);
    console.log(`Encontrados ${proceduresData.length} procedimentos para a análise`);
    
    // Type assertion for the summary field
    const summary = analysisData.summary as AnalysisSummary;
    
    return {
      demonstrativoInfo: {
        numero: analysisData.numero || `DM${Math.floor(Math.random() * 1000000)}`,
        competencia: analysisData.competencia || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        hospital: analysisData.hospital || 'Hospital não especificado',
        data: new Date(analysisData.created_at).toLocaleDateString('pt-BR'),
        beneficiario: proceduresData[0]?.beneficiario || 'Não especificado'
      },
      procedimentos: proceduresData.map(proc => ({
        id: proc.id,
        codigo: proc.codigo,
        procedimento: proc.procedimento,
        papel: proc.papel,
        valorCBHPM: proc.valor_cbhpm,
        valorPago: proc.valor_pago,
        diferenca: proc.diferenca,
        pago: proc.pago,
        guia: proc.guia,
        beneficiario: proc.beneficiario,
        doctors: proc.doctors || []
      })),
      totais: {
        valorCBHPM: summary?.totalCBHPM || 0,
        valorPago: summary?.totalPago || 0,
        diferenca: summary?.totalDiferenca || 0,
        procedimentosNaoPagos: summary?.procedimentosNaoPagos || 0
      }
    };
  } catch (error) {
    console.error('Erro ao recuperar análise:', error);
    return null;
  }
}
