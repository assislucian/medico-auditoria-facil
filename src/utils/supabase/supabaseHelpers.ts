
import { supabase } from '@/integrations/supabase/client';

// Re-export from profileHelpers
export { getProfile, updateProfile, toJson } from './profileHelpers';

// Re-export from analysisHelpers
export { fetchAnalysisById, fetchProceduresByAnalysisId } from './analysisHelpers';

/**
 * Format JSON data for storage
 */
export const toJson = (data: any) => {
  return data as any;
};

/**
 * Ticket data type
 */
export interface TicketData {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  created_at: string;
}

/**
 * Fetch help articles
 */
export const fetchHelpArticles = async () => {
  try {
    const { data, error } = await supabase
      .from('help_articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching help articles:', error);
    return [];
  }
};

/**
 * Fetch user tickets
 */
export const fetchUserTickets = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    return [];
  }
};

/**
 * Fetch ticket messages
 */
export const fetchTicketMessages = async (ticketId: string) => {
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
};

/**
 * Create support ticket
 */
export const createSupportTicket = async (ticket: Omit<TicketData, 'id' | 'created_at'>) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No authenticated session');

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        ...ticket,
        user_id: session.user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
};

/**
 * Send ticket message
 */
export const sendTicketMessage = async (ticketId: string, content: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No authenticated session');

    const { data, error } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: ticketId,
        user_id: session.user.id,
        content,
        sent_by_user: true
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending ticket message:', error);
    throw error;
  }
};
