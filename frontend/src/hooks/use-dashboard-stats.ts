
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  totals: {
    totalRecebido: number;
    totalGlosado: number;
    totalProcedimentos: number;
    auditoriaPendente: number;
  };
  monthlyData: Array<{
    name: string;
    recebido: number;
    glosado: number;
  }>;
  hospitalData: Array<{
    name: string;
    procedimentos: number;
    glosados: number;
    recuperados: number;
  }>;
}

export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) {
        console.log('User not authenticated in useDashboardStats');
        throw new Error('User not authenticated');
      }

      console.log('Fetching dashboard stats for user:', user.id);
      try {
        const { data, error } = await supabase.rpc('get_dashboard_stats', {
          user_id: user.id
        });

        if (error) {
          console.error('Error fetching dashboard stats:', error);
          throw error;
        }
        
        if (!data) {
          console.log('No data returned from get_dashboard_stats');
          throw new Error('No data returned from server');
        }

        console.log('Dashboard stats received:', data);
        
        // Type assertion after validating the structure
        const statsData = data as unknown as DashboardStats;
        if (!statsData?.totals || !Array.isArray(statsData.monthlyData) || !Array.isArray(statsData.hospitalData)) {
          console.error('Invalid data structure received:', data);
          throw new Error('Invalid data structure received from server');
        }

        return statsData;
      } catch (error) {
        console.error('Exception in useDashboardStats:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1
  });
}
