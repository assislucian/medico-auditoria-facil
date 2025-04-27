
/**
 * Service para buscar detalhes de uma análise específica
 */

import { supabase } from '@/integrations/supabase/client';

export const getAnalysisById = async (analysisId: string) => {
  if (!analysisId) return null;
  
  try {
    // Fetch analysis results
    const { data: analysis, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (analysisError) {
      console.error('Error fetching analysis:', analysisError);
      return null;
    }
    
    // Fetch procedures for this analysis
    const { data: procedures, error: proceduresError } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (proceduresError) {
      console.error('Error fetching procedures:', proceduresError);
      return { ...analysis, procedures: [] };
    }
    
    // Return combined data
    return {
      ...analysis,
      procedures
    };
  } catch (error) {
    console.error('Exception in getAnalysisById:', error);
    return null;
  }
};
