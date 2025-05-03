
/**
 * Common helper functions for interacting with Supabase
 */

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

/**
 * Support ticket interfaces and functions
 */
export interface TicketData {
  title: string;
  description: string;
  category: string;
  priority: string;
}

export async function fetchUserTickets(userId: string) {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

export async function fetchTicketMessages(ticketId: string) {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching ticket messages:', error);
    return [];
  }
}

export async function createSupportTicket(userId: string, ticketData: TicketData) {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    return null;
  }
}

export async function sendTicketMessage(ticketId: string, userId: string, content: string) {
  try {
    // First insert the new message
    const { data: message, error: messageError } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: ticketId,
        content,
        sent_by_user: true,
        user_id: userId
      })
      .select()
      .single();
      
    if (messageError) throw messageError;
    
    // Update the ticket status
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .update({ status: 'cliente_respondeu', updated_at: new Date().toISOString() })
      .eq('id', ticketId)
      .select()
      .single();
      
    if (ticketError) throw ticketError;
    
    return { message, updatedTicket: ticket };
  } catch (error) {
    console.error('Error sending message:', error);
    return { message: null, updatedTicket: null };
  }
}
