
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TicketList } from '@/components/support/TicketList';
import { TicketDetail } from '@/components/support/TicketDetail';
import { NewTicketForm } from '@/components/support/NewTicketForm';
import { Message, Ticket } from '@/components/support/types';

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTickets(data as Ticket[]);
    } catch (error) {
      console.error('Erro ao buscar tickets de suporte:', error);
      toast.error('Não foi possível carregar seus tickets de suporte');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as Message[]);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Não foi possível carregar as mensagens');
    }
  };

  const handleCreateTicket = async (formData: {
    title: string;
    description: string;
    category: Ticket['category'];
    priority: Ticket['priority'];
  }) => {
    setSubmitting(true);
    
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{
          title: formData.title,
          description: formData.description,
          user_id: user.id,
          status: 'aberto' as Ticket['status'],
          category: formData.category,
          priority: formData.priority
        }])
        .select()
        .single();

      if (error) throw error;

      await supabase.from('activity_logs').insert([{
        user_id: user.id,
        action_type: 'ticket_created',
        description: `Criou um ticket de suporte: ${formData.title}`,
        entity_type: 'support_ticket',
        entity_id: data.id
      }]);
      
      toast.success('Ticket criado com sucesso');
      
      setTickets([data as Ticket, ...tickets]);
      navigateToTickets();
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      toast.error('Não foi possível criar o ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedTicket) return;
    
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
        user_id: user!.id,
        action_type: 'message_sent',
        description: `Enviou uma mensagem em ticket de suporte`,
        entity_type: 'support_message',
        entity_id: data.id
      }]);
      
      setMessages([...messages, data as Message]);
      
      if (selectedTicket.status === 'aberto') {
        const { error: updateError } = await supabase
          .from('support_tickets')
          .update({ status: 'em_andamento' as Ticket['status'] })
          .eq('id', selectedTicket.id);
          
        if (!updateError) {
          const updatedTicket = {...selectedTicket, status: 'em_andamento' as Ticket['status']};
          setSelectedTicket(updatedTicket);
          setTickets(tickets.map(t => 
            t.id === selectedTicket.id ? updatedTicket : t
          ));
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Não foi possível enviar a mensagem');
    }
  };

  const navigateToTickets = () => {
    const ticketsTab = document.querySelector('[data-value="my-tickets"]');
    if (ticketsTab instanceof HTMLElement) {
      ticketsTab.click();
    }
  };

  const navigateToNewTicket = () => {
    const newTicketTab = document.querySelector('[data-value="new-ticket"]');
    if (newTicketTab instanceof HTMLElement) {
      newTicketTab.click();
    }
  };

  return (
    <>
      <Helmet>
        <title>Suporte | MedCheck</title>
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <SideNav className="hidden md:flex" />
        <div className="flex-1">
          <Navbar isLoggedIn={true} />
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Suporte Técnico</h1>
            
            <Tabs defaultValue="my-tickets">
              <TabsList className="mb-6">
                <TabsTrigger value="my-tickets">Meus Tickets</TabsTrigger>
                <TabsTrigger value="new-ticket">Novo Ticket</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-tickets">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <TicketList
                      loading={loading}
                      tickets={tickets}
                      selectedTicket={selectedTicket}
                      onSelectTicket={setSelectedTicket}
                      onCreateTicket={navigateToNewTicket}
                    />
                  </div>
                  
                  <div className="lg:col-span-2">
                    <TicketDetail
                      ticket={selectedTicket}
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      onCreateTicket={navigateToNewTicket}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="new-ticket">
                <NewTicketForm
                  onSubmit={handleCreateTicket}
                  submitting={submitting}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
