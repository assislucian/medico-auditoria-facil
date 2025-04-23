
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

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
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_dashboard_stats', {
        user_id: user.id
      });

      if (error) throw error;
      
      // Type assertion after validating the structure
      const statsData = data as unknown as DashboardStats;
      if (!statsData || !statsData.totals || !Array.isArray(statsData.monthlyData) || !Array.isArray(statsData.hospitalData)) {
        throw new Error('Invalid data structure received from server');
      }

      return statsData;
    },
    enabled: !!user?.id
  });
}
