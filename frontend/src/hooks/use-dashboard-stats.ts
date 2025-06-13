import { useQuery } from '@tanstack/react-query';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await fetch('/api/v1/dashboard');
      if (!res.ok) throw new Error('Erro ao buscar dados do dashboard');
      const data = await res.json();
      return {
        totals: data.totals,
        procedures: data.procedures,
        glosas: data.glosas
      };
    }
  });
}
