
import { supabase } from '@/integrations/supabase/client';

/**
 * Get the current user's profile
 * @param userId User ID
 * @returns User profile
 */
export async function getUserProfile(userId?: string): Promise<any> {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Exception in getUserProfile:', err);
    return null;
  }
}
