
/**
 * exportService.ts
 * 
 * Serviço para exportação de dados em vários formatos.
 * Suporta exportação para Excel, PDF e outros formatos de arquivo.
 */

import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { HistoryItem } from '@/components/history/data';

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
 * Exporta dados para PDF
 * @param title Título do documento PDF
 * @param headers Cabeçalhos das colunas
 * @param data Dados a serem exportados
 * @param filename Nome do arquivo a ser gerado
 */
export function exportToPDF(
  title: string,
  headers: string[],
  data: any[][],
  filename: string = 'export'
): void {
  try {
    // Criar documento PDF
    const doc = new jsPDF();
    
    // Adicionar título
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    
    // Adicionar data de geração
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
    
    // Adicionar tabela
    (doc as any).autoTable({
      startY: 40,
      head: [headers],
      body: data,
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    // Salvar PDF
    doc.save(`${filename}.pdf`);
    
    toast.success('Exportação concluída', {
      description: `O arquivo ${filename}.pdf foi gerado com sucesso.`
    });
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error);
    toast.error('Falha na exportação para PDF');
  }
}

/**
 * Exporta histórico para PDF
 * @param items Itens do histórico
 * @param filename Nome do arquivo
 */
export function exportHistoryToPDF(items: HistoryItem[], filename: string = 'historico-analises'): void {
  // Definir cabeçalhos
  const headers = ['Data', 'Tipo', 'Descrição', 'Procedimentos', 'Glosados', 'Status'];
  
  // Preparar dados
  const data = items.map(item => [
    item.date,
    item.type,
    item.description,
    item.procedimentos.toString(),
    item.glosados.toString(),
    item.status
  ]);
  
  // Exportar para PDF
  exportToPDF('Histórico de Análises', headers, data, filename);
}
