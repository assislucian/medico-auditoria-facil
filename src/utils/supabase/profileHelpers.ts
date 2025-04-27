
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

/**
 * Get profile data for a user
 */
export const getProfile = async (supabaseClient: any, userId: string) => {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

/**
 * Update profile data for a user
 */
export const updateProfile = async (supabaseClient: any, userId: string, updates: any) => {
  try {
    const { error } = await supabaseClient
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};

/**
 * Convert data to JSON for Supabase storage
 */
export const toJson = (data: any): Json => {
  return data as Json;
};
