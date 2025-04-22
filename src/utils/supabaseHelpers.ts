
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Json } from '@/integrations/supabase/types';
import { Database } from '@/integrations/supabase/types';
import { Ticket, Message, TicketCategory, TicketPriority, TicketStatus } from '@/components/support/types';
import { HelpArticle } from '@/types/help';

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
 * Extract data safely from a query response
 * @param response - Response from Supabase query
 * @returns The data or null if an error occurred
 */
export function extractData<T>(response: PostgrestSingleResponse<T>): T | null {
  if (hasError(response)) {
    console.error("Database error:", response.error);
    return null;
  }
  
  // The type narrowing wasn't working correctly; explicitly check first
  if (response.data === null) {
    return null;
  }
  
  return response.data;
}

/**
 * Convert any object to Json type safely
 * @param data - Object to convert to Json
 * @returns The object as Json type
 */
export function toJson(data: any): Json {
  return data as Json;
}

/**
 * Type for a profile update payload
 */
export type ProfileUpdatePayload = {
  name?: string;
  email?: string;
  crm?: string;
  specialty?: string;
  notification_preferences?: Json;
  reference_tables_preferences?: Json;
  updated_at?: string;
};

/**
 * Helper function to handle updating a profile safely
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @param data - Update data
 * @returns The updated data or null if an error occurred
 */
export async function updateProfile(supabase: any, userId: string, data: ProfileUpdatePayload) {
  try {
    const { error } = await supabase
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
 * Helper function to safely get profile data
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @returns The profile data or null if an error occurred
 */
export async function getProfile(supabase: any, userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
}

/**
 * Type for ticket creation data
 */
export interface TicketData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

/**
 * Type for activity log entry
 */
export interface ActivityLogData {
  user_id: string;
  action_type: string;
  description: string;
  entity_type: string;
  entity_id: string;
}

/**
 * Helper function to fetch tickets for a user
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @returns An array of tickets or empty array if error occurred
 */
export async function fetchUserTickets(supabase: any, userId: string): Promise<Ticket[]> {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Ensure correct typing for the tickets data
    return Array.isArray(data) 
      ? data.map(ticket => ({
          ...ticket,
          status: ticket.status as TicketStatus,
          priority: ticket.priority as TicketPriority,
          category: ticket.category as TicketCategory
        }))
      : [];
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return [];
  }
}

/**
 * Helper function to fetch messages for a ticket
 * @param supabase - Supabase client instance 
 * @param ticketId - Ticket ID
 * @returns An array of messages or empty array if error occurred
 */
export async function fetchTicketMessages(supabase: any, ticketId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    return Array.isArray(data) ? data as Message[] : [];
  } catch (error) {
    console.error('Error fetching ticket messages:', error);
    return [];
  }
}

/**
 * Helper function to create a new support ticket
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @param ticketData - Ticket creation data
 * @returns The created ticket or null if error occurred
 */
export async function createSupportTicket(
  supabase: any, 
  userId: string, 
  ticketData: TicketData
): Promise<Ticket | null> {
  try {
    // Create the ticket data with proper typing
    const data = {
      title: ticketData.title,
      description: ticketData.description,
      user_id: userId,
      status: 'aberto' as TicketStatus,
      category: ticketData.category,
      priority: ticketData.priority
    };
    
    const result = await supabase
      .from('support_tickets')
      .insert(data)
      .select()
      .single();

    if (result.error) throw result.error;

    // Log the activity
    const activityData = {
      user_id: userId,
      action_type: 'ticket_created',
      description: `Criou um ticket de suporte: ${ticketData.title}`,
      entity_type: 'support_ticket',
      entity_id: result.data.id
    };
    
    await supabase
      .from('activity_logs')
      .insert(activityData);
    
    // Return the created ticket with proper typing
    return {
      ...result.data,
      status: result.data.status as TicketStatus,
      priority: result.data.priority as TicketPriority,
      category: result.data.category as TicketCategory
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return null;
  }
}

/**
 * Helper function to send a message in a ticket
 * @param supabase - Supabase client instance
 * @param ticketId - Ticket ID
 * @param userId - User ID
 * @param content - Message content
 * @returns The created message or null if error occurred
 */
export async function sendTicketMessage(
  supabase: any,
  ticketId: string,
  userId: string,
  content: string
): Promise<{message: Message | null, updatedTicket: Ticket | null}> {
  try {
    // Create the message
    const messageData = {
      ticket_id: ticketId,
      content,
      sent_by_user: true
    };
    
    const result = await supabase
      .from('support_messages')
      .insert(messageData)
      .select()
      .single();

    if (result.error) throw result.error;
    
    // Log the activity
    const activityData = {
      user_id: userId,
      action_type: 'message_sent',
      description: `Enviou uma mensagem em ticket de suporte`,
      entity_type: 'support_message',
      entity_id: result.data.id
    };
    
    await supabase
      .from('activity_logs')
      .insert(activityData);
    
    let updatedTicket: Ticket | null = null;
    
    // Get the ticket to check status
    const ticketResult = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    if (!ticketResult.error && ticketResult.data.status === 'aberto') {
      // Update ticket status if it's open
      const updateResult = await supabase
        .from('support_tickets')
        .update({ status: 'em_andamento' as TicketStatus })
        .eq('id', ticketId)
        .select()
        .single();
      
      if (!updateResult.error) {
        updatedTicket = {
          ...updateResult.data,
          status: updateResult.data.status as TicketStatus,
          priority: updateResult.data.priority as TicketPriority,
          category: updateResult.data.category as TicketCategory
        };
      }
    }
    
    return {
      message: result.data as Message,
      updatedTicket
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      message: null,
      updatedTicket: null
    };
  }
}

/**
 * Helper function to fetch procedures by analysis ID
 * @param supabase - Supabase client instance
 * @param analysisId - Analysis ID
 * @returns Array of procedures or empty array if error occurred
 */
export async function fetchProceduresByAnalysisId(supabase: any, analysisId: string) {
  try {
    const { data, error } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return [];
  }
}

/**
 * Helper function to fetch help articles
 * @param supabase - Supabase client instance
 * @param options - Query options
 * @returns Array of help articles or empty array if error occurred
 */
export async function fetchHelpArticles(
  supabase: any, 
  options: {published?: boolean} = {published: true}
): Promise<HelpArticle[]> {
  try {
    let query = supabase
      .from('help_articles')
      .select('*');
    
    if (options.published !== undefined) {
      query = query.eq('published', options.published);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []) as HelpArticle[];
  } catch (error) {
    console.error('Error fetching help articles:', error);
    return [];
  }
}

/**
 * Helper function to fetch analysis by ID
 * @param supabase - Supabase client instance
 * @param analysisId - Analysis ID
 * @returns Analysis data or null if error occurred
 */
export async function fetchAnalysisById(supabase: any, analysisId: string) {
  try {
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}
