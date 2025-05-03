
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  crm?: string;
  specialty?: string;
  notification_preferences?: any;
  reference_tables_preferences?: any;
  trial_status?: string;
  trial_end_date?: string;
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
}

export interface AuthContextProps {
  user: User | null;
  session: any;
  isAuthenticated: boolean;
  loading: boolean;
  userProfile: UserProfile | null;
  validateUserCRM: (crm: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
  getProfile: () => Promise<UserProfile | null>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
  isPasswordStrong: (password: string) => boolean;
}
