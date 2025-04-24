
import { supabase } from '../../config/supabase';
import { logger } from '../../utils/logger';

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
