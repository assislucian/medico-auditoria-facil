
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { AuthContextProps, UserProfile } from './types';
import { toast } from 'sonner';

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, isAuthenticated, loading: authStateLoading } = useAuthState();
  const actions = useAuthActions(user?.id);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Fetch user profile data when user is authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !userProfile) {
        setProfileLoading(true);
        try {
          const profile = await actions.getProfile();
          if (profile) {
            setUserProfile(profile);
            console.log('User profile loaded successfully');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Erro ao carregar dados do perfil');
        } finally {
          setProfileLoading(false);
        }
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, actions, userProfile]);

  // For CRM validation - Check if current user has valid CRM
  const validateUserCRM = async (crmToCheck: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // If user has a profile and the CRM matches
      if (userProfile?.crm === crmToCheck) {
        return true;
      }
      
      // Otherwise verify with RPC function
      const { data, error } = await supabase.rpc('verify_crm', { crm_to_verify: crmToCheck });
      
      if (error) {
        console.error('Error validating CRM:', error);
        return false;
      }
      
      return Boolean(data);
    } catch (error) {
      console.error('Exception during CRM validation:', error);
      return false;
    }
  };

  // Combine state and actions to create context value
  const contextValue: AuthContextProps = {
    user: user as User,
    session,
    isAuthenticated,
    loading: authStateLoading || profileLoading,
    userProfile,
    validateUserCRM,
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
