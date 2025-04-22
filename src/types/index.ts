
import { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  name: string;
  email: string;
  crm: string;
  specialty?: string;
  notification_preferences?: Json;
  reference_tables_preferences?: Json;
  updated_at?: string;
  created_at?: string;
}

// Extension of the Profile interface that includes UUID type for ID
// to be used with Supabase queries
export interface ProfileWithUUID extends Omit<Profile, 'id'> {
  id: unknown; // This allows the Supabase UUID type to be used
}
