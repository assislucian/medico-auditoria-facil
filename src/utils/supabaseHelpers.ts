
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
 * Convert any object to Json type safely
 * @param data - Object to convert to Json
 * @returns The object as Json type
 */
export function toJson(data: any): Json {
  return data as unknown as Json;
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

/**
 * Helper function to handle updating a profile safely
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @param data - Update data
 * @returns The updated data or null if an error occurred
 */
export async function updateProfile(supabase: any, userId: string, data: ProfileUpdatePayload) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
}

/**
 * Helper function to safely get profile data
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @returns The profile data or null if an error occurred
 */
export async function getProfile(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
}
