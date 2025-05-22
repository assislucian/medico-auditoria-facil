import { ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { AuthContext } from './AuthContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getProfileData } from './authUtils';
import { supabase } from '@/integrations/supabase/client';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, session, isAuthenticated, loading: authStateLoading } = useAuthState();
  const actions = useAuthActions(user?.id);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Fetch user profile data when user is authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !userProfile) {
        setProfileLoading(true);
        try {
          // Instead of using actions.getProfile(), we'll use our helper function
          // that currently uses mock data until the database is set up
          const profile = await getProfileData(user.id);
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
  }, [user, userProfile]);

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
      
      return data || false;
    } catch (error) {
      console.error('Exception during CRM validation:', error);
      return false;
    }
  };

  // Combine state and actions to create context value
  const contextValue = {
    user,
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
