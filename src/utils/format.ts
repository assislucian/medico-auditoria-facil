
/**
 * Format a number as Brazilian currency
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Format a date string to Brazilian format (DD/MM/YYYY)
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  } catch (e) {
    return dateStr; // If it fails, return the original string
  }
}

/**
 * Truncate text with ellipsis if it exceeds maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
