
export interface Profile {
  id: string;
  name: string;
  email: string;
  crm?: string;
  specialty?: string;
  bio?: string;
  telefone?: string;
  notification_preferences?: Record<string, any>;
  reference_tables_preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  trial_status?: 'not_started' | 'active' | 'expired';
  trial_end_date?: string;
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
}
