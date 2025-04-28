
import { supabase } from '@/integrations/supabase/client';
import { logger } from '../../utils/logger';

// Define explicit types to avoid deep instantiation issues
interface ProcedureResult {
  id: string;
  codigo: string;
  procedimento: string;
  papel?: string;
  valor_cbhpm: number;
  valor_pago: number;
  diferenca: number;
  pago: boolean;
  guia?: string;
  beneficiario?: string;
  doctors?: any[];
}

/**
 * Fetch analysis details by ID
 * @param analysisId Analysis ID
 * @returns Analysis details
 */
export async function fetchAnalysisDetails(analysisId: string) {
  try {
    logger.info('Fetching analysis details', { analysisId });
    
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (analysisError) {
      logger.error('Error fetching analysis details', { analysisId, error: analysisError });
      return null;
    }
    
    // Use a simpler query to avoid excessive type instantiation
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (proceduresError) {
      logger.error('Error fetching procedures for analysis', { analysisId, error: proceduresError });
      return null;
    }
    
    // Cast data to the correct type to avoid type errors
    const typedProcedures = proceduresData as unknown as ProcedureResult[];
    
    const result = {
      ...analysisData,
      procedimentos: typedProcedures.map((proc: ProcedureResult) => ({
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
      }))
    };
    
    logger.debug('Analysis details fetched', { 
      analysisId, 
      procedurasCount: result.procedimentos.length 
    });
    
    return result;
  } catch (error) {
    logger.error('Exception in fetchAnalysisDetails', { analysisId, error });
    return null;
  }
}
