
/**
 * Service for processing uploaded files and extracting data
 */
import { logger } from '../utils/logger';
import { ExtractedData, GuiaData, FileWithStatus, ProcedimentoGuia, ParticipacaoMedica, ProcessMode } from '../models/types';
import { getCBHPMByCode } from './databaseService';

/**
 * Extract data from files
 * @param files Files to process
 * @param processMode Processing mode
 * @param crmRegistrado CRM to filter by
 * @returns Extracted data
 */
export async function extractDataFromFiles(
  files: FileWithStatus[],
  processMode: ProcessMode,
  crmRegistrado: string = ''
): Promise<ExtractedData> {
  // Filter valid files
  const validFiles = files.filter(f => f.status === 'valid');
  
  // Separate files by type
  const guiasFiles = validFiles.filter(f => f.type === 'guia').map(f => f.file);
  const demonstrativosFiles = validFiles.filter(f => f.type === 'demonstrativo').map(f => f.file);
  
  logger.info('Extracting data from files', {
    guiasCount: guiasFiles.length,
    demonstrativosCount: demonstrativosFiles.length,
    crmRegistrado: crmRegistrado || 'none'
  });
  
  if (processMode === 'complete' || processMode === 'guia-only') {
    // Extract data from guide files
    const guiasData = await extrairDadosDePDFs(guiasFiles);
    
    logger.debug('Data extracted from guides', { count: guiasData.length });
    
    // Process the guides
    if (processMode === 'complete' && demonstrativosFiles.length > 0) {
      // In a real production environment, we would also process demonstrativo files
      // and combine the data from both sources
      return processarMultiplasGuias(guiasData, crmRegistrado);
    } else {
      return processarMultiplasGuias(guiasData, crmRegistrado);
    }
  } else {
    // Simple demonstrativo-only processing
    logger.info('Processing demonstrativo-only mode');
    return {
      demonstrativoInfo: {
        numero: 'DM' + Math.floor(Math.random() * 1000000),
        competencia: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        hospital: 'Hospital Demonstrativo',
        data: new Date().toLocaleDateString('pt-BR'),
        beneficiario: 'Paciente Demonstrativo'
      },
      procedimentos: [],
      totais: {
        valorCBHPM: 0,
        valorPago: 0,
        diferenca: 0,
        procedimentosNaoPagos: 0
      }
    };
  }
}

/**
 * Extract data from PDF files
 * @param pdfs PDF files to extract data from
 * @returns Extracted guide data
 */
export async function extrairDadosDePDFs(pdfs: File[]): Promise<GuiaData[]> {
  logger.info('Extracting data from PDFs', { count: pdfs.length });
  
  // In a real environment, this would use a PDF parsing library
  // For now, we'll return simulated data
  return [{
    numero: "10467538",
    execucao: "178584",
    beneficiario: {
      codigo: "00620040000604690",
      nome: "THAYSE BORGES"
    },
    prestador: {
      codigo: "11000010",
      nome: "LIGA NORTERIOG CANCER POLICLINIC"
    },
    procedimentos: [
      {
        codigo: "30602246",
        descricao: "Reconstrução Mamária Com Retalhos Cutâneos Regionais",
        dataExecucao: "19/08/2024",
        quantidade: 2,
        status: "Gerado pela execução",
        participacoes: [
          {
            funcao: "Anestesista",
            crm: "4127",
            nome: "LILIANE ANNUZA DA SILVA",
            dataInicio: "19/08/2024 15:17",
            dataFim: "19/08/2024 15:43",
            status: "Fechada"
          },
          {
            funcao: "Cirurgiao",
            crm: "8425",
            nome: "FERNANDA MABEL BATISTA DE AQUINO",
            dataInicio: "19/08/2024 14:09",
            dataFim: "19/08/2024 15:24",
            status: "Fechada"
          },
          {
            funcao: "Primeiro Auxiliar",
            crm: "6091",
            nome: "MOISES DE OLIVEIRA SCHOTS",
            dataInicio: "19/08/2024 14:15",
            dataFim: "19/08/2024 15:17",
            status: "Fechada"
          }
        ]
      },
      {
        codigo: "30602076",
        descricao: "Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll",
        dataExecucao: "19/08/2024",
        quantidade: 1,
        status: "Gerado pela execução",
        participacoes: [
          {
            funcao: "Anestesista",
            crm: "4127",
            nome: "LILIANE ANNUZA DA SILVA",
            dataInicio: "19/08/2024 15:17",
            dataFim: "19/08/2024 15:43",
            status: "Fechada"
          },
          {
            funcao: "Cirurgiao",
            crm: "8425",
            nome: "FERNANDA MABEL BATISTA DE AQUINO",
            dataInicio: "19/08/2024 14:09",
            dataFim: "19/08/2024 15:24",
            status: "Fechada"
          },
          {
            funcao: "Primeiro Auxiliar",
            crm: "6091",
            nome: "MOISES DE OLIVEIRA SCHOTS",
            dataInicio: "19/08/2024 14:15",
            dataFim: "19/08/2024 15:17",
            status: "Fechada"
          }
        ]
      }
    ]
  }];
}
