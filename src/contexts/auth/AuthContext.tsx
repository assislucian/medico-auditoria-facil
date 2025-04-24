
import { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { AuthContextProps } from './types';

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, isAuthenticated, loading } = useAuthState();
  const actions = useAuthActions(user?.id);

  // Combine state and actions to create context value
  const contextValue: AuthContextProps = {
    user,
    session,
    isAuthenticated,
    loading,
    ...actions
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
