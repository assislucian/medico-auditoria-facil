
import { supabase } from '@/integrations/supabase/client';
import { HistoryItem } from '@/components/history/data';

/**
 * Busca o histórico de análises do usuário
 */
export async function fetchHistoryData(): Promise<HistoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
    
    return data.map((item: any) => ({
      id: item.id,
      date: formatDate(item.date),
      type: item.type,
      description: item.description,
      procedimentos: item.procedimentos || 0,
      glosados: item.glosados || 0,
      status: item.status
    }));
  } catch (error) {
    console.error('Erro ao processar histórico:', error);
    return [];
  }
}

/**
 * Busca os detalhes de uma análise específica
 */
export async function fetchAnalysisDetails(analysisId: string) {
  try {
    // Buscar os dados da análise
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (analysisError) {
      console.error('Erro ao buscar detalhes da análise:', analysisError);
      return null;
    }
    
    // Buscar os procedimentos relacionados
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (proceduresError) {
      console.error('Erro ao buscar procedimentos:', proceduresError);
      return null;
    }
    
    return {
      ...analysisData,
      procedimentos: proceduresData.map((proc: any) => ({
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
        doctors: proc.doctors
      }))
    };
  } catch (error) {
    console.error('Erro ao processar detalhes da análise:', error);
    return null;
  }
}

/**
 * Formata a data para o formato DD/MM/AAAA
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}
