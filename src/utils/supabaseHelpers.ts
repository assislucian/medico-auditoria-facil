
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Json } from '@/integrations/supabase/types';

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
export function toUUID(id: string): unknown {
  return id as unknown;
}

/**
 * Helper to safely cast object to Json type for Supabase updates
 */
export function toJson(obj: any): Json {
  return obj as Json;
}
