
/**
 * Service for processing uploaded files and extracting data
 */
import { logger } from '../utils/logger';
import { ExtractedData, GuiaData, FileWithStatus, ProcedimentoGuia, ParticipacaoMedica } from '../models/types';
import { getCBHPMByCode } from './databaseService';

/**
 * Type for processing mode
 */
type ProcessMode = 'complete' | 'guia-only' | 'demonstrativo-only';

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

/**
 * Process multiple guides to extract data
 * @param guias Guide data
 * @param crmRegistrado CRM to filter by
 * @returns Processed data
 */
export function processarMultiplasGuias(guias: GuiaData[], crmRegistrado: string = ""): ExtractedData {
  logger.info('Processing multiple guides', { count: guias.length, crmRegistrado });
  
  // Deduplicate guides by number
  const guiasUnicas = dedupliqueGuias(guias);
  
  // Initialize extracted data
  const extractedData: ExtractedData = {
    demonstrativoInfo: {
      numero: "",
      competencia: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      hospital: guiasUnicas[0]?.prestador?.nome || "Hospital não especificado",
      data: new Date().toLocaleDateString('pt-BR'),
      beneficiario: guiasUnicas[0]?.beneficiario?.nome || "Beneficiário não especificado"
    },
    procedimentos: [],
    totais: {
      valorCBHPM: 0,
      valorPago: 0,
      diferenca: 0,
      procedimentosNaoPagos: 0
    }
  };
  
  // Process each unique guide
  guiasUnicas.forEach(async (guia) => {
    if (!verificaCRMValido(guia, crmRegistrado)) {
      // Add invalid CRM marker
      extractedData.procedimentos.push({
        id: `invalid-${guia.numero || Math.random().toString(36).substring(7)}`,
        codigo: "N/A",
        procedimento: `Guia ${guia.numero} não processada: CRM inválido`,
        papel: "N/A",
        valorCBHPM: 0,
        valorPago: 0,
        diferenca: 0,
        pago: false,
        guia: guia.numero || "N/A",
        beneficiario: guia.beneficiario?.nome || "N/A",
        doctors: []
      });
      return;
    }
    
    // Process procedures for this guide
    (guia.procedimentos || []).forEach(async (proc) => {
      // Look up CBHPM data
      const cbhpmData = await getCBHPMValoresByCodigo(proc.codigo);
      const valorCBHPM = cbhpmData?.valor_cirurgiao ? parseFloat(cbhpmData.valor_cirurgiao) : 0;
      
      // Simulate paid value - in production would come from fee statements
      const valorPago = proc.valorPago || valorCBHPM * (0.7 + Math.random() * 0.2); // 70-90% of CBHPM
      const diferenca = valorPago - valorCBHPM;
      const pago = valorPago > 0;
      
      // Filter doctors by CRM if provided
      const doctors = prepararDoctors(proc.participacoes, crmRegistrado);
      
      // Add procedure to extracted data
      extractedData.procedimentos.push({
        id: `${guia.numero}-${proc.codigo}-${Math.random().toString(36).substring(7)}`,
        codigo: proc.codigo,
        procedimento: proc.descricao || cbhpmData?.procedimento || "Procedimento não especificado",
        papel: doctors[0]?.role || "Não especificado",
        valorCBHPM,
        valorPago,
        diferenca,
        pago,
        guia: guia.numero,
        beneficiario: guia.beneficiario?.nome || "Não especificado",
        doctors
      });
      
      // Update totals
      extractedData.totais.valorCBHPM += valorCBHPM;
      extractedData.totais.valorPago += valorPago;
      extractedData.totais.diferenca += diferenca;
      if (!pago) extractedData.totais.procedimentosNaoPagos += 1;
    });
  });
  
  return extractedData;
}

/**
 * Helper function to get CBHPM values by code
 * Uses database service
 * @param codigo CBHPM code
 * @returns CBHPM data
 */
async function getCBHPMValoresByCodigo(codigo: string): Promise<any> {
  return await getCBHPMByCode(codigo);
}

/**
 * Helper function to deduplicate guides by number
 * @param guias Guide data
 * @returns Deduplicated guide data
 */
function dedupliqueGuias(guias: GuiaData[]): GuiaData[] {
  const uniqueGuias = new Map();
  guias.forEach(guia => {
    const numero = guia.numero || guia.execucao || Math.random().toString(36).substring(7);
    if (!uniqueGuias.has(numero)) {
      uniqueGuias.set(numero, guia);
    }
  });
  return Array.from(uniqueGuias.values());
}

/**
 * Helper function to check if CRM is valid for guide
 * @param guia Guide data
 * @param crmRegistrado CRM to check
 * @returns Whether CRM is valid
 */
function verificaCRMValido(guia: GuiaData, crmRegistrado: string): boolean {
  // If no CRM provided, don't validate
  if (!crmRegistrado) return true;
  
  // Check if any doctor in guide has matching CRM
  const procedimentos = guia.procedimentos || [];
  for (const proc of procedimentos) {
    const participacoes = proc.participacoes || [];
    for (const part of participacoes) {
      if (part.crm === crmRegistrado) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Helper function to prepare doctor participation data
 * @param participacoes Participation data
 * @param crmRegistrado CRM to filter by
 * @returns Prepared doctor data
 */
function prepararDoctors(participacoes: ParticipacaoMedica[] = [], crmRegistrado: string): any[] {
  // Filter by CRM if provided
  const filtered = crmRegistrado 
    ? participacoes.filter(p => p.crm === crmRegistrado) 
    : participacoes;
    
  return filtered.map(p => ({
    code: p.crm || "",
    name: p.nome || "",
    role: p.funcao || "",
    startTime: p.dataInicio || "",
    endTime: p.dataFim || "",
    status: p.status || "Não especificado"
  }));
}
