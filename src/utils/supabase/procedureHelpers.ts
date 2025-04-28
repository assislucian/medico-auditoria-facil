
import { supabase } from '@/integrations/supabase/client';

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
