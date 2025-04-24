
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  specialty?: string;
  crm?: string;
  status?: string;
  trial_status?: 'not_started' | 'active' | 'completed' | 'expired';
  plan_id?: string;
  subscription_status?: string;
  notification_preferences?: {
    email_notifications?: boolean;
    sms_notifications?: boolean;
    avatar_url?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  userProfile?: UserProfile | null;
  signUp: (email: string, password: string) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  getProfile: () => Promise<UserProfile | null>;
  updateProfile: (data: Partial<UserProfile>) => Promise<any>;
  updatePassword: (newPassword: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  isPasswordStrong: (password: string) => boolean;
  validateUserCRM: (crm: string) => Promise<boolean>;
}
