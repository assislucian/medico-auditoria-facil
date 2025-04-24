
/**
 * processingService.ts
 * 
 * Serviço para simulação do processamento de arquivos.
 * Fornece feedback visual durante o upload e processamento.
 */

import { ProcessingStage, ProcessMode } from '@/types/upload';

/**
 * Simula etapas de processamento para feedback visual 
 * @param processMode Modo de processamento (completo, somente guia, somente demonstrativo)
 * @param setProgress Função para atualizar o progresso
 * @param setProcessingStage Função para atualizar o estágio de processamento
 * @param setProcessingMsg Função para atualizar a mensagem de processamento
 */
export async function simulateProcessingStages(
  processMode: ProcessMode,
  setProgress: (progress: number) => void,
  setProcessingStage: (stage: ProcessingStage) => void,
  setProcessingMsg: (msg: string) => void
): Promise<void> {
  // Etapa 1: Extração
  setProgress(5);
  setProcessingStage('extracting');
  setProcessingMsg('Extraindo dados dos documentos...');
  await delay(1000);
  
  // Etapa 2: Upload
  setProgress(20);
  setProcessingStage('uploading');
  setProcessingMsg('Enviando arquivos para processamento...');
  await delay(1000);
  
  // Etapa 3: Análise (somente para guia ou completo)
  if (processMode === 'guia-only' || processMode === 'complete') {
    setProgress(40);
    setProcessingStage('analyzing');
    setProcessingMsg('Analisando procedimentos com tabela CBHPM...');
    await delay(1500);
  }
  
  // Etapa 4: Comparação (somente para modo completo)
  if (processMode === 'complete') {
    setProgress(60);
    setProcessingStage('comparing');
    setProcessingMsg('Comparando valores entre guia e demonstrativo...');
    await delay(1500);
  }
  
  // Progresso até etapa final
  setProgress(85);
  setProcessingMsg('Finalizando processamento...');
  await delay(500);
  
  // Etapa final: concluído
  setProgress(95); // Não vai até 100%, isso será feito pela função chamadora
}

/**
 * Utilitário para criar atrasos controlados
 * @param ms Tempo em milissegundos
 * @returns Promise resolvida após o tempo especificado
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
