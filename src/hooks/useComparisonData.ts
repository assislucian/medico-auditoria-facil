
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ComparisonDetail {
  id: string;
  codigo: string;
  descricao: string;
  qtd: number;
  valorCbhpm: number;
  valorPago: number;
  diferenca: number;
  status: 'conforme' | 'abaixo' | 'acima' | 'não_pago';
  papel: 'Cirurgião' | 'Primeiro Auxiliar' | 'Segundo Auxiliar';
  guia?: string;
  beneficiario?: string;
  matchStatus?: 'encontrado' | 'não_encontrado';
}

interface ComparisonData {
  summary: {
    total: number;
    conforme: number;
    abaixo: number;
    acima: number;
  };
  details: ComparisonDetail[];
}

/**
 * Custom hook to fetch CBHPM comparison data for a specific analysis
 * @param analysisId The ID of the analysis to fetch comparison data for
 */
export function useComparisonData(analysisId: string | null) {
  return useQuery({
    queryKey: ['cbhpm-comparison', analysisId],
    queryFn: async (): Promise<ComparisonData | null> => {
      if (!analysisId) return null;
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-compare', {
          body: { analysisId }
        });

        if (error) {
          throw new Error(error.message || 'Erro ao buscar dados de comparação');
        }

        return data as ComparisonData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar comparativo';
        toast.error('Falha ao carregar comparativo CBHPM', {
          description: errorMessage
        });
        throw error;
      }
    },
    enabled: !!analysisId,
  });
}
