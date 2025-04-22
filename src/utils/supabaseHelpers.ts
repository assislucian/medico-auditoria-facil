
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Json } from '@/integrations/supabase/types';
import { Database } from '@/integrations/supabase/types';

/**
 * Type guard to check if a response contains error
 */
export function hasError<T>(
  response: PostgrestSingleResponse<T>
): response is PostgrestSingleResponse<T> & { error: PostgrestError } {
  return response.error !== null;
}

/**
 * Type guard to check if a response has data
 */
export function hasData<T>(
  response: PostgrestSingleResponse<T>
): response is PostgrestSingleResponse<T> & { data: T } {
  return response.data !== null;
}

/**
 * Helper to safely cast user ID to UUID type for Supabase queries
 */
export function toUUID(id: string): string {
  return id;
}

/**
 * Helper to safely cast object to Json type for Supabase updates
 */
export function toJson(obj: any): Json {
  return obj as Json;
}

/**
 * Extract data safely from a query response
 * @param response - Response from Supabase query
 * @returns The data or null if an error occurred
 */
export function extractData<T>(response: PostgrestSingleResponse<T>): T | null {
  if (hasError(response)) {
    console.error("Database error:", response.error);
    return null;
  }
  
  return response.data;
}

/**
 * Type for a profile update payload
 */
export type ProfileUpdatePayload = {
  name?: string;
  email?: string;
  crm?: string;
  specialty?: string;
  notification_preferences?: Json;
  reference_tables_preferences?: Json;
  updated_at?: string;
};
