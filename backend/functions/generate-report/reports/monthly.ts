
// Report monthly generation for generate-report edge function

export function generateMonthlyReport(analyses: any[], startDate?: string, endDate?: string) {
  const period = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`
    : 'Todo o período';
  
  // Group by month
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
    monthlyData: Array.from(monthlyMap.values())
  };
}
