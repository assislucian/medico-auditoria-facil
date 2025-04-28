
import { supabase } from '@/integrations/supabase/client';
import { ProcedureResult, Procedure } from '@/types/database';

export async function fetchProceduresByAnalysisId(analysisId: string): Promise<Procedure[]> {
  try {
    // Use a simpler typed approach to avoid excessive type instantiation
    const { data, error } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
      
    if (error) throw error;
    
    // Use type assertion to convert the result explicitly
    return (data || []) as Procedure[];
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
}
