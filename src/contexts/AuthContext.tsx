import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/utils/supabaseHelpers";
import { Json } from '@/integrations/supabase/types';

interface AuthContextProps {
  session: Session | null;
  user: Session['user'] | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  getProfile: () => Promise<Profile | null>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Session['user'] | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const profileData = await getProfile(supabase, session.user.id);
          
          if (profileData) {
            setProfile(profileData as Profile);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        getProfile(supabase, session.user.id).then(profileData => {
          if (profileData) {
            setProfile(profileData as Profile);
          }
        });
      } else {
        setProfile(null);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string) => {
    try {
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback`;
      
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: redirectTo
        }
      });
      
      if (error) throw error;
      toast.success('Verifique seu email para o link de login mágico!');
    } catch (error: any) {
      toast.error(error.error_description || error.message || 'Erro ao fazer login');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback`;
      
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: redirectTo
        }
      });
      
      if (error) throw error;
      toast.success('Verifique seu email para confirmar o cadastro!');
    } catch (error: any) {
      toast.error(error.error_description || error.message || 'Erro ao criar conta');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const origin = window.location.origin;
      const redirectTo = `${origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });
      
      if (error) throw error;
      toast.success('Email com instruções para redefinir senha enviado!');
    } catch (error: any) {
      toast.error(error.error_description || error.message || 'Erro ao enviar email de redefinição de senha');
      console.error('Erro detalhado de resetPassword:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      setProfile(null);
      toast.success('Logout realizado com sucesso');
    } catch (error: any) {
      toast.error(error.error_description || error.message || 'Erro ao fazer logout');
    }
  };

  const updateUserProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      const success = await updateProfile(supabase, user.id, data as any);
      
      if (!success) {
        throw new Error('Erro ao atualizar o perfil');
      }
      
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    }
  };
  
  const getUserProfile = async (): Promise<Profile | null> => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      const profileData = await getProfile(supabase, user.id);
      return profileData as Profile | null;
    } catch (error: any) {
      console.error("Erro ao buscar perfil:", error);
      return null;
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

  const value: AuthContextProps = {
    session,
    user,
    profile,
    loading,
    signIn,
    signOut,
    signUp,
    updateProfile: updateUserProfile,
    getProfile: getUserProfile,
    resetPassword,
    updatePassword
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
