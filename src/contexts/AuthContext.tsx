
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types';
import { toast } from 'sonner';

// Define AuthContext props type
export interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  getProfile: () => Promise<Profile | null>;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  signInWithPassword: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  updateProfile: async () => {},
  getProfile: async () => null,
});

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Get profile data from Supabase
  const getProfileData = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // useEffect to handle auth state changes
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setLoading(true);
      try {
        console.log('Loading initial session...');
        const { data: { session } } = await supabase.auth.getSession();

        if (isMounted) {
          setSession(session);
          setUser(session?.user || null);
        }

        if (session?.user && isMounted) {
          console.log('Initial session found, loading profile data...');
          try {
            // Set a timeout to prevent getting stuck
            const profilePromise = getProfileData(session.user.id);
            const timeoutPromise = new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
            );
            
            const profileData = await Promise.race([profilePromise, timeoutPromise]);
            
            if (profileData && isMounted) {
              console.log('Profile data loaded successfully');
              setProfile(profileData);
            }
          } catch (profileError) {
            console.error("Error loading profile data:", profileError);
          }
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        if (isMounted) {
          console.log('Initial session loading complete');
          setLoading(false);
        }
      }
    };

    // Set up auth listener first to capture subsequent changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("Auth state change event:", _event);
      
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user || null);
      }
      
      // Use setTimeout to avoid calling Supabase functions directly within the callback
      if (newSession?.user) {
        setTimeout(async () => {
          if (!isMounted) return;
          
          try {
            const profileData = await getProfileData(newSession.user!.id);
            if (profileData && isMounted) {
              setProfile(profileData);
            }
          } catch (err) {
            console.error("Error fetching profile after auth change:", err);
          }
        }, 0);
      } else if (isMounted) {
        setProfile(null);
      }
    });

    // Then load the initial session
    loadSession();

    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Authentication methods
  const signInWithPassword = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (result.error) {
        if (result.error.message.includes('Email not confirmed')) {
          throw new Error('Por favor, verifique seu email para ativar sua conta.');
        }
        throw result.error;
      }
      
      return result;
    } catch (error: any) {
      console.error("Error during signInWithPassword:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: redirectTo
        }
      });
      
      if (error) throw error;
      
      toast.success('Confira seu email para ativar sua conta!');
      return data;
    } catch (error: any) {
      console.error("Error during signUp:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      toast.success('Email de recuperação enviado. Verifique sua caixa de entrada.');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar email de recuperação');
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      console.log("Iniciando atualização de senha");
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error("Erro ao atualizar senha:", error);
        throw error;
      }
      toast.success('Senha atualizada com sucesso!');
    } catch (error: any) {
      console.error("Erro completo na atualização de senha:", error);
      toast.error(error.message || 'Erro ao atualizar senha');
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
      throw error;
    }
  };

  const getProfile = async () => {
    try {
      if (!user) return null;
      return profile;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Create the context value
  const value: AuthContextProps = {
    session,
    user,
    profile,
    loading,
    isAuthenticated: !!session,
    signInWithPassword,
    signUp,
    signOut: handleSignOut,
    resetPassword: handlePasswordReset,
    updatePassword,
    updateProfile: updateUserProfile,
    getProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
