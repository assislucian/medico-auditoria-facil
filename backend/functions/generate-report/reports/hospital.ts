
// Report hospital generation for generate-report edge function

export function generateHospitalReport(analyses: any[], startDate?: string, endDate?: string) {
  const period = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`
    : 'Todo o período';
  
  // Group by hospital
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
    hospitalData: Array.from(hospitalMap.values())
  };
}
