
import { supabase } from '@/integrations/supabase/client';
import { ProcedureResult, Procedure } from '@/types/database';

export async function fetchProceduresByAnalysisId(analysisId: string): Promise<Procedure[]> {
  try {
    // Using explicit typing to avoid depth issues
    const result = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
      
    if (result.error) throw result.error;
    
    // Cast the data to our known type
    return (result.data || []) as unknown as Procedure[];
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
}
