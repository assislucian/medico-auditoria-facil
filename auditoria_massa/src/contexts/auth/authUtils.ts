
import { Profile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const getProfileData = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('Fetching profile data for user:', userId);
    
    // Since the database tables haven't been created yet, we'll need to mock this response
    
    // Mock profile data with required fields for TypeScript
    const mockProfile: Profile = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      crm: '12345',
      created_at: new Date().toISOString(),
      trial_status: 'active',
      trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };
    
    return mockProfile;
  } catch (error) {
    console.error("Exception in getProfileData:", error);
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
