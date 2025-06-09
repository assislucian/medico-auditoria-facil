
/**
 * AuthContext.ts
 * 
 * Re-exports the context of authentication from auth/index.tsx
 * to maintain compatibility with the existing import structure.
 */

// This is a re-export file to maintain backward compatibility with existing imports
export { AuthProvider, useAuth } from './auth';
export type { AuthContextProps } from './auth/types';
