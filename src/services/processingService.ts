
import { ProcessingStage, ProcessMode, FileWithStatus, ExtractedData } from '@/types/upload';
import { getAnalysisMessage, getCompletionMessage } from './messageUtils';
import { cbhpmTable, findProcedureByCodigo, calculateTotalCBHPM } from '@/data/cbhpmData';

/**
 * Simula os estágios de processamento dos arquivos
 */
export async function simulateProcessingStages(
  processMode: ProcessMode,
  setProgress: (progress: number) => void,
  setProcessingStage: (stage: ProcessingStage) => void,
  setProcessingMsg: (msg: string) => void
): Promise<void> {
  // Estágio 1: Extração de dados
  setProcessingMsg('Extraindo dados dos documentos...');
  setProcessingStage('extracting');
  await simulateProgress(1, 30, setProgress);
  
  // Estágio 2: Análise de procedimentos
  setProcessingStage('analyzing');
  setProcessingMsg(getAnalysisMessage(processMode));
  await simulateProgress(31, 60, setProgress);
  
  // Estágio 3: Comparação (apenas para modo completo)
  if (processMode === 'complete') {
    setProcessingStage('comparing');
    setProcessingMsg('Comparando valores pagos com referência CBHPM e calculando diferenças...');
    await simulateProgress(61, 95, setProgress);
  } else {
    setProgress(95);
  }
  
  // Finalizar processamento
  setProgress(100);
  setProcessingStage('complete');
  setProcessingMsg(getCompletionMessage(processMode));
  
  await new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * Simula o progresso do processamento
 */
export async function simulateProgress(
  start: number,
  end: number,
  setProgress: (progress: number) => void
): Promise<void> {
  for (let i = start; i <= end; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    setProgress(i);
  }
}

/**
 * Processa múltiplas guias para extração de dados sem duplicatas
 * @param guias Array de dados brutos das guias
 * @param crmRegistrado CRM do médico registrado
 * @returns Dados extraídos e processados
 */
export function processarMultiplasGuias(guias: any[], crmRegistrado: string = ""): ExtractedData {
  // Deduplica guias usando o número como chave
  const guiasUnicas = dedupliqueGuias(guias);

  // Inicializa os dados extraídos
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

  // Processa cada guia única
  guiasUnicas.forEach(guia => {
    if (!verificaCRMValido(guia, crmRegistrado)) {
      // Adiciona um marcador para guia com CRM inválido
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
    
    // Processa procedimentos da guia
    (guia.procedimentos || []).forEach(proc => {
      const cbhpmInfo = findProcedureByCodigo(proc.codigo);
      const valorCBHPM = cbhpmInfo ? calculateTotalCBHPM(cbhpmInfo) : 0;
      
      // Valor pago simulado - em produção viria do demonstrativo
      const valorPago = proc.valorPago || valorCBHPM * Math.random() * 0.9;
      const diferenca = valorPago - valorCBHPM;
      const pago = valorPago > 0;
      
      // Prepara os médicos participantes, filtrando apenas o CRM registrado se fornecido
      const doctors = prepararDoctors(proc.participacoes, crmRegistrado);
      
      // Adiciona o procedimento aos dados extraídos
      extractedData.procedimentos.push({
        id: `${guia.numero}-${proc.codigo}-${Math.random().toString(36).substring(7)}`,
        codigo: proc.codigo,
        procedimento: proc.descricao || cbhpmInfo?.descricao || "Procedimento não especificado",
        papel: doctors[0]?.role || "Não especificado",
        valorCBHPM,
        valorPago,
        diferenca,
        pago,
        guia: guia.numero,
        beneficiario: guia.beneficiario?.nome || "Não especificado",
        doctors
      });
      
      // Atualiza os totais
      extractedData.totais.valorCBHPM += valorCBHPM;
      extractedData.totais.valorPago += valorPago;
      extractedData.totais.diferenca += diferenca;
      if (!pago) extractedData.totais.procedimentosNaoPagos += 1;
    });
  });

  return extractedData;
}

/**
 * Deduplica guias usando o número como chave
 */
function dedupliqueGuias(guias: any[]): any[] {
  const uniqueGuias = new Map();
  guias.forEach(guia => {
    const numero = guia.numero || guia.guia || Math.random().toString(36).substring(7);
    if (!uniqueGuias.has(numero)) {
      uniqueGuias.set(numero, guia);
    }
  });
  return Array.from(uniqueGuias.values());
}

/**
 * Verifica se o CRM registrado é válido para a guia
 */
function verificaCRMValido(guia: any, crmRegistrado: string): boolean {
  // Se não há CRM registrado, não fazemos validação
  if (!crmRegistrado) return true;
  
  // Verifica se algum médico na guia tem o CRM correspondente
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
 * Prepara os dados de médicos participantes
 */
function prepararDoctors(participacoes: any[] = [], crmRegistrado: string): any[] {
  // Se tem CRM registrado, filtrar apenas os registros correspondentes
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

/**
 * Extrai e formata dados de múltiplas guias a partir de PDFs
 * @param pdfs Array de arquivos PDF
 * @returns Dados extraídos e formatados
 */
export async function extrairDadosDePDFs(pdfs: File[]): Promise<any[]> {
  // Em um ambiente real, esta função usaria uma biblioteca como PDF.js 
  // para extrair o texto e depois analisar o conteúdo
  console.log("Simulando extração de dados de PDFs:", pdfs.length, "arquivos");
  
  // Retorna um exemplo de dados simulados
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
      },
      {
        codigo: "30602203",
        descricao: "Quadrantectomia - Ressecção Segmentar",
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
 * Exporta função de parser para uso específico de multiguias
 */
export function processarLoteMultiGuia(guias: any[]): ExtractedData {
  const resultado = processarMultiplasGuias(guias);
  console.log("OK FORMATO MULTIGUIA");
  return resultado;
}
