
export interface Profile {
  id: string;
  name: string;
  email: string;
  crm?: string;
  specialty?: string;
  bio?: string;
  hospital?: string;
  telefone?: string;
  notification_preferences?: Record<string, any>;
  reference_tables_preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
