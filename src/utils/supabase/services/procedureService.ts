
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Define a more specific type for procedure results
type ProcedureResultRow = Database['public']['Tables']['procedure_results']['Row'];
type ProceduresResponse = ProcedureResultRow[] | null;

/**
 * Fetch procedures by their type
 */
export async function getProceduresByType(type: string) {
  try {
    // Use the from method with a more direct approach
    const { data, error } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('type', type);

    if (error) throw error;
    return data as ProceduresResponse;
  } catch (error) {
    console.error('Error fetching procedures by type:', error);
    return null;
  }
}

/**
 * Fetch procedures by procedure ID
 */
export async function getProcedureById(id: string) {
  try {
    const { data, error } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Cast the doctors field if present
    if (data && data.doctors) {
      data.doctors = data.doctors as any[];
    }
    
    return data as ProcedureResultRow | null;
  } catch (error) {
    console.error('Error fetching procedure by ID:', error);
    return null;
  }
}

/**
 * Fetch procedures by analysis ID
 */
export async function getProceduresByAnalysisId(analysisId: string) {
  try {
    const { data, error } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);

    if (error) throw error;
    
    // Process doctors field for each procedure
    const processedData = data?.map(proc => {
      return {
        ...proc,
        doctors: proc.doctors as any[] || []
      };
    }) || null;
    
    return processedData as ProceduresResponse;
  } catch (error) {
    console.error('Error fetching procedures by analysis ID:', error);
    return null;
  }
}

/**
 * Fetch procedures by guide number
 */
export async function getProceduresByGuia(guia: string) {
  try {
    const { data, error } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('guia', guia);

    if (error) throw error;
    
    // Process doctors field for each procedure
    if (data) {
      for (const proc of data) {
        proc.doctors = proc.doctors as any[] || [];
      }
    }
    
    return data as ProceduresResponse;
  } catch (error) {
    console.error('Error fetching procedures by guia:', error);
    return null;
  }
}

/**
 * Fetch unpaid procedures
 */
export async function getUnpaidProcedures() {
  try {
    const { data, error } = await supabase
      .from('procedure_results')
      .select('*')
      .eq('pago', false);

    if (error) throw error;
    return data as ProceduresResponse;
  } catch (error) {
    console.error('Error fetching unpaid procedures:', error);
    return null;
  }
}

/**
 * Update procedure payment status
 */
export async function updateProcedurePaymentStatus(
  id: string, 
  paid: boolean
): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    const { error } = await supabase
      .from('procedure_results')
      .update({ pago: paid })
      .eq('id', id);

    return {
      success: !error,
      error
    };
  } catch (error) {
    console.error('Error updating procedure payment status:', error);
    return {
      success: false,
      error: error as PostgrestError
    };
  }
}
