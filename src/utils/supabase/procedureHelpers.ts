
import { supabase } from '@/integrations/supabase/client';
import { ProcedureResult, Procedure } from '@/types/database';

export async function fetchProceduresByAnalysisId(analysisId: string): Promise<Procedure[]> {
  try {
    // Use explicit typing for the response to avoid deep type instantiation
    interface QueryResponse {
      data: Procedure[] | null;
      error: any;
    }
    
    // Execute the query with minimal type annotations
    const response = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId) as unknown as QueryResponse;
      
    if (response.error) throw response.error;
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
}
