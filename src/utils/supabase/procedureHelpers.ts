
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches procedures by analysis ID
 * @param analysisId The ID of the analysis to fetch procedures for
 * @returns Array of procedures or empty array if none found
 */
export async function fetchProceduresByAnalysisId(analysisId: string) {
  try {
    const { data, error } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
}
