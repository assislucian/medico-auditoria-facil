
import { createContext } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';

export interface AuthContextProps {
  session: any | null;
  loading: boolean;
  isAuthenticated: boolean; // Ensuring this property exists in the interface
  user?: any;
  profile?: any;
  signInWithPassword?: (email: string, password: string) => Promise<any>;
  signUp?: (email: string, password: string) => Promise<any>;
  signOut?: () => Promise<any>;
  getProfile?: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextProps>({
  session: null,
  loading: true,
  isAuthenticated: false
});

export { AuthProvider, useAuth };
export default AuthContext;
