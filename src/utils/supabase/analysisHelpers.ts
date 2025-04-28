
import { supabase } from '@/integrations/supabase/client';
import { safeDbOperation, safeDbQuery } from './sharedHelpers';

/**
 * Fetch analysis by ID
 */
export async function fetchAnalysisById(analysisId: string) {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}

/**
 * Fetch procedures by analysis ID
 * This is a separate implementation from the one in procedureHelpers.ts
 * to avoid circular dependencies
 */
export async function fetchProceduresByAnalysisId(analysisId: string) {
  return await safeDbOperation(
    supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId)
  ) || [];
}
