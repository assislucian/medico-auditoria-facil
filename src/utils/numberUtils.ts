
/**
 * numberUtils.ts
 * 
 * Funções utilitárias para manipulação de números.
 * Inclui formatadores, validadores e funções de cálculo.
 */

/**
 * Formata valor para moeda brasileira (Real)
 * @param value Valor numérico a ser formatado
 * @param showSymbol Exibir símbolo da moeda (R$)
 * @returns String formatada
 */
export function formatCurrency(value: number, showSymbol: boolean = true): string {
  return new Intl.NumberFormat('pt-BR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formata número com pontos de milhar
 * @param value Valor numérico a ser formatado
 * @returns String formatada
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Converte uma string para número
 * @param value String a ser convertida
 * @param defaultValue Valor padrão caso a conversão falhe
 * @returns Número convertido ou valor padrão
 */
export function parseNumber(value: string, defaultValue: number = 0): number {
  // Remover símbolos de moeda, pontos de milhar e substituir vírgulas por pontos
  const sanitized = value
    .replace(/[^\d,-]/g, '')
    .replace('.', '')
    .replace(',', '.');
  
  const number = Number(sanitized);
  return isNaN(number) ? defaultValue : number;
}

/**
 * Calcula a diferença percentual entre dois valores
 * @param currentValue Valor atual
 * @param previousValue Valor anterior
 * @returns Percentual de diferença
 */
export function calculatePercentageDifference(currentValue: number, previousValue: number): number {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}

/**
 * Gera um número inteiro aleatório
 * @param min Valor mínimo (inclusivo)
 * @param max Valor máximo (inclusivo)
 * @returns Número inteiro aleatório
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Limita um número entre valores mínimo e máximo
 * @param value Valor a ser limitado
 * @param min Valor mínimo
 * @param max Valor máximo
 * @returns Valor limitado
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Arredonda para o número de casas decimais especificado
 * @param value Valor a ser arredondado
 * @param decimals Número de casas decimais
 * @returns Valor arredondado
 */
export function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
