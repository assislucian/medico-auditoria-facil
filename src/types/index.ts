
import { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  name: string;
  email: string;
  crm: string;
  specialty?: string;
  notification_preferences?: Json;
  reference_tables_preferences?: Json;
  trial_status: 'not_started' | 'active' | 'expired';
  trial_end_date?: string;
  updated_at?: string;
  created_at?: string;
}

