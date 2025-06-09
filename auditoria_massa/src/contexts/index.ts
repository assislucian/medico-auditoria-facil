
/**
 * index.ts
 * 
 * Re-exports the context of authentication to maintain compatibility
 * with the existing import structure.
 */

// Re-export from AuthContext.ts to maintain the existing import structure
export { AuthProvider, useAuth } from './auth';
export type { AuthContextProps } from './auth/types';
