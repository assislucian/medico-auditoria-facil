
// Report summary generation for generate-report edge function

export function generateSummaryReport(analyses: any[], startDate?: string, endDate?: string) {
  const period = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`
    : 'Todo o período';
  
  // Calculate summary values
  const summary = analyses.reduce((acc, analysis) => {
    const summaryData = analysis.summary || {};
    
    acc.totalRecebido += Number(summaryData.totalPago || 0);
    acc.totalGlosado += Math.abs(Number(summaryData.totalDiferenca || 0));
    acc.totalProcedimentos += Number(summaryData.procedimentosTotal || 0);
    return acc;
  }, {
    totalRecebido: 0,
    totalGlosado: 0,
    totalProcedimentos: 0,
    auditoriaPendente: 0
  });
  
  // Count pending analyses
  summary.auditoriaPendente = analyses.filter(a => a.status === 'Pendente').length;
  
  return {
    period,
    summary
  };
}
