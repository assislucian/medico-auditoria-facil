
/**
 * Supabase client configuration
 * Provides a centralized client for backend services to use
 */
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../src/integrations/supabase/types';
import { logger } from '../utils/logger';

// Using the same environment variables as the frontend
const SUPABASE_URL = "https://yzrovzblelpnftlegczx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cm92emJsZWxwbmZ0bGVnY3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTc1MzksImV4cCI6MjA2MDMzMzUzOX0.wEvwIk_suF0uLWkGfMBa2XHmjvN4CySk58aoz24uun8";

/**
 * Create and export a typed Supabase client for backend operations
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Initialize connection and check if Supabase is available
 * @returns {Promise<boolean>} True if connection is successful
 */
export async function initSupabase(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      logger.error('Failed to connect to Supabase', { error });
      return false;
    }
    
    logger.info('Successfully connected to Supabase');
    return true;
  } catch (err) {
    logger.error('Exception during Supabase connection check', { err });
    return false;
  }
}
