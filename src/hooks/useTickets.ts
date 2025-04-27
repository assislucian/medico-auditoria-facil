
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { Ticket, Message, TicketCategory, TicketPriority, TicketStatus } from '@/components/support/types';
import { 
  fetchUserTickets, 
  fetchTicketMessages, 
  createSupportTicket, 
  sendTicketMessage,
  TicketData 
} from '../utils/supabase';

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
    
    setLoading(true);
    try {
      const userTickets = await fetchUserTickets(userId);
      setTickets(userTickets);
    } catch (error) {
      console.error('Error in fetchTickets:', error);
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
      const ticketMessages = await fetchTicketMessages(ticketId);
      setMessages(ticketMessages);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast.error('Não foi possível carregar as mensagens');
    }
  }, []);

  /**
   * Creates a new support ticket
   * @returns The newly created ticket
   */
  const createTicket = useCallback(async (formData: TicketData): Promise<Ticket> => {
    if (!userId) throw new Error('Usuário não autenticado');
    
    setSubmitting(true);
    
    try {
      const newTicket = await createSupportTicket(userId, formData);
      
      if (!newTicket) {
        throw new Error('Não foi possível criar o ticket');
      }
      
      toast.success('Ticket criado com sucesso');
      
      setTickets(prev => [newTicket, ...prev]);
      setActiveTab('my-tickets');
      
      return newTicket;
    } catch (error) {
      console.error('Error in createTicket:', error);
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
      const result = await sendTicketMessage(selectedTicket.id, userId, content);
      
      if (result.message) {
        setMessages(prev => [...prev, result.message]);
      }
      
      // Update ticket status if needed
      if (result.updatedTicket) {
        setSelectedTicket(result.updatedTicket);
        setTickets(prev => 
          prev.map(t => t.id === selectedTicket.id ? result.updatedTicket! : t)
        );
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
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
