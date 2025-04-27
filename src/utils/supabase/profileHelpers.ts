
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper to convert data to JSON
 */
export const toJson = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

/**
 * Get user profile data
 */
export async function getProfile() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Update user profile data
 */
export async function updateProfile(updates: Record<string, any>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No authenticated session');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}
