
/**
 * analysisService.ts
 * 
 * Serviço para gerenciamento de análises de arquivos.
 * Gerencia o armazenamento e recuperação de dados de análise.
 */

import { ExtractedData } from '@/types/upload';
import { supabase } from '@/integrations/supabase/client';

// Estado local para análise atual
let currentAnalysis: ExtractedData | null = null;
let currentAnalysisId: string | null = null;

/**
 * Define a análise atual
 * @param data Dados extraídos da análise
 * @param analysisId ID da análise
 */
export function setCurrentAnalysis(data: ExtractedData, analysisId: string) {
  currentAnalysis = data;
  currentAnalysisId = analysisId;
  
  // Salvar na sessionStorage para persistência entre páginas
  try {
    sessionStorage.setItem('currentAnalysis', JSON.stringify(data));
    sessionStorage.setItem('currentAnalysisId', analysisId);
  } catch (error) {
    console.error('Erro ao salvar análise na sessionStorage:', error);
  }
}

/**
 * Obter a análise atual
 * @returns Dados da análise atual ou null
 */
export function getCurrentAnalysis(): { data: ExtractedData | null, id: string | null } {
  // Se não tiver em memória, tenta recuperar da sessionStorage
  if (!currentAnalysis) {
    try {
      const storedData = sessionStorage.getItem('currentAnalysis');
      const storedId = sessionStorage.getItem('currentAnalysisId');
      
      if (storedData) {
        currentAnalysis = JSON.parse(storedData);
      }
      
      if (storedId) {
        currentAnalysisId = storedId;
      }
    } catch (error) {
      console.error('Erro ao recuperar análise da sessionStorage:', error);
    }
  }
  
  return { data: currentAnalysis, id: currentAnalysisId };
}

/**
 * Limpar a análise atual
 */
export function clearCurrentAnalysis() {
  currentAnalysis = null;
  currentAnalysisId = null;
  
  try {
    sessionStorage.removeItem('currentAnalysis');
    sessionStorage.removeItem('currentAnalysisId');
  } catch (error) {
    console.error('Erro ao limpar análise da sessionStorage:', error);
  }
}

/**
 * Busca dados de análise pelo ID do Supabase
 * @param analysisId ID da análise para buscar
 * @returns Dados da análise ou null se não encontrada
 */
export async function fetchAnalysisById(analysisId: string): Promise<ExtractedData | null> {
  // Se é um ID local simulado, retorna dados da memória
  if (analysisId.startsWith('local-')) {
    return getCurrentAnalysis().data;
  }
  
  try {
    // Buscar dados do resultado da análise
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (analysisError) {
      console.error('Erro ao buscar análise:', analysisError);
      throw analysisError;
    }
    
    // Buscar procedimentos relacionados
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (proceduresError) {
      console.error('Erro ao buscar procedimentos:', proceduresError);
      throw proceduresError;
    }
    
    // Montar objeto de dados extraídos
    const extractedData: ExtractedData = {
      demonstrativoInfo: {
        numero: analysisData.numero || '',
        competencia: analysisData.competencia || '',
        hospital: analysisData.hospital || '',
        data: new Date(analysisData.created_at).toLocaleDateString('pt-BR'),
        beneficiario: proceduresData[0]?.beneficiario || ''
      },
      procedimentos: proceduresData.map(proc => ({
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
    
    console.log('Dados da análise recuperados:', extractedData);
    return extractedData;
  } catch (error) {
    console.error('Erro ao buscar análise por ID:', error);
    return null;
  }
}
