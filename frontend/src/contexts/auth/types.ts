import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types';

export type UserProfile = Profile;

export interface AuthContextProps {
  user: User | null;
  session: { access_token: string } | null;
  isAuthenticated: boolean;
  loading: boolean;
  userProfile: UserProfile | null;
  validateUserCRM: (crm: string) => Promise<boolean>;
  login: (uf: string, crm: string, senha: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => void;
  getProfile: () => Promise<UserProfile | null>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
  isPasswordStrong: (password: string) => boolean;
}
