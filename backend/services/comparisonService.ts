
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { findProcedureByCodigo, calculateTotalCBHPM } from '../data/cbhpmData';

/**
 * Compare procedure payments with CBHPM table
 * @param analysisId Analysis ID to compare
 * @returns Comparison data between paid values and CBHPM reference
 */
export async function compareWithPayslips(analysisId: string) {
  try {
    logger.info('Comparing procedures with payslips', { analysisId });
    const { data: analysis, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    if (analysisError) {
      logger.error('Error fetching analysis for comparison', { analysisId, error: analysisError });
      throw new Error('Failed to fetch analysis');
    }
    const { data: procedures, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
    if (proceduresError) {
      logger.error('Error fetching procedures for comparison', { analysisId, error: proceduresError });
      throw new Error('Failed to fetch procedures');
    }
    const summary = {
      total: procedures.length,
      conforme: 0,
      abaixo: 0,
      acima: 0
    };
    const details = procedures.map(procedure => {
      const cbhpmData = findProcedureByCodigo(procedure.codigo);
      const valorCbhpm = cbhpmData ? calculateTotalCBHPM(cbhpmData) : 0;
      const valorPago = Number(procedure.valor_pago) || 0;
      const diferenca = valorPago - valorCbhpm;
      let status: 'conforme' | 'abaixo' | 'acima' | 'não_pago';
      if (!procedure.pago) {
        status = 'não_pago';
      } else if (Math.abs(diferenca) < 0.01) {
        status = 'conforme';
        summary.conforme++;
      } else if (diferenca < 0) {
        status = 'abaixo';
        summary.abaixo++;
      } else {
        status = 'acima';
        summary.acima++;
      }
      const papel = procedure.papel || 'Cirurgião';
      return {
        id: procedure.id,
        codigo: procedure.codigo,
        descricao: procedure.procedimento,
        qtd: 1,
        valorCbhpm,
        valorPago,
        diferenca: Math.abs(diferenca),
        status,
        papel
      };
    });
    logger.info('Comparison completed', { 
      analysisId, 
      totalProcedures: summary.total,
      conforme: summary.conforme,
      abaixo: summary.abaixo,
      acima: summary.acima
    });
    return {
      summary,
      details
    };
  } catch (error) {
    logger.error('Exception in compareWithPayslips', { analysisId, error });
    throw error;
  }
}

/**
 * Get CBHPM comparison by role
 * @param analysisId Analysis ID to compare
 * @returns CBHPM comparison grouped by medical role
 */
export async function getCBHPMComparisonByRole(analysisId: string) {
  const comparisonData = await compareWithPayslips(analysisId);
  const roleGroups = comparisonData.details.reduce((acc: any, item) => {
    const role = item.papel;
    if (!acc[role]) {
      acc[role] = {
        role,
        procedures: [],
        total: 0,
        conforme: 0,
        baixo: 0,
        acima: 0
      };
    }
    acc[role].procedures.push(item);
    acc[role].total++;
    if (item.status === 'conforme') acc[role].conforme++;
    else if (item.status === 'abaixo') acc[role].abaixo++;
    else if (item.status === 'acima') acc[role].acima++;
    return acc;
  }, {});
  return {
    summary: comparisonData.summary,
    roleGroups: Object.values(roleGroups)
  };
}
