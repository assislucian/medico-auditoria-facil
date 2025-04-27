
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { Profile } from '@/types';

/**
 * Get a user's profile data
 */
export async function getProfile(supabaseClient: any, userId: string): Promise<Profile | null> {
  try {
    console.log('Fetching profile data for user:', userId);
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    if (!data) {
      console.log('No profile found for user:', userId);
      return null;
    }
    
    console.log('Profile data retrieved successfully');
    return data as Profile;
  } catch (error) {
    console.error("Exception in getProfile:", error);
    return null;
  }
}

/**
 * Update a user's profile data
 */
export async function updateProfile(supabaseClient: any, userId: string, data: any): Promise<boolean> {
  try {
    const { error } = await supabaseClient
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
 * Convert data to JSON for Supabase
 */
export function toJson(data: any): Json {
  return data as Json;
}
