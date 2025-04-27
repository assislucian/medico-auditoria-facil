
import { supabase } from "@/integrations/supabase/client";
import { Ticket, Message, TicketCategory, TicketPriority, TicketStatus } from '@/components/support/types';

export interface TicketData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

/**
 * Fetches all tickets for a user
 */
export const fetchUserTickets = async (userId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
  
  return data as unknown as Ticket[];
};

/**
 * Fetches messages for a specific ticket
 */
export const fetchTicketMessages = async (ticketId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('support_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  return data as unknown as Message[];
};

/**
 * Creates a new support ticket
 */
export const createSupportTicket = async (userId: string, formData: TicketData): Promise<Ticket> => {
  const ticketData = {
    user_id: userId,
    title: formData.title,
    description: formData.description,
    status: 'new' as TicketStatus,
    category: formData.category,
    priority: formData.priority,
  };
  
  const { data, error } = await supabase
    .from('support_tickets')
    .insert(ticketData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
  
  return data as unknown as Ticket;
};

/**
 * Sends a new message in a ticket
 */
export const sendTicketMessage = async (
  ticketId: string, 
  userId: string, 
  content: string
): Promise<{ message: Message; updatedTicket?: Ticket }> => {
  // Create message
  const messageData = {
    ticket_id: ticketId,
    user_id: userId,
    content,
    sent_by_user: true,
  };
  
  const { data: message, error: messageError } = await supabase
    .from('support_messages')
    .insert(messageData)
    .select()
    .single();
  
  if (messageError) {
    console.error('Error sending message:', messageError);
    throw messageError;
  }
  
  // Update ticket status
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .update({ status: 'waiting_support' as TicketStatus })
    .eq('id', ticketId)
    .select()
    .single();
  
  if (ticketError) {
    console.error('Error updating ticket:', ticketError);
    // We don't throw here as the message was still sent successfully
  }
  
  return { 
    message: message as unknown as Message,
    updatedTicket: ticket as unknown as Ticket
  };
};
