
import { supabase } from '@/integrations/supabase/client';

// Define simplified type for procedure data
interface ProcedureData {
  id: string;
  analysis_id: string;
  codigo?: string;
  procedimento?: string;
  papel?: string;
  valor_cbhpm?: number;
  valor_pago?: number;
  diferenca?: number;
  pago?: boolean;
  guia?: string;
  beneficiario?: string;
  doctors?: any[];
  [key: string]: any; // Allow for other properties
}

export async function fetchProceduresData(analysisId: string): Promise<ProcedureData[]> {
  try {
    const { data, error } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId) as { data: ProcedureData[] | null, error: Error | null };
      
    if (error) {
      console.error('Error fetching procedures data:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in procedure service:', error);
    return [];
  }
}

// Add any other procedure-related functions here
