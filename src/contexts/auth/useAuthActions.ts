
import { supabase } from '@/integrations/supabase/client';

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
  
  return {
    signInWithPassword,
    signUp,
    signOut
  };
};
