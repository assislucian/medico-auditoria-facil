
import { supabase } from "@/integrations/supabase/client";

/**
 * Common utility functions shared across multiple helpers
 */

/**
 * Convert database response to JSON safely
 */
export function toJson<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Error handling wrapper for database operations
 */
export async function safeDbOperation<T>(operation: Promise<{data: T | null, error: any}>): Promise<T | null> {
  try {
    const { data, error } = await operation;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database operation error:', error);
    return null;
  }
}

/**
 * Get the current user ID from the session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
}
