
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile } from '@/types';
import { handlePasswordReset, handleSignOut } from './authUtils';

export const useAuthActions = () => {
  const signIn = async (email: string) => {
    try {
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback`;
      
      console.log("Sending magic link with redirect to:", redirectTo);
      
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: redirectTo
        }
      });
      
      if (error) throw error;
      toast.success('Verifique seu email para o link de login mágico!');
    } catch (error: any) {
      console.error("Error during signIn:", error);
      toast.error(error.error_description || error.message || 'Erro ao fazer login');
    }
  };
  
  const signInWithPassword = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      toast.success('Login efetuado com sucesso!');
    } catch (error: any) {
      console.error("Error during signInWithPassword:", error);
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
      console.error("Error during signUp:", error);
      toast.error(error.error_description || error.message || 'Erro ao criar conta');
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
    signIn,
    signInWithPassword,
    signUp,
    signOut: handleSignOut,
    resetPassword: handlePasswordReset,
    updatePassword,
    updateProfile: updateUserProfile,
  };
};

