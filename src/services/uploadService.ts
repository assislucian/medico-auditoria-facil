
import { toast } from 'sonner';
import { ProcessingStage, FileWithStatus, ProcessMode } from '@/types/upload';
import { getExtractedMockData } from './mockData';
import { 
  getProcessMode, 
  getSuccessMessage,
  getSuccessDescription 
} from './messageUtils';
import { simulateProcessingStages } from './processingService';
import { saveAnalysisToDatabase } from './databaseService';

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
    
    // Extrair os dados
    const extractedData = getExtractedData(hasGuias, hasDemonstrativos);

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
 * Retorna dados extraídos com base nos tipos de arquivos disponíveis
 * @param hasGuias Indica se há guias disponíveis
 * @param hasDemonstrativos Indica se há demonstrativos disponíveis
 */
export function getExtractedData(hasGuias: boolean = true, hasDemonstrativos: boolean = true) {
  // Em um cenário real, retornaríamos dados parciais baseados no que foi processado
  return getExtractedMockData();
}
