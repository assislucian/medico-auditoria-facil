
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { ProcedureResult } from '@/types/database';

// Define response types to avoid deep instantiation issues
type ProceduresResponse = ProcedureResult[] | null;

/**
 * Fetch procedures by their type
 */
export async function getProceduresByType(type: string): Promise<ProceduresResponse> {
  try {
    // Use explicit result typing
    const result = await supabase
      .from('procedure_results')
      .select('*')
      .eq('type', type);

    if (result.error) throw result.error;
    return result.data as ProceduresResponse;
  } catch (error) {
    console.error('Error fetching procedures by type:', error);
    return null;
  }
}

/**
 * Fetch procedures by procedure ID
 */
export async function getProcedureById(id: string): Promise<ProcedureResult | null> {
  try {
    const result = await supabase
      .from('procedure_results')
      .select('*')
      .eq('id', id)
      .single();

    if (result.error) throw result.error;
    
    const data = result.data as ProcedureResult;
    
    // Cast the doctors field if present
    if (data && data.doctors) {
      data.doctors = data.doctors as any[];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching procedure by ID:', error);
    return null;
  }
}

/**
 * Fetch procedures by analysis ID
 */
export async function getProceduresByAnalysisId(analysisId: string): Promise<ProceduresResponse> {
  try {
    const result = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);

    if (result.error) throw result.error;
    
    // Process doctors field for each procedure
    const processedData = result.data?.map(proc => {
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
export async function getProceduresByGuia(guia: string): Promise<ProceduresResponse> {
  try {
    const result = await supabase
      .from('procedure_results')
      .select('*')
      .eq('guia', guia);

    if (result.error) throw result.error;
    
    // Process doctors field for each procedure
    if (result.data) {
      for (const proc of result.data) {
        proc.doctors = proc.doctors as any[] || [];
      }
    }
    
    return result.data as ProceduresResponse;
  } catch (error) {
    console.error('Error fetching procedures by guia:', error);
    return null;
  }
}

/**
 * Fetch unpaid procedures
 */
export async function getUnpaidProcedures(): Promise<ProceduresResponse> {
  try {
    const result = await supabase
      .from('procedure_results')
      .select('*')
      .eq('pago', false);

    if (result.error) throw result.error;
    return result.data as ProceduresResponse;
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
