
import { createContext, useContext } from 'react';
import { AuthContextProps } from './types';

// Create context
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
