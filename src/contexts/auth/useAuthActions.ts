
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthActions = () => {
  const signInWithPassword = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  };
  
  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password
    });
  };
  
  const signOut = async () => {
    return await supabase.auth.signOut();
  };
  
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error('Error updating password:', error);
        toast.error('Erro ao atualizar senha: ' + error.message);
        throw error;
      }
      
      toast.success('Senha atualizada com sucesso!');
      return { success: true };
    } catch (error: any) {
      console.error('Exception updating password:', error);
      toast.error('Erro ao atualizar senha');
      throw error;
    }
  };
  
  return {
    signInWithPassword,
    signUp,
    signOut,
    updatePassword
  };
};
