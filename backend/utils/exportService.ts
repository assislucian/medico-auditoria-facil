
/**
 * Service for exporting data to Excel files
 */
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { logger } from './logger';

// Import types directly from HistoryItem for consistency
export interface HistoryItem {
  id: string;
  date: string;
  type: string;
  description: string;
  procedimentos: number;
  glosados: number;
  status: string;
}

/**
 * Exporta dados para Excel
 * @param data Os dados a serem exportados
 * @param filename Nome do arquivo (sem extensão)
 */
export function exportToExcel<T extends Record<string, any>>(data: T[], filename: string): void {
  try {
    // Log the export attempt
    logger.info(`Exporting data to Excel: ${filename}`, { recordCount: data.length });
    
    // Preparação dos dados para exportação
    const exportData = data.map(item => {
      const cleanItem: Record<string, any> = {};
      
      // Remover propriedades com objetos complexos e formatar datas
      Object.keys(item).forEach(key => {
        if (typeof item[key] !== 'object' || item[key] === null) {
          cleanItem[key] = item[key];
        }
      });
      
      return cleanItem;
    });
    
    // Tratamento especial para histórico
    if (isHistoryData(data)) {
      return exportHistoryData(data, filename);
    }
    
    // Criar workbook e worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    
    // Gerar o arquivo e iniciar download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(fileData, `${filename}.xlsx`);
    
    logger.info(`Excel export completed: ${filename}`);
  } catch (error) {
    logger.error('Erro ao exportar dados para Excel:', { error });
    throw new Error('Falha ao exportar dados para Excel');
  }
}

/**
 * Verifica se os dados são do tipo HistoryItem[]
 */
function isHistoryData(data: any[]): data is HistoryItem[] {
  return data.length > 0 && 'status' in data[0] && 'glosados' in data[0];
}

/**
 * Exporta dados de histórico para Excel em formato otimizado para contestação
 * @param data Dados do histórico
 * @param filename Nome do arquivo
 */
function exportHistoryData(data: HistoryItem[], filename: string): void {
  logger.info(`Exporting history data to Excel: ${filename}`, { recordCount: data.length });
  
  // Transformar dados para melhor visualização
  const formattedData = data.map(item => ({
    'Data': item.date,
    'Hospital': item.description.split(' - ')[0],
    'Competência': item.description.split(' - ')[1] || '',
    'Tipo de Análise': item.type,
    'Status': item.status,
    'Total de Procedimentos': item.procedimentos,
    'Procedimentos Glosados': item.glosados,
    'Valor Glosado (estimativa R$)': item.glosados * 850, // Valor médio estimado por procedimento
    'ID': item.id
  }));
  
  // Criar workbook e worksheet com dados formatados
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Ajustar largura das colunas
  const wscols = [
    { wch: 12 }, // Data
    { wch: 30 }, // Hospital
    { wch: 15 }, // Competência
    { wch: 20 }, // Tipo de Análise
    { wch: 12 }, // Status
    { wch: 15 }, // Total de Procedimentos
    { wch: 15 }, // Procedimentos Glosados
    { wch: 18 }, // Valor Glosado
    { wch: 36 }  // ID
  ];
  
  worksheet['!cols'] = wscols;
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Histórico de Análises');
  
  // Adicionar folha com dados para contestação
  const contestacaoData = data
    .filter(item => item.glosados > 0)
    .map(item => ({
      'Hospital': item.description.split(' - ')[0],
      'Competência': item.description.split(' - ')[1] || '',
      'Total de Procedimentos Glosados': item.glosados,
      'Justificativa de Contestação': 'Valores abaixo da tabela CBHPM 2015',
      'Fundamentação Legal': 'Resolução Normativa Nº 428 da ANS, Art. 7º, III',
      'Valor a ser Recuperado (R$)': item.glosados * 850,
      'Data de Análise': item.date,
      'ID da Análise': item.id
    }));
    
  if (contestacaoData.length > 0) {
    const contestacaoSheet = XLSX.utils.json_to_sheet(contestacaoData);
    
    // Ajustar largura das colunas da folha de contestação
    const contestacaoCols = [
      { wch: 30 }, // Hospital
      { wch: 15 }, // Competência
      { wch: 15 }, // Total de Procedimentos Glosados
      { wch: 40 }, // Justificativa
      { wch: 40 }, // Fundamentação
      { wch: 15 }, // Valor a ser Recuperado
      { wch: 15 }, // Data de Análise
      { wch: 36 }  // ID da Análise
    ];
    
    contestacaoSheet['!cols'] = contestacaoCols;
    
    XLSX.utils.book_append_sheet(workbook, contestacaoSheet, 'Contestação');
  }
  
  // Gerar o arquivo e iniciar download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(fileData, `${filename}.xlsx`);
  
  logger.info(`History data export completed: ${filename}`);
}

/**
 * Exporta dados de relatórios para Excel
 * @param reportData Dados do relatório
 * @param reportName Nome do relatório
 */
export function exportReportToExcel(reportData: any, reportName: string): void {
  try {
    logger.info(`Exporting report data to Excel: ${reportName}`);
    
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
    
    // Adicionar folha de dados por procedimento
    if (reportData.procedureData && reportData.procedureData.length > 0) {
      const procedureSheet = XLSX.utils.json_to_sheet(reportData.procedureData);
      XLSX.utils.book_append_sheet(workbook, procedureSheet, 'Por Procedimento');
    }
    
    // Adicionar folha de dados mensais
    if (reportData.monthlyData && reportData.monthlyData.length > 0) {
      const monthlySheet = XLSX.utils.json_to_sheet(reportData.monthlyData);
      XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Dados Mensais');
    }
    
    // Gerar o arquivo e iniciar download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(fileData, `${reportName}.xlsx`);
    
    logger.info(`Report data export completed: ${reportName}`);
  } catch (error) {
    logger.error('Erro ao exportar relatório para Excel:', { error });
    throw new Error('Falha ao exportar relatório para Excel');
  }
}
