
// Report procedure generation for generate-report edge function

export function generateProcedureReport(analyses: any[], startDate?: string, endDate?: string) {
  const period = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`
    : 'Todo o período';
  
  // Extract all procedures
  const procedures = analyses.flatMap(a => a.procedure_results);
  
  // Group by procedure code
  const procedureMap = new Map();
  
  procedures.forEach(proc => {
    if (!proc) return;
    
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
  
  // Sort by count and take top 10
  const topProcedures = Array.from(procedureMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Calculate summary values
  const summary = {
    totalRecebido: analyses.reduce((sum, a) => sum + Number((a.summary?.totalPago || 0)), 0),
    totalGlosado: analyses.reduce((sum, a) => sum + Math.abs(Number((a.summary?.totalDiferenca || 0))), 0),
    totalProcedimentos: analyses.reduce((sum, a) => sum + Number((a.summary?.procedimentosTotal || 0)), 0),
    auditoriaPendente: analyses.filter(a => a.status === 'Pendente').length
  };
  
  return {
    period,
    summary,
    procedureData: topProcedures
  };
}
