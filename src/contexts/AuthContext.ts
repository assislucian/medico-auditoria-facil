
import { createContext } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import type { AuthContextProps } from './auth/types';

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  loading: true,
  isAuthenticated: false
});

export { AuthProvider, useAuth };
export type { AuthContextProps };
export default AuthContext;
