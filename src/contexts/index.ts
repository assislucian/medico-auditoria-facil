
/**
 * index.ts
 * 
 * Re-exporta o contexto de autenticação para manter compatibilidade
 * com a estrutura de importação existente.
 */

// Re-export from AuthContext.tsx to maintain the existing import structure
export { AuthProvider, useAuth, AuthContext } from './AuthContext';
export type { AuthContextProps } from './AuthContext';
