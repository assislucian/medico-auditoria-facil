
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ticket, Message, TicketCategory, TicketPriority, TicketStatus } from '@/components/support/types';

interface CreateTicketData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

/**
 * Custom hook for managing support tickets
 * 
 * Provides functionality to fetch, create, and interact with support tickets
 * 
 * @param userId - The current user's ID
 * @returns Object containing ticket state and functions for managing tickets
 */
export const useTickets = (userId: string | undefined) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState<string>('my-tickets');

  /**
   * Fetches all tickets for the current user
   */
  const fetchTickets = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure correct typing for the tickets data
      const typedTickets: Ticket[] = (data || []).map(ticket => ({
        ...ticket,
        status: ticket.status as TicketStatus,
        priority: ticket.priority as TicketPriority,
        category: ticket.category as TicketCategory
      }));
      
      setTickets(typedTickets);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      toast.error('Não foi possível carregar seus tickets de suporte');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Fetches messages for a specific ticket
   */
  const fetchMessages = useCallback(async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Não foi possível carregar as mensagens');
    }
  }, []);

  /**
   * Creates a new support ticket
   * @returns The newly created ticket
   */
  const createTicket = useCallback(async (formData: CreateTicketData): Promise<Ticket> => {
    if (!userId) throw new Error('Usuário não autenticado');
    
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{
          title: formData.title,
          description: formData.description,
          user_id: userId,
          status: 'aberto' as TicketStatus,
          category: formData.category,
          priority: formData.priority
        }])
        .select()
        .single();

      if (error) throw error;

      await supabase.from('activity_logs').insert([{
        user_id: userId,
        action_type: 'ticket_created',
        description: `Criou um ticket de suporte: ${formData.title}`,
        entity_type: 'support_ticket',
        entity_id: data.id
      }]);
      
      toast.success('Ticket criado com sucesso');
      
      // Ensure correct typing for the new ticket
      const typedTicket: Ticket = {
        ...data,
        status: data.status as TicketStatus,
        priority: data.priority as TicketPriority,
        category: data.category as TicketCategory
      };
      
      setTickets(prev => [typedTicket, ...prev]);
      setActiveTab('my-tickets');
      
      return typedTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Não foi possível criar o ticket');
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [userId]);

  /**
   * Sends a new message in a ticket
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!selectedTicket || !userId) return;
    
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .insert([{
          ticket_id: selectedTicket.id,
          content,
          sent_by_user: true
        }])
        .select()
        .single();

      if (error) throw error;
      
      await supabase.from('activity_logs').insert([{
        user_id: userId,
        action_type: 'message_sent',
        description: `Enviou uma mensagem em ticket de suporte`,
        entity_type: 'support_message',
        entity_id: data.id
      }]);
      
      setMessages(prev => [...prev, data as Message]);
      
      // Update ticket status if needed
      if (selectedTicket.status === 'aberto') {
        const { error: updateError } = await supabase
          .from('support_tickets')
          .update({ status: 'em_andamento' as TicketStatus })
          .eq('id', selectedTicket.id);
          
        if (!updateError) {
          const updatedTicket = {
            ...selectedTicket, 
            status: 'em_andamento' as TicketStatus
          };
          setSelectedTicket(updatedTicket);
          setTickets(prev => 
            prev.map(t => t.id === selectedTicket.id ? updatedTicket : t)
          );
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Não foi possível enviar a mensagem');
    }
  }, [selectedTicket, userId]);

  // Load tickets on component mount
  useEffect(() => {
    if (userId) {
      fetchTickets();
    }
  }, [userId, fetchTickets]);

  // Load messages when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
    } else {
      setMessages([]);
    }
  }, [selectedTicket, fetchMessages]);

  return {
    tickets,
    messages,
    loading,
    submitting,
    selectedTicket,
    setSelectedTicket,
    activeTab,
    setActiveTab,
    createTicket,
    sendMessage,
    fetchTickets
  };
};
