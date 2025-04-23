
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
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_dashboard_stats', {
        user_id: user.id
      });

      if (error) throw error;
      return data as DashboardStats;
    },
    enabled: !!user?.id
  });
}
