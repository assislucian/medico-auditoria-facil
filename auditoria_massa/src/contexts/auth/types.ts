
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types';

export type UserProfile = Profile;

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
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
