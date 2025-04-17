
import { toast } from 'sonner';
import { ProcessingStage, FileWithStatus, ProcessMode, ExtractedData } from '@/types/upload';
import { getProcessMode, getSuccessMessage, getSuccessDescription } from './messageUtils';
import { simulateProcessingStages, processarMultiplasGuias, extrairDadosDePDFs } from './processingService';
import { saveAnalysisToDatabase } from './databaseService';

// Store the extracted data in memory for components to access
let currentExtractedData: ExtractedData | null = null;

/**
 * Processa os arquivos de upload para extração de dados
 * 
 * @param files Lista de arquivos para processamento
 * @param setProgress Função para atualizar o progresso do processamento
 * @param setProcessingStage Função para atualizar o estágio do processamento
 * @param setProcessingMsg Função para atualizar a mensagem de processamento
 * @returns Boolean indicando sucesso ou falha no processamento
 */
export async function processFiles(
  files: FileWithStatus[],
  setProgress: (progress: number) => void,
  setProcessingStage: (stage: ProcessingStage) => void,
  setProcessingMsg: (msg: string) => void
): Promise<boolean> {
  try {
    const hasGuias = files.some(f => f.type === 'guia' && f.status === 'valid');
    const hasDemonstrativos = files.some(f => f.type === 'demonstrativo' && f.status === 'valid');
    
    // Determinar o modo de processamento com base nos arquivos disponíveis
    const processMode = getProcessMode(hasGuias, hasDemonstrativos);
    
    // Simular os estágios de processamento
    await simulateProcessingStages(processMode, setProgress, setProcessingStage, setProcessingMsg);
    
    // Extrair e processar dados dos arquivos
    const extractedData = await extractDataFromFiles(files, processMode);

    // Salvar os dados extraídos na variável de memória para acesso pelos componentes
    currentExtractedData = extractedData;

    // Salvar os dados no banco de dados
    const success = await saveAnalysisToDatabase(files, processMode, extractedData);
    
    if (!success) {
      throw new Error('Falha ao salvar os dados da análise no banco de dados');
    }
    
    // Exibir toast de sucesso
    toast.success(getSuccessMessage(processMode), {
      description: getSuccessDescription(processMode)
    });
    
    return true;
  } catch (error) {
    console.error('Erro no processamento:', error);
    toast.error('Erro ao processar os arquivos', {
      description: 'Por favor, tente novamente ou contate o suporte.'
    });
    return false;
  }
}

/**
 * Extrai dados dos arquivos com base no tipo
 * 
 * @param files Arquivos para processamento
 * @param processMode Modo de processamento
 * @returns Dados extraídos dos arquivos
 */
async function extractDataFromFiles(files: FileWithStatus[], processMode: ProcessMode) {
  // Filtrar apenas os arquivos válidos
  const validFiles = files.filter(f => f.status === 'valid');
  
  // Separar os arquivos por tipo
  const guiasFiles = validFiles.filter(f => f.type === 'guia').map(f => f.file);
  const demonstrativosFiles = validFiles.filter(f => f.type === 'demonstrativo').map(f => f.file);
  
  // Em um cenário real, extrairíamos dados reais dos PDFs
  // Aqui estamos usando funções de simulação
  
  if (processMode === 'complete' || processMode === 'guia-only') {
    // Extrair dados das guias (PDFs)
    const guiasData = await extrairDadosDePDFs(guiasFiles);
    
    // Processar as guias e demonstrativos
    if (processMode === 'complete' && demonstrativosFiles.length > 0) {
      // Em produção: processar dados de ambos guias e demonstrativos
      // Para demonstração, usamos o processarMultiplasGuias
      return processarMultiplasGuias(guiasData);
    } else {
      // Processamento somente com guias
      return processarMultiplasGuias(guiasData);
    }
  } else {
    // Processamento somente com demonstrativos (simplificado para demonstração)
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
 * Obtém os dados extraídos do último processamento
 * 
 * @returns Os dados extraídos ou dados simulados caso não haja dados disponíveis
 */
export function getExtractedData(): ExtractedData {
  // Retorna os dados extraídos se disponíveis
  if (currentExtractedData) {
    return currentExtractedData;
  }
  
  // Retorna dados simulados caso não haja dados disponíveis
  return {
    demonstrativoInfo: {
      numero: 'DM' + Math.floor(Math.random() * 1000000),
      competencia: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      hospital: 'Hospital Demonstrativo',
      data: new Date().toLocaleDateString('pt-BR'),
      beneficiario: 'Paciente Demonstrativo'
    },
    procedimentos: [
      {
        id: 'proc-1',
        codigo: '30602246',
        procedimento: 'Reconstrução Mamária Com Retalhos Cutâneos Regionais',
        papel: 'Cirurgiao',
        valorCBHPM: 3772.88,
        valorPago: 3200.50,
        diferenca: -572.38,
        pago: true,
        guia: '10467538',
        beneficiario: 'THAYSE BORGES',
        doctors: [
          {
            code: '8425',
            name: 'FERNANDA MABEL BATISTA DE AQUINO',
            role: 'Cirurgiao',
            startTime: '19/08/2024 14:09',
            endTime: '19/08/2024 15:24',
            status: 'Fechada'
          }
        ]
      },
      {
        id: 'proc-2',
        codigo: '30602076',
        procedimento: 'Exérese De Lesão Da Mama Por Marcação Estereotáxica Ou Roll',
        papel: 'Cirurgiao',
        valorCBHPM: 2450.65,
        valorPago: 2100.30,
        diferenca: -350.35,
        pago: true,
        guia: '10467538',
        beneficiario: 'THAYSE BORGES',
        doctors: [
          {
            code: '8425',
            name: 'FERNANDA MABEL BATISTA DE AQUINO',
            role: 'Cirurgiao',
            startTime: '19/08/2024 14:09',
            endTime: '19/08/2024 15:24',
            status: 'Fechada'
          }
        ]
      }
    ],
    totais: {
      valorCBHPM: 6223.53,
      valorPago: 5300.80,
      diferenca: -922.73,
      procedimentosNaoPagos: 0
    }
  };
}
