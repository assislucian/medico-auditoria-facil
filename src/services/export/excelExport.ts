
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

/**
 * Exporta dados para Excel
 * @param items Dados a serem exportados
 * @param filename Nome do arquivo a ser gerado
 */
export async function exportToExcel(items: any[], filename: string = 'export'): Promise<void> {
  try {
    // Importação dinâmica da biblioteca xlsx
    const XLSX = await import('xlsx');
    
    // Preparar dados para exportação
    const exportData = Array.isArray(items) ? items : [];
    
    if (exportData.length === 0) {
      toast.warning('Nenhum dado para exportar');
      return;
    }
    
    // Criar workbook e adicionar worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');
    
    // Exportar para Excel
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    toast.success('Exportação concluída', {
      description: `O arquivo ${filename}.xlsx foi baixado com sucesso.`
    });
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    toast.error('Falha na exportação para Excel');
  }
}

/**
 * Exporta relatórios para Excel
 * @param reportData Dados do relatório
 * @param filename Nome do arquivo
 */
export async function exportReportToExcel(reportData: any, filename: string): Promise<void> {
  try {
    // Importação dinâmica da biblioteca xlsx
    const XLSX = await import('xlsx');
    
    // Criar workbook
    const workbook = XLSX.utils.book_new();
    
    // Adicionar folha de resumo
    if (reportData.summary) {
      const summaryData = [
        { 
          'Período': reportData.period || 'Todo o período',
          'Total Recebido': `R$ ${reportData.summary.totalRecebido.toFixed(2)}`,
          'Total Glosado': `R$ ${reportData.summary.totalGlosado.toFixed(2)}`,
          'Procedimentos': reportData.summary.totalProcedimentos,
          'Pendentes': reportData.summary.auditoriaPendente
        }
      ];
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
    }
    
    // Adicionar folha de dados por hospital
    if (reportData.hospitalData && reportData.hospitalData.length > 0) {
      const hospitalSheet = XLSX.utils.json_to_sheet(reportData.hospitalData);
      XLSX.utils.book_append_sheet(workbook, hospitalSheet, 'Por Hospital');
    }
    
    // Adicionar folha de dados mensais
    if (reportData.monthlyData && reportData.monthlyData.length > 0) {
      const monthlySheet = XLSX.utils.json_to_sheet(reportData.monthlyData);
      XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Dados Mensais');
    }
    
    // Exportar para Excel
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    toast.success('Relatório exportado com sucesso', {
      description: `O arquivo ${filename}.xlsx foi baixado com sucesso.`
    });
  } catch (error) {
    console.error('Erro ao exportar relatório para Excel:', error);
    toast.error('Falha na exportação do relatório');
  }
}
