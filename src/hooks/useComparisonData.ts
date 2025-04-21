
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook to fetch CBHPM comparison data for a specific analysis
 * Now sends crm and role for filtering/backend validation.
 * @param analysisId The ID of the analysis to fetch comparison data for
 */
export function useComparisonData(analysisId: string | null) {
  const { user } = useAuth();
  const crm = user?.user_metadata?.crm ?? null;
  const role = user?.user_metadata?.role ?? 'cirurgiao'; // Default to cirurgiao for demo
  
  console.log('useComparisonData hook called with:', { analysisId, crm, role });

  return useQuery({
    queryKey: ['cbhpm-comparison', analysisId, crm, role],
    queryFn: async (): Promise<any | null> => {
      if (!analysisId) {
        console.log('No analysisId provided, returning null');
        return null;
      }
      
      console.log(`Fetching comparison data for analysisId: ${analysisId}`);

      try {
        // Check if it's a local analysis ID (fallback mechanism)
        if (analysisId.startsWith('local-')) {
          console.log('Using local fallback data for simulation');
          // Return simulation data
          return createSimulationData();
        }
        
        // Try to get data from Edge Function
        try {
          console.log('Attempting to call generate-compare Edge Function');
          const { data, error } = await supabase.functions.invoke('generate-compare', {
            body: { analysisId, crm, role },
          });

          if (error) {
            console.error('Edge Function error:', error);
            throw new Error(error.message || 'Erro ao buscar dados de comparação');
          }
          
          console.log('Successfully received data from Edge Function:', data);
          return data;
        } catch (edgeFunctionError) {
          console.error('Edge Function call failed, using fallback:', edgeFunctionError);
          
          // Edge Function failed, try direct database query
          return getFallbackComparisonData(analysisId);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar comparativo';
        console.error('Error in useComparisonData:', errorMessage);
        
        toast.error('Falha ao carregar comparativo CBHPM', {
          description: errorMessage,
        });
        
        throw error;
      }
    },
    enabled: !!analysisId,
    retry: 1,
  });
}

/**
 * Create simulation data for testing/demo purposes
 */
function createSimulationData() {
  return {
    summary: {
      total: 3,
      conforme: 1,
      abaixo: 1,
      acima: 1
    },
    details: [
      {
        id: '1',
        codigo: '30602246',
        descricao: 'Reconstrução Mamária Com Retalhos Cutâneos Regionais',
        qtd: 1,
        valorCbhpm: 3200.50,
        valorPago: 2800.00,
        diferenca: 400.50,
        status: 'abaixo',
        papel: 'Cirurgião',
        guia: '10467538'
      },
      {
        id: '2',
        codigo: '30602076',
        descricao: 'Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll',
        qtd: 1,
        valorCbhpm: 1800.75,
        valorPago: 1900.25,
        diferenca: 99.50,
        status: 'acima',
        papel: 'Cirurgião',
        guia: '10467538'
      },
      {
        id: '3',
        codigo: '31602096',
        descricao: 'Consulta em Cirurgia Plástica',
        qtd: 1,
        valorCbhpm: 200.00,
        valorPago: 200.00,
        diferenca: 0,
        status: 'conforme',
        papel: 'Cirurgião',
        guia: '10467539'
      }
    ]
  };
}

/**
 * Fetch comparison data directly from the database as fallback
 */
async function getFallbackComparisonData(analysisId: string) {
  console.log('Getting fallback comparison data from database for:', analysisId);
  
  try {
    // Get the analysis data
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (analysisError) {
      console.error('Error fetching analysis:', analysisError);
      throw new Error('Análise não encontrada');
    }
    
    // Get the procedures
    const { data: procedures, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
      
    if (proceduresError) {
      console.error('Error fetching procedures:', proceduresError);
      throw new Error('Falha ao buscar procedimentos');
    }
    
    console.log(`Found ${procedures.length} procedures for analysis ${analysisId}`);
    
    // Transform to the expected format
    let summary = {
      total: procedures.length,
      conforme: 0,
      abaixo: 0,
      acima: 0
    };
    
    const details = procedures.map(proc => {
      const valorCbhpm = proc.valor_cbhpm || 0;
      const valorPago = proc.valor_pago || 0;
      const diferenca = Math.abs(valorPago - valorCbhpm);
      
      let status: 'conforme' | 'abaixo' | 'acima' | 'não_pago';
      
      if (!proc.pago) {
        status = 'não_pago';
      } else if (Math.abs(diferenca) < 0.01) {
        status = 'conforme';
        summary.conforme++;
      } else if (valorPago < valorCbhpm) {
        status = 'abaixo';
        summary.abaixo++;
      } else {
        status = 'acima';
        summary.acima++;
      }
      
      return {
        id: proc.id,
        codigo: proc.codigo,
        descricao: proc.procedimento,
        qtd: 1,
        valorCbhpm,
        valorPago,
        diferenca,
        status,
        papel: proc.papel || 'Cirurgião',
        guia: proc.guia || '-'
      };
    });
    
    return {
      summary,
      details
    };
  } catch (error) {
    console.error('Error in getFallbackComparisonData:', error);
    
    // If all else fails, return simulation data
    return createSimulationData();
  }
}
