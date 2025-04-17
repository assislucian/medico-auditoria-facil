
import { ProcessMode } from '@/types/upload';

/**
 * Determina o modo de processamento com base nos tipos de arquivos disponíveis
 */
export function getProcessMode(hasGuias: boolean, hasDemonstrativos: boolean): ProcessMode {
  if (hasGuias && hasDemonstrativos) return 'complete';
  if (hasGuias) return 'guia-only';
  return 'demonstrativo-only';
}

/**
 * Retorna a mensagem apropriada para o estágio de análise
 */
export function getAnalysisMessage(mode: ProcessMode): string {
  switch (mode) {
    case 'complete':
      return 'Identificando procedimentos e consultando tabela CBHPM 2015...';
    case 'guia-only':
      return 'Identificando procedimentos nas guias médicas...';
    case 'demonstrativo-only':
      return 'Extraindo valores e procedimentos do demonstrativo de pagamento...';
  }
}

/**
 * Retorna a mensagem apropriada para o estágio de conclusão
 */
export function getCompletionMessage(mode: ProcessMode): string {
  switch (mode) {
    case 'complete':
      return 'Análise completa concluída com sucesso!';
    case 'guia-only':
      return 'Extração de dados das guias concluída!';
    case 'demonstrativo-only':
      return 'Extração de dados do demonstrativo concluída!';
  }
}

/**
 * Retorna a mensagem de sucesso apropriada para o tipo de processamento
 */
export function getSuccessMessage(mode: ProcessMode): string {
  switch (mode) {
    case 'complete':
      return 'Análise concluída com sucesso!';
    case 'guia-only':
      return 'Guias processadas com sucesso!';
    case 'demonstrativo-only':
      return 'Demonstrativo processado com sucesso!';
  }
}

/**
 * Retorna a descrição de sucesso apropriada para o tipo de processamento
 */
export function getSuccessDescription(mode: ProcessMode): string {
  switch (mode) {
    case 'complete':
      return 'Os resultados da comparação estão disponíveis abaixo.';
    case 'guia-only':
      return 'Adicione um demonstrativo para comparar valores com tabelas CBHPM.';
    case 'demonstrativo-only':
      return 'Adicione guias para verificar procedimentos realizados.';
  }
}
