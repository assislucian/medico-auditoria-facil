import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, ProfileWithUUID } from '@/types';
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

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      loadSession();
    });
  }, []);

  const signIn = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      toast.success('Verifique seu email para o link de login mágico!');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      toast.success('Verifique seu email para confirmar o cadastro!');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Email com instruções para redefinir senha enviado!');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.error_description || error.message);
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
      toast.error(error.error_description || error.message);
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
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      toast.success('Senha atualizada com sucesso!');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
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
