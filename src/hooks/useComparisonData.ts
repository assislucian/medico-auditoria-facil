
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { fetchComparisonData } from '@/utils/comparisonSupabase';

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
      try {
        const data = await fetchComparisonData(analysisId as string, crm, role);
        return data;
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
