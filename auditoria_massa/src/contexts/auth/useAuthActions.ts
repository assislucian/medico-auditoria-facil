
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useAuthActions = (userId: string | undefined) => {
  // Sign up a new user
  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  // Sign in with email and password
  const signInWithPassword = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      }
    });
  };

  // Sign out the current user
  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  // Get user profile data - mocked for now until database tables are available
  const getProfile = async (): Promise<UserProfile | null> => {
    if (!userId) return null;

    // Mock profile data until database tables are properly set up
    const mockProfile: UserProfile = {
      id: userId,
      name: 'Test User',
      email: 'user@example.com',
      crm: '12345',
      created_at: new Date().toISOString(),
      trial_status: 'active',
      trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    return mockProfile;
  };

  // Update user profile data - mocked for now until database tables are available
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Mock successful update
    return { data: { ...updates }, error: null };
  };

  // Reset password
  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({
      password: newPassword
    });
  };

  // Check if password is strong enough
  const isPasswordStrong = (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  return {
    signUp,
    signInWithPassword,
    signInWithGoogle,
    signOut,
    getProfile,
    updateProfile,
    resetPassword,
    updatePassword,
    isPasswordStrong,
  };
};
