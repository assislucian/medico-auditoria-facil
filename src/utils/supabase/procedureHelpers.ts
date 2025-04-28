
import { supabase } from '@/integrations/supabase/client';
import { ProcedureResult, Procedure } from '@/types/database';

export async function fetchProceduresByAnalysisId(analysisId: string): Promise<Procedure[]> {
  try {
    // Use explicit any typing to avoid deep type instantiation
    const response: { 
      data: Procedure[] | null; 
      error: any 
    } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId) as any;
      
    if (response.error) throw response.error;
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
}
