
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { calculateSummary, calculateHospitalData, calculateTopProcedures, calculateMonthlyBreakdown } from './reportHelpersService';

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
