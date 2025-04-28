
import { supabase } from '@/integrations/supabase/client';
import { ProcedureResult, Procedure } from '@/types/database';

export async function fetchProceduresByAnalysisId(analysisId: string): Promise<Procedure[]> {
  try {
    // Avoid the type instantiation depth issue by using explicit any for the query result
    // and then casting to our known type afterward
    const response: any = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
      
    if (response.error) throw response.error;
    
    // Use type assertion to convert the result explicitly
    return (response.data || []) as Procedure[];
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
}
