
/**
 * Helper: Calculate summary for report
 */
export function calculateSummary(analyses: any[]) {
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
 * Helper: Calculate hospital data for report
 */
export function calculateHospitalData(analyses: any[]) {
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
 * Helper: Calculate top procedures for report
 */
export function calculateTopProcedures(analyses: any[]) {
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
  return Array.from(procedureMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

/**
 * Helper: Calculate monthly breakdown for report
 */
export function calculateMonthlyBreakdown(analyses: any[]) {
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
