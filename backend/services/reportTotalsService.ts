
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

/**
 * Fetch totals for status cards
 * @returns Report totals
 */
export async function fetchReportsTotals() {
  try {
    logger.info('Fetching report totals');
    const { data, error } = await supabase
      .from('analysis_results')
      .select('summary');
    if (error) {
      logger.error('Error fetching report totals', { error });
      return {
        totalRecebido: 0,
        totalGlosado: 0,
        totalProcedimentos: 0,
        auditoriaPendente: 0
      };
    }
    const totals = data.reduce((acc, item) => {
      const summary = typeof item.summary === 'object' && item.summary !== null ? item.summary : {};
      const summaryObj = summary as any;
      acc.totalRecebido += Number(summaryObj?.totalPago || 0);
      acc.totalGlosado += Number(summaryObj?.totalDiferenca || 0);
      acc.totalProcedimentos += Number(summaryObj?.procedimentosTotal || 0);
      return acc;
    }, {
      totalRecebido: 0,
      totalGlosado: 0,
      totalProcedimentos: 0,
      auditoriaPendente: 0
    });
    const { count, error: pendingError } = await supabase
      .from('analysis_history')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pendente');
    if (!pendingError) {
      totals.auditoriaPendente = count || 0;
    }
    logger.debug('Report totals calculated', { totals });
    return totals;
  } catch (error) {
    logger.error('Exception in fetchReportsTotals', { error });
    return {
      totalRecebido: 0,
      totalGlosado: 0,
      totalProcedimentos: 0,
      auditoriaPendente: 0
    };
  }
}

/**
 * Fetch monthly data for charts
 * @returns Monthly data
 */
export async function fetchMonthlyData() {
  try {
    logger.info('Fetching monthly data');
    const { data, error } = await supabase
      .from('analysis_results')
      .select('created_at, summary');
    if (error) {
      logger.error('Error fetching monthly data', { error });
      return [];
    }
    const monthlyData = data.reduce((acc: any, item: any) => {
      const date = new Date(item.created_at);
      const month = date.toLocaleString('pt-BR', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { recebido: 0, glosado: 0 };
      }
      const summary = typeof item.summary === 'object' && item.summary !== null ? item.summary : {};
      const summaryObj = summary as any;
      acc[month].recebido += Number(summaryObj?.totalPago || 0);
      acc[month].glosado += Math.abs(Number(summaryObj?.totalDiferenca || 0));
      return acc;
    }, {});
    const result = Object.entries(monthlyData).map(([name, values]: [string, any]) => ({
      name,
      recebido: Math.round(values.recebido),
      glosado: Math.round(values.glosado)
    }));
    logger.debug('Monthly data calculated', { months: result.length });
    return result;
  } catch (error) {
    logger.error('Exception in fetchMonthlyData', { error });
    return [];
  }
}

/**
 * Fetch hospital data for tables
 * @returns Hospital data
 */
export async function fetchHospitalData() {
  try {
    logger.info('Fetching hospital data');
    const { data, error } = await supabase
      .from('analysis_results')
      .select('hospital, summary');
    if (error) {
      logger.error('Error fetching hospital data', { error });
      return [];
    }
    const hospitalData = data.reduce((acc: any, item: any) => {
      const hospital = item.hospital || 'Desconhecido';
      if (!acc[hospital]) {
        acc[hospital] = { 
          procedimentos: 0, 
          glosados: 0,
          recuperados: 0
        };
      }
      const summary = typeof item.summary === 'object' && item.summary !== null ? item.summary : {};
      const summaryObj = summary as any;
      acc[hospital].procedimentos += Number(summaryObj?.procedimentosTotal || 0);
      acc[hospital].glosados += Number(summaryObj?.procedimentosNaoPagos || 0);
      acc[hospital].recuperados += Math.round(Number(summaryObj?.procedimentosNaoPagos || 0) * 0.3);
      return acc;
    }, {});
    const result = Object.entries(hospitalData).map(([name, values]: [string, any]) => ({
      name,
      procedimentos: values.procedimentos,
      glosados: values.glosados,
      recuperados: values.recuperados
    }));
    logger.debug('Hospital data calculated', { hospitalCount: result.length });
    return result;
  } catch (error) {
    logger.error('Exception in fetchHospitalData', { error });
    return [];
  }
}
