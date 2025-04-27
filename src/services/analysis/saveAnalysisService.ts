
import { supabase } from '@/integrations/supabase/client';
import { type ExtractedData } from '@/types';

export async function saveAnalysisToDatabase(data: ExtractedData) {
  try {
    const { procedures } = data;

    // Save procedures with correct types
    const { data: savedProcedures, error: proceduresError } = await supabase
      .from('procedures')
      .insert(procedures.map(proc => ({
        codigo: proc.codigo,
        descricao: proc.procedimento,
        guide_id: proc.guia, // Make sure this matches the guides table ID
        quantidade: 1,
      })))
      .select();

    if (proceduresError) {
      throw proceduresError;
    }

    return { success: true, data: savedProcedures };
  } catch (error) {
    console.error('Error saving analysis:', error);
    return { success: false, error };
  }
}
