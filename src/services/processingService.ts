
import { ProcessingStage, ProcessMode } from '@/types/upload';
import { getAnalysisMessage, getCompletionMessage } from './messageUtils';

/**
 * Simula os estágios de processamento dos arquivos
 * Esta função mantém a experiência do usuário enquanto aguarda os processos reais
 * de backend ocorrerem.
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
 * Utilizado apenas para feedback visual ao usuário
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
