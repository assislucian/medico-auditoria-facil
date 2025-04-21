
export const MEDCHECK_COLORS = {
  primary: {
    50: '#EBF8FF',   // Azul claro
    100: '#D1EEFC',
    300: '#7CC1E4',
    500: '#3182CE',  // Azul principal
    700: '#2C5282',
    900: '#1A365D'
  },
  secondary: {
    50: '#F0F9E6',   // Verde suave
    100: '#DCFCB8',
    300: '#A0D970',
    500: '#68C239',  // Verde médico
    700: '#389016',
    900: '#1E5209'
  },
  neutral: {
    50: '#F7FAFC',   // Tons neutros
    100: '#EDF2F7',
    300: '#CBD5E0',
    500: '#718096',  // Cinza médio
    700: '#4A5568',
    900: '#1A202C'
  },
  accent: {
    error: '#E53E3E',    // Vermelho para erros
    warning: '#ED8936',  // Laranja para alertas
    success: '#48BB78', // Verde para sucessos
    info: '#4299E1'     // Azul para informações
  }
};

export type ColorPalette = typeof MEDCHECK_COLORS;
