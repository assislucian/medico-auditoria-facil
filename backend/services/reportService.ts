
/**
 * Service for generating and managing reports
 */
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

/**
 * Fetch totals for status cards
 * @returns Report totals
 */
export async function fetchReportsTotals() {
  try {
    logger.info('Fetching report totals');
    
    // Fetch all analyses to calculate totals
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
    
    // Calculate totals from analyses
    const totals = data.reduce((acc, item) => {
      // Ensure summary is an object
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
    
    // Count pending analyses
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
    
    // Group by month
    const monthlyData = data.reduce((acc: any, item: any) => {
      const date = new Date(item.created_at);
      const month = date.toLocaleString('pt-BR', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = { recebido: 0, glosado: 0 };
      }
      
      // Safely access summary properties
      const summary = typeof item.summary === 'object' && item.summary !== null ? item.summary : {};
      const summaryObj = summary as any;
      
      acc[month].recebido += Number(summaryObj?.totalPago || 0);
      acc[month].glosado += Math.abs(Number(summaryObj?.totalDiferenca || 0));
      
      return acc;
    }, {});
    
    // Convert to array format for charts
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
    
    // Group by hospital
    const hospitalData = data.reduce((acc: any, item: any) => {
      const hospital = item.hospital || 'Desconhecido';
      
      if (!acc[hospital]) {
        acc[hospital] = { 
          procedimentos: 0, 
          glosados: 0,
          recuperados: 0
        };
      }
      
      // Safely access summary properties
      const summary = typeof item.summary === 'object' && item.summary !== null ? item.summary : {};
      const summaryObj = summary as any;
      
      acc[hospital].procedimentos += Number(summaryObj?.procedimentosTotal || 0);
      acc[hospital].glosados += Number(summaryObj?.procedimentosNaoPagos || 0);
      // Simulate 30% recovery rate
      acc[hospital].recuperados += Math.round(Number(summaryObj?.procedimentosNaoPagos || 0) * 0.3);
      
      return acc;
    }, {});
    
    // Convert to array format for tables
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

/**
 * Generate report by date range
 * @param startDate Start date
 * @param endDate End date
 * @returns Generated report
 */
export async function generateReportByDateRange(startDate: string, endDate: string) {
  try {
    logger.info('Generating report by date range', { startDate, endDate });
    
    const { data: analyses, error } = await supabase
      .from('analysis_results')
      .select('*, procedure_results(*)')
      .gte('created_at', startDate)
      .lte('created_at', endDate);
    
    if (error) {
      logger.error('Error generating report by date range', { error, startDate, endDate });
      return null;
    }
    
    // Process data for report
    const reportData = {
      period: `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`,
      summary: calculateSummary(analyses),
      hospitalData: calculateHospitalData(analyses),
      procedureData: calculateTopProcedures(analyses),
      monthlyData: calculateMonthlyBreakdown(analyses)
    };
    
    logger.debug('Report generated successfully', { 
      period: reportData.period,
      analysisCount: analyses.length 
    });
    
    return reportData;
  } catch (error) {
    logger.error('Exception in generateReportByDateRange', { error, startDate, endDate });
    return null;
  }
}

/**
 * Calculate summary for report
 * @param analyses Analysis data
 * @returns Summary calculations
 */
function calculateSummary(analyses: any[]) {
  return analyses.reduce((acc, analysis) => {
    const summary = analysis.summary || {};
    
    acc.totalRecebido += Number(summary.totalPago || 0);
    acc.totalGlosado += Number(summary.totalDiferenca || 0);
    acc.totalProcedimentos += Number(summary.procedimentosTotal || 0);
    acc.auditoriaPendente += analysis.status === 'Pendente' ? 1 : 0;
    
    return acc;
  }, {
    totalRecebido: 0,
    totalGlosado: 0,
    totalProcedimentos: 0,
    auditoriaPendente: 0
  });
}

/**
 * Calculate hospital data for report
 * @param analyses Analysis data
 * @returns Hospital data calculations
 */
function calculateHospitalData(analyses: any[]) {
  const hospitalMap = new Map();
  
  analyses.forEach(analysis => {
    const hospital = analysis.hospital || 'Desconhecido';
    const summary = analysis.summary || {};
    
    if (!hospitalMap.has(hospital)) {
      hospitalMap.set(hospital, {
        name: hospital,
        procedimentos: 0,
        glosados: 0,
        recuperados: 0
      });
    }
    
    const hospitalData = hospitalMap.get(hospital);
    hospitalData.procedimentos += Number(summary.procedimentosTotal || 0);
    hospitalData.glosados += Number(summary.procedimentosNaoPagos || 0);
    hospitalData.recuperados += Math.round(Number(summary.procedimentosNaoPagos || 0) * 0.3);
  });
  
  return Array.from(hospitalMap.values());
}

/**
 * Calculate top procedures for report
 * @param analyses Analysis data
 * @returns Procedure data calculations
 */
function calculateTopProcedures(analyses: any[]) {
  const procedureMap = new Map();
  
  analyses.forEach(analysis => {
    const procedures = analysis.procedure_results || [];
    
    procedures.forEach((proc: any) => {
      if (!procedureMap.has(proc.codigo)) {
        procedureMap.set(proc.codigo, {
          codigo: proc.codigo,
          procedimento: proc.procedimento,
          count: 0,
          valorCBHPM: 0,
          valorPago: 0,
          diferenca: 0
        });
      }
      
      const procData = procedureMap.get(proc.codigo);
      procData.count += 1;
      procData.valorCBHPM += Number(proc.valor_cbhpm || 0);
      procData.valorPago += Number(proc.valor_pago || 0);
      procData.diferenca += Number(proc.diferenca || 0);
    });
  });
  
  // Sort by count and take top 10
  return Array.from(procedureMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

/**
 * Calculate monthly breakdown for report
 * @param analyses Analysis data
 * @returns Monthly data calculations
 */
function calculateMonthlyBreakdown(analyses: any[]) {
  const monthlyMap = new Map();
  
  analyses.forEach(analysis => {
    const date = new Date(analysis.created_at);
    const month = date.toLocaleString('pt-BR', { month: 'short' });
    const summary = analysis.summary || {};
    
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, {
        name: month,
        recebido: 0,
        glosado: 0
      });
    }
    
    const monthData = monthlyMap.get(month);
    monthData.recebido += Number(summary.totalPago || 0);
    monthData.glosado += Math.abs(Number(summary.totalDiferenca || 0));
  });
  
  return Array.from(monthlyMap.values());
}
