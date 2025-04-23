
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile } from '@/types';
import { handlePasswordReset, handleSignOut, getProfileData } from './authUtils';

export const useAuthActions = () => {
  const getProfile = async () => {
    try {
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (userData.user) {
        const profileData = await getProfileData(userData.user.id);
        return profileData;
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };
  
  const signInWithPassword = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // O login foi bem-sucedido, o redirecionamento será tratado pelo componente
      return data;
    } catch (error: any) {
      console.error("Error during signInWithPassword:", error);
      throw error; // Propaga o erro para ser tratado pelo componente
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
      
      // O signup foi bem-sucedido, o redirecionamento será tratado pelo componente
      return data;
    } catch (error: any) {
      console.error("Error during signUp:", error);
      throw error; // Propaga o erro para ser tratado pelo componente
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
      if (!supabase.auth.getUser()) throw new Error('Usuário não autenticado');
      
      const { data: userData, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userData.user.id);
      
      if (updateError) throw updateError;
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    }
  };

  return {
    signInWithPassword,
    signUp,
    signOut: handleSignOut,
    resetPassword: handlePasswordReset,
    updatePassword,
    updateProfile: updateUserProfile,
    getProfile,
  };
};
