
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types';

export interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  getProfile: () => Promise<Profile | null>;
}
