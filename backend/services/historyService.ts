
/**
 * Service for managing history data
 */
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { HistoryItem } from '../utils/exportService';

/**
 * Fetch history data for a user
 * @returns History data
 */
export async function fetchHistoryData(): Promise<HistoryItem[]> {
  try {
    logger.info('Fetching history data');
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error('User not authenticated when fetching history');
      return [];
    }
    
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      logger.error('Error fetching history data', { error });
      return [];
    }
    
    const result = data.map((item: any) => ({
      id: item.id,
      date: formatDate(item.date),
      type: item.type,
      description: item.description,
      procedimentos: item.procedimentos || 0,
      glosados: item.glosados || 0,
      status: item.status
    }));
    
    logger.debug('History data fetched', { count: result.length });
    return result;
  } catch (error) {
    logger.error('Exception in fetchHistoryData', { error });
    return [];
  }
}

/**
 * Fetch analysis details by ID
 * @param analysisId Analysis ID
 * @returns Analysis details
 */
export async function fetchAnalysisDetails(analysisId: string) {
  try {
    logger.info('Fetching analysis details', { analysisId });
    
    // Fetch analysis data
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (analysisError) {
      logger.error('Error fetching analysis details', { analysisId, error: analysisError });
      return null;
    }
    
    // Fetch procedure data
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (proceduresError) {
      logger.error('Error fetching procedures for analysis', { analysisId, error: proceduresError });
      return null;
    }
    
    // Format and combine the data
    const result = {
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

/**
 * Update analysis status
 * @param analysisId Analysis ID
 * @param status New status
 * @returns Success flag
 */
export async function updateAnalysisStatus(analysisId: string, status: string): Promise<boolean> {
  try {
    logger.info('Updating analysis status', { analysisId, status });
    
    const { error } = await supabase
      .from('analysis_history')
      .update({ status })
      .eq('id', analysisId);
    
    if (error) {
      logger.error('Error updating analysis status', { analysisId, status, error });
      return false;
    }
    
    logger.debug('Analysis status updated successfully', { analysisId, status });
    return true;
  } catch (error) {
    logger.error('Exception in updateAnalysisStatus', { analysisId, status, error });
    return false;
  }
}

/**
 * Search in history by text
 * @param searchText Search text
 * @returns Filtered history items
 */
export async function searchHistory(searchText: string): Promise<HistoryItem[]> {
  try {
    logger.info('Searching history', { searchText });
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error('User not authenticated when searching history');
      return [];
    }
    
    // Search in various columns
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .or(`description.ilike.%${searchText}%,type.ilike.%${searchText}%,hospital.ilike.%${searchText}%`)
      .order('date', { ascending: false });
    
    if (error) {
      logger.error('Error searching history', { searchText, error });
      return [];
    }
    
    const result = data.map((item: any) => ({
      id: item.id,
      date: formatDate(item.date),
      type: item.type,
      description: item.description,
      procedimentos: item.procedimentos || 0,
      glosados: item.glosados || 0,
      status: item.status
    }));
    
    logger.debug('History search completed', { searchText, resultsCount: result.length });
    return result;
  } catch (error) {
    logger.error('Exception in searchHistory', { searchText, error });
    return [];
  }
}

/**
 * Format date to DD/MM/YYYY
 * @param dateString Date string
 * @returns Formatted date
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}
