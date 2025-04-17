
/**
 * Database service to handle data persistence operations
 */
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { ExtractedData, AnalysisResult, ProcedureResult, ProcessMode } from '../models/types';
import { BadRequestError, NotFoundError } from '../utils/errorHandler';

/**
 * Save analysis results to database
 * @param files The uploaded files information
 * @param processMode The mode of processing
 * @param extractedData Data extracted from files
 * @returns Success status and analysis ID
 */
export async function saveAnalysisToDatabase(
  files: { name: string, type: string }[],
  processMode: ProcessMode,
  extractedData: ExtractedData
): Promise<{ success: boolean; analysisId: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error('Attempt to save analysis without authenticated user');
      throw new BadRequestError('User not authenticated');
    }
    
    logger.info('Saving analysis to database', {
      userId: user.id,
      processMode,
      procedimentosCount: extractedData.procedimentos.length
    });
    
    // Begin transaction by inserting the analysis result
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        user_id: user.id,
        file_name: files.map(f => f.name).join(', '),
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
      logger.error('Failed to save analysis results', { error: analysisError });
      return { success: false, analysisId: null };
    }
    
    const analysisId = analysisData.id;
    
    // Insert all procedures related to this analysis
    const proceduresData = extractedData.procedimentos.map(proc => ({
      analysis_id: analysisId,
      user_id: user.id,
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
      .from('procedures')
      .insert(proceduresData);
    
    if (proceduresError) {
      logger.error('Failed to save procedures', { error: proceduresError });
      // Attempt to rollback by deleting the analysis
      await supabase.from('analysis_results').delete().eq('id', analysisId);
      return { success: false, analysisId: null };
    }
    
    // Update the analysis history
    await supabase.from('analysis_history').insert({
      user_id: user.id,
      type: processMode === 'complete' ? 'Guia + Demonstrativo' : 
            processMode === 'guia-only' ? 'Guia' : 'Demonstrativo',
      description: `${extractedData.demonstrativoInfo.hospital} - ${extractedData.demonstrativoInfo.competencia}`,
      procedimentos: extractedData.procedimentos.length,
      glosados: extractedData.totais.procedimentosNaoPagos,
      hospital: extractedData.demonstrativoInfo.hospital
    });
    
    logger.info('Analysis saved successfully', { analysisId });
    
    return { success: true, analysisId };
  } catch (error) {
    logger.error('Exception in saveAnalysisToDatabase', { error });
    return { success: false, analysisId: null };
  }
}

/**
 * Get analysis by ID
 * @param analysisId ID of the analysis to retrieve
 * @returns Analysis data or null if not found
 */
export async function getAnalysisById(
  analysisId: string
): Promise<ExtractedData | null> {
  try {
    // Get the analysis data
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (analysisError) {
      logger.error('Failed to get analysis by ID', { analysisId, error: analysisError });
      return null;
    }
    
    // Get the procedure results
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (proceduresError) {
      logger.error('Failed to get procedures for analysis', { analysisId, error: proceduresError });
      return null;
    }
    
    // Transform the database data to ExtractedData format
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
    
    return extractedData;
  } catch (error) {
    logger.error('Exception in getAnalysisById', { analysisId, error });
    return null;
  }
}

/**
 * Get history by user ID
 * @param userId ID of the user
 * @returns Array of history items
 */
export async function getHistoryByUserId(userId: string): Promise<AnalysisResult[]> {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      logger.error('Failed to get history by user ID', { userId, error });
      return [];
    }
    
    return data as AnalysisResult[];
  } catch (error) {
    logger.error('Exception in getHistoryByUserId', { userId, error });
    return [];
  }
}

/**
 * Get procedures by analysis ID
 * @param analysisId ID of the analysis
 * @returns Array of procedure results
 */
export async function getProceduresByAnalysisId(analysisId: string): Promise<ProcedureResult[]> {
  try {
    const { data, error } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (error) {
      logger.error('Failed to get procedures by analysis ID', { analysisId, error });
      return [];
    }
    
    return data as ProcedureResult[];
  } catch (error) {
    logger.error('Exception in getProceduresByAnalysisId', { analysisId, error });
    return [];
  }
}

/**
 * Check if user has access to analysis
 * @param userId ID of the user
 * @param analysisId ID of the analysis
 * @returns Boolean indicating if user has access
 */
export async function userHasAccessToAnalysis(userId: string, analysisId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('user_id')
      .eq('id', analysisId)
      .single();
    
    if (error) {
      logger.error('Failed to check user access to analysis', { userId, analysisId, error });
      return false;
    }
    
    return data.user_id === userId;
  } catch (error) {
    logger.error('Exception in userHasAccessToAnalysis', { userId, analysisId, error });
    return false;
  }
}

/**
 * Get CBHPM data by procedure code
 * @param code Procedure code
 * @returns CBHPM data for the procedure or null if not found
 */
export async function getCBHPMByCode(code: string) {
  try {
    const { data, error } = await supabase
      .from('CBHPM2015')
      .select('*')
      .eq('codigo', code)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      logger.error('Failed to get CBHPM by code', { code, error });
      throw new Error('Failed to get CBHPM data');
    }
    
    return data;
  } catch (error) {
    logger.error('Exception in getCBHPMByCode', { code, error });
    return null;
  }
}
