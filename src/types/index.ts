
export interface Profile {
  id: string;
  name: string;
  email: string;
  crm: string;
  specialty?: string;
  notification_preferences?: any;
  reference_tables_preferences?: any;
  updated_at?: string;
  created_at?: string;
}
