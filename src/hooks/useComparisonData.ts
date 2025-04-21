
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
  const role = user?.user_metadata?.role ?? null;

  return useQuery({
    queryKey: ['cbhpm-comparison', analysisId, crm, role],
    queryFn: async (): Promise<any | null> => {
      if (!analysisId || !crm || !role) return null;

      try {
        const { data, error } = await supabase.functions.invoke('generate-compare', {
          body: { analysisId, crm, role },
        });

        if (error) {
          throw new Error(error.message || 'Erro ao buscar dados de comparação');
        }
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar comparativo';
        toast.error('Falha ao carregar comparativo CBHPM', {
          description: errorMessage,
        });
        throw error;
      }
    },
    enabled: !!analysisId && !!crm && !!role,
  });
}
