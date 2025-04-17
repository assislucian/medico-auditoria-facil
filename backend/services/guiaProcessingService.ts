
/**
 * Service for processing medical guides (TISS)
 */
import { logger } from '../utils/logger';
import { ExtractedData, GuiaData, ProcedimentoGuia, ParticipacaoMedica } from '../models/types';
import { getCBHPMByCode } from './databaseService';

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
