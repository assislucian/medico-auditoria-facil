
import { supabase } from '@/integrations/supabase/client';

/**
 * Busca os totais para exibição nos cards de status
 */
export async function fetchReportsTotals() {
  try {
    // Buscar todas as análises para calcular os totais
    const { data, error } = await supabase
      .from('analysis_results')
      .select('summary');
    
    if (error) {
      console.error('Erro ao buscar dados para relatórios:', error);
      return {
        totalRecebido: 0,
        totalGlosado: 0,
        totalProcedimentos: 0,
        auditoriaPendente: 0
      };
    }
    
    // Calcular os totais
    const totals = data.reduce((acc, item) => {
      const summary = item.summary || {};
      acc.totalRecebido += Number(summary.totalPago || 0);
      acc.totalGlosado += Number(summary.totalDiferenca || 0);
      acc.totalProcedimentos += Number(summary.procedimentosTotal || 0);
      return acc;
    }, {
      totalRecebido: 0,
      totalGlosado: 0,
      totalProcedimentos: 0,
      auditoriaPendente: 0
    });
    
    // Contar análises pendentes
    const { count, error: pendingError } = await supabase
      .from('analysis_history')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pendente');
    
    if (!pendingError) {
      totals.auditoriaPendente = count || 0;
    }
    
    return totals;
  } catch (error) {
    console.error('Erro ao processar dados para relatórios:', error);
    return {
      totalRecebido: 0,
      totalGlosado: 0,
      totalProcedimentos: 0,
      auditoriaPendente: 0
    };
  }
}

/**
 * Busca dados por mês para gráficos
 */
export async function fetchMonthlyData() {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('created_at, summary');
    
    if (error) {
      console.error('Erro ao buscar dados mensais:', error);
      return [];
    }
    
    // Agrupar por mês
    const monthlyData = data.reduce((acc: any, item: any) => {
      const date = new Date(item.created_at);
      const month = date.toLocaleString('pt-BR', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = { recebido: 0, glosado: 0 };
      }
      
      acc[month].recebido += Number(item.summary?.totalPago || 0);
      acc[month].glosado += Math.abs(Number(item.summary?.totalDiferenca || 0));
      
      return acc;
    }, {});
    
    // Converter para o formato de array para o gráfico
    return Object.entries(monthlyData).map(([name, values]: [string, any]) => ({
      name,
      recebido: Math.round(values.recebido),
      glosado: Math.round(values.glosado)
    }));
  } catch (error) {
    console.error('Erro ao processar dados mensais:', error);
    return [];
  }
}

/**
 * Busca dados por hospital
 */
export async function fetchHospitalData() {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('hospital, summary');
    
    if (error) {
      console.error('Erro ao buscar dados por hospital:', error);
      return [];
    }
    
    // Agrupar por hospital
    const hospitalData = data.reduce((acc: any, item: any) => {
      const hospital = item.hospital || 'Desconhecido';
      
      if (!acc[hospital]) {
        acc[hospital] = { 
          procedimentos: 0, 
          glosados: 0,
          recuperados: 0
        };
      }
      
      acc[hospital].procedimentos += Number(item.summary?.procedimentosTotal || 0);
      acc[hospital].glosados += Number(item.summary?.procedimentosNaoPagos || 0);
      // Simulando uma taxa de recuperação de 30% das glosas
      acc[hospital].recuperados += Math.round(Number(item.summary?.procedimentosNaoPagos || 0) * 0.3);
      
      return acc;
    }, {});
    
    // Converter para o formato de array para a tabela
    return Object.entries(hospitalData).map(([name, values]: [string, any]) => ({
      name,
      procedimentos: values.procedimentos,
      glosados: values.glosados,
      recuperados: values.recuperados
    }));
  } catch (error) {
    console.error('Erro ao processar dados por hospital:', error);
    return [];
  }
}
