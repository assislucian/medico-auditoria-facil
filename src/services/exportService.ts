import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { HistoryItem } from '@/components/history/data';
import { create } from 'xmlbuilder2';

/**
 * Exporta dados para Excel
 * @param data Os dados a serem exportados
 * @param filename Nome do arquivo (sem extensão)
 */
export function exportToExcel<T extends Record<string, any>>(data: T[], filename: string): void {
  try {
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
  } catch (error) {
    console.error('Erro ao exportar dados para Excel:', error);
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
}

/**
 * Exporta dados de relatórios para Excel
 * @param reportData Dados do relatório
 * @param reportName Nome do relatório
 */
export function exportReportToExcel(reportData: any, reportName: string): void {
  try {
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
  } catch (error) {
    console.error('Erro ao exportar relatório para Excel:', error);
    throw new Error('Falha ao exportar relatório para Excel');
  }
}

/**
 * Exporta dados para XML no formato TISS da ANS
 * @param data Os dados a serem exportados
 * @param filename Nome do arquivo (sem extensão)
 */
export function exportToTissXML<T extends Record<string, any>>(data: T[], filename: string): void {
  try {
    // Criar estrutura base do XML TISS
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('ans:mensagemTISS', {
        'xmlns:ans': 'http://www.ans.gov.br/padroes/tiss/schemas',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://www.ans.gov.br/padroes/tiss/schemas',
        'versaoCompTISS': '3.05.00'
      });

    // Adicionar cabeçalho
    const cabecalho = root.ele('ans:cabecalho');
    cabecalho.ele('ans:identificacaoTransacao')
      .ele('ans:tipoTransacao').txt('ENVIO_LOTE_GUIAS').up()
      .ele('ans:sequencialTransacao').txt('1').up()
      .ele('ans:dataRegistroTransacao').txt(new Date().toISOString().split('T')[0]).up()
      .ele('ans:horaRegistroTransacao').txt(new Date().toISOString().split('T')[1].substring(0, 8));

    // Adicionar dados
    const corpo = root.ele('ans:corpo');
    const lote = corpo.ele('ans:loteGuias');

    // Itens do lote
    data.forEach((item, index) => {
      const guia = lote.ele('ans:guiaSP-SADT');
      
      // Mapeamento básico para formato TISS
      guia.ele('ans:identificacaoGuiaSADTSP')
        .ele('ans:numeroGuiaPrestador').txt(item.id || `GUIA${index}`);

      // Adicionar procedimentos se existirem
      if (item.procedimentos) {
        const procedimentosRealizados = guia.ele('ans:procedimentosRealizados');
        
        // Transformar dados de procedimentos no formato TISS
        if (Array.isArray(item.procedimentos)) {
          item.procedimentos.forEach((proc, procIndex) => {
            const procedimento = procedimentosRealizados.ele('ans:procedimentoRealizado');
            procedimento.ele('ans:procedimento')
              .ele('ans:codigoTabela').txt('22').up()
              .ele('ans:codigoProcedimento').txt(proc.codigo || '').up()
              .ele('ans:descricaoProcedimento').txt(proc.descricao || '');
          });
        }
      }
    });

    // Gerar XML como string
    const xmlString = root.end({ prettyPrint: true });
    
    // Criar blob e iniciar download
    const blob = new Blob([xmlString], { type: 'application/xml' });
    saveAs(blob, `${filename}.xml`);
    
    console.info('Exportação XML TISS concluída com sucesso');
  } catch (error) {
    console.error('Erro ao exportar dados para XML:', error);
    throw new Error('Falha ao exportar dados para XML formato TISS');
  }
}

/**
 * Exporta dados para JSON no formato HL7 FHIR
 * @param data Os dados a serem exportados
 * @param resourceType Tipo de recurso FHIR (Patient, Practitioner, etc)
 * @param filename Nome do arquivo (sem extensão)
 */
export function exportToFHIR<T extends Record<string, any>>(
  data: T[], 
  resourceType: string,
  filename: string
): void {
  try {
    // Criar estrutura base do bundle FHIR
    const fhirBundle = {
      resourceType: "Bundle",
      type: "collection",
      meta: {
        lastUpdated: new Date().toISOString()
      },
      entry: data.map(item => {
        // Converter dados para o formato FHIR básico
        const resource = {
          resourceType: resourceType,
          id: item.id || crypto.randomUUID(),
          meta: {
            versionId: "1",
            lastUpdated: new Date().toISOString()
          }
        };

        // Adicionar propriedades específicas por tipo de recurso
        switch (resourceType) {
          case 'Patient':
            return {
              fullUrl: `urn:uuid:${resource.id}`,
              resource: {
                ...resource,
                name: [{
                  use: "official",
                  text: item.nome || item.name || "Nome não especificado"
                }],
                gender: item.genero || item.gender || "unknown",
                birthDate: item.dataNascimento || item.birthDate
              }
            };
          case 'Practitioner':
            return {
              fullUrl: `urn:uuid:${resource.id}`,
              resource: {
                ...resource,
                identifier: [{
                  system: "http://conselho.saude.gov.br/crm",
                  value: item.crm || "CRM não especificado"
                }],
                name: [{
                  use: "official",
                  text: item.nome || item.name || "Nome não especificado"
                }],
                qualification: [{
                  code: {
                    coding: [{
                      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
                      code: "MD",
                      display: "Medical Doctor"
                    }],
                    text: item.especialidade || item.specialty || "Médico"
                  }
                }]
              }
            };
          case 'Procedure':
            return {
              fullUrl: `urn:uuid:${resource.id}`,
              resource: {
                ...resource,
                status: "completed",
                code: {
                  coding: [{
                    system: "http://www.amb.org.br/cbhpm",
                    code: item.codigo || item.code,
                    display: item.descricao || item.description || "Procedimento não especificado"
                  }]
                },
                subject: {
                  reference: item.pacienteId ? `Patient/${item.pacienteId}` : undefined
                },
                performer: item.medico ? [{
                  actor: {
                    reference: `Practitioner/${item.medico.id}`
                  },
                  function: {
                    text: item.medico.funcao || "Médico responsável"
                  }
                }] : undefined
              }
            };
          default:
            return {
              fullUrl: `urn:uuid:${resource.id}`,
              resource: {
                ...resource,
                ...item
              }
            };
        }
      })
    };

    // Converter para JSON e fazer download
    const jsonString = JSON.stringify(fhirBundle, null, 2);
    const blob = new Blob([jsonString], { type: 'application/fhir+json' });
    saveAs(blob, `${filename}.json`);
    
    console.info('Exportação FHIR concluída com sucesso');
  } catch (error) {
    console.error('Erro ao exportar dados para formato FHIR:', error);
    throw new Error('Falha ao exportar dados para formato FHIR');
  }
}
