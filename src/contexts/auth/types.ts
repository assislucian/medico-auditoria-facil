
import { Session } from '@supabase/supabase-js';
import { Profile } from '@/types';

export interface AuthContextProps {
  session: Session | null;
  user: Session['user'] | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  getProfile: () => Promise<Profile | null>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
}

