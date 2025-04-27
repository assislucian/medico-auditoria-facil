
import { supabase } from '@/integrations/supabase/client';

/**
 * Retrieves audit details for a specific analysis
 * @param analysisId The ID of the analysis
 * @returns Analysis details with procedures
 */
export const getAuditDetails = async (analysisId: string) => {
  if (!analysisId) {
    return { procedimentos: [], hospital: null, summary: null };
  }

  try {
    // Get analysis data
    const { data: analysis, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (analysisError) {
      console.error('Error fetching analysis:', analysisError);
      return { procedimentos: [], hospital: null, summary: null };
    }

    // Get procedures data
    const { data: procedures, error: proceduresError } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);

    if (proceduresError) {
      console.error('Error fetching procedures:', proceduresError);
      return { 
        procedimentos: [], 
        hospital: analysis?.hospital || null, 
        summary: analysis?.summary || null 
      };
    }

    return {
      procedimentos: procedures || [],
      hospital: analysis?.hospital || null,
      summary: analysis?.summary || null
    };
  } catch (error) {
    console.error('Error in getAuditDetails:', error);
    return { procedimentos: [], hospital: null, summary: null };
  }
};
