import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';
import { toast } from "sonner";

interface AuthContextProps {
  session: Session | null;
  user: Session['user'] | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  updateProfile: (data: Profile) => Promise<void>;
  getProfile: () => Promise<Profile | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Session['user'] | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Fetch profile data here
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) {
            console.error("Erro ao buscar perfil:", error);
          }

          setProfile(profileData as Profile || null);
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      loadSession(); // Reload session on auth state change
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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    }
  };

  const updateProfile = async (data: Profile) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...data,
        }, { onConflict: 'id' });
      if (error) throw error;
      setProfile(data);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    }
  };
  
  const getProfile = async () => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Erro ao buscar perfil:", error);
        return null;
      }
      
      return profileData as Profile || null;
    } catch (error: any) {
      console.error("Erro ao buscar perfil:", error);
      return null;
    }
  };

  const value: AuthContextProps = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signOut,
    signUp,
    updateProfile,
    getProfile
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
