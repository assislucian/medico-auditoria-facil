
import { supabase } from '@/integrations/supabase/client';

export interface ProcedureData {
  id: string;
  analysis_id: string;
  codigo: string;
  procedimento: string;
  papel: string;
  valor_cbhpm: number;
  valor_pago: number;
  diferenca: number;
  pago: boolean;
  guia?: string;
  beneficiario?: string;
  doctors?: any[];
  user_id: string;
  created_at: string;
}

export async function fetchProceduresByAnalysisId(analysisId: string): Promise<ProcedureData[]> {
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
