
import { Profile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const getProfileData = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const handlePasswordReset = async (email: string) => {
  try {
    // Use the custom domain for the password reset email
    const redirectTo = `https://meudominio.com/reset-password`;
    
    console.log("Sending password reset email with redirect to:", redirectTo);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });
    
    if (error) throw error;
    console.log("Email de recuperação enviado para:", email);
    toast.success('Email com instruções para redefinir senha enviado!');
  } catch (error: any) {
    toast.error(error.error_description || error.message || 'Erro ao enviar email de redefinição de senha');
    console.error('Erro detalhado de resetPassword:', error);
    throw error;
  }
};

export const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  toast.success('Logout realizado com sucesso');
};
