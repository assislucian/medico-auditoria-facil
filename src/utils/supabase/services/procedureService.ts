
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
    // Use any to bypass the deep instantiation issue
    const response: any = await supabase
      .from('procedure_results')
      .select('*')
      .eq('type', type);

    if (response.error) throw response.error;
    return response.data as ProceduresResponse;
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
    const response: any = await supabase
      .from('procedure_results')
      .select('*')
      .eq('id', id)
      .single();

    if (response.error) throw response.error;
    
    // Use explicit casting for returned data
    return response.data as ProcedureResult;
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
    const response: any = await supabase
      .from('procedure_results')
      .select('*')
      .eq('analysis_id', analysisId);

    if (response.error) throw response.error;
    
    // Process doctors field for each procedure with explicit typing
    const processedData = response.data?.map((proc: any) => ({
      ...proc,
      doctors: (proc.doctors as any[]) || []
    }));
    
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
    const response: any = await supabase
      .from('procedure_results')
      .select('*')
      .eq('guia', guia);

    if (response.error) throw response.error;
    
    // Process doctors field for each procedure
    if (response.data) {
      for (const proc of response.data) {
        proc.doctors = proc.doctors as any[] || [];
      }
    }
    
    return response.data as ProceduresResponse;
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
    const response: any = await supabase
      .from('procedure_results')
      .select('*')
      .eq('pago', false);

    if (response.error) throw response.error;
    return response.data as ProceduresResponse;
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
    const response: any = await supabase
      .from('procedure_results')
      .update({ pago: paid })
      .eq('id', id);

    return {
      success: !response.error,
      error: response.error
    };
  } catch (error) {
    console.error('Error updating procedure payment status:', error);
    return {
      success: false,
      error: error as PostgrestError
    };
  }
}
