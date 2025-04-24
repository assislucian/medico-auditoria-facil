
import { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import type { AuthContextProps } from './types';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { session, user, profile, loading } = useAuthState();
  const actions = useAuthActions();
  
  // Calculate isAuthenticated based on session presence
  const isAuthenticated = !!session;

  const value: AuthContextProps = {
    session,
    user,
    profile,
    loading,
    isAuthenticated,
    ...actions,
    getProfile: async () => {
      if (!user) return null;
      return profile;
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
