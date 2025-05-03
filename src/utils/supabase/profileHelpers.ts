
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/contexts/auth/types';

// Get the user's profile
export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as UserProfile;
}

// Update a user's profile
export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  if (!userId) {
    throw new Error('User ID is required to update profile');
  }

  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
}

// Create a new profile
export async function createProfile(profileData: Partial<UserProfile>) {
  return await supabase
    .from('profiles')
    .insert([profileData]);
}
