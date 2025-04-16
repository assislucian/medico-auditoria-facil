import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, Plus, MessageSquare } from "lucide-react";

type TicketStatus = 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
type TicketPriority = 'baixa' | 'media' | 'alta' | 'critica';
type TicketCategory = 'technical' | 'billing' | 'feature' | 'question' | 'other';

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  user_id: string;
  category: TicketCategory;
  updated_at?: string;
  resolved_at?: string | null;
};

type Message = {
  id: string;
  ticket_id: string;
  content: string;
  sent_by_user: boolean;
  created_at: string;
};

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'technical' as TicketCategory,
    priority: 'media' as TicketPriority,
  });
  const [newMessage, setNewMessage] = useState('');

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
      
      const typedData = (data || []).map(ticket => ({
        ...ticket,
        status: ticket.status as TicketStatus,
        priority: ticket.priority as TicketPriority,
        category: ticket.category as TicketCategory
      }));
      
      setTickets(typedData);
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
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Não foi possível carregar as mensagens');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([
          {
            title: newTicket.title,
            description: newTicket.description,
            user_id: user.id,
            status: 'aberto' as TicketStatus,
            category: newTicket.category,
            priority: newTicket.priority
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      await supabase.from('activity_logs').insert([
        {
          user_id: user.id,
          action_type: 'ticket_created',
          description: `Criou um ticket de suporte: ${newTicket.title}`,
          entity_type: 'support_ticket',
          entity_id: data.id
        }
      ]);
      
      toast.success('Ticket criado com sucesso');
      
      const typedTicket: Ticket = {
        ...data,
        status: data.status as TicketStatus,
        priority: data.priority as TicketPriority,
        category: data.category as TicketCategory
      };
      
      setTickets([typedTicket, ...tickets]);
      setNewTicket({
        title: '',
        description: '',
        category: 'technical',
        priority: 'media',
      });
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      toast.error('Não foi possível criar o ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;
    
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .insert([
          {
            ticket_id: selectedTicket.id,
            content: newMessage,
            sent_by_user: true
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      await supabase.from('activity_logs').insert([
        {
          user_id: user!.id,
          action_type: 'message_sent',
          description: `Enviou uma mensagem em ticket de suporte`,
          entity_type: 'support_message',
          entity_id: data.id
        }
      ]);
      
      setMessages([...messages, data]);
      setNewMessage('');
      
      if (selectedTicket.status === 'aberto') {
        const { error: updateError } = await supabase
          .from('support_tickets')
          .update({ status: 'em_andamento' })
          .eq('id', selectedTicket.id);
          
        if (!updateError) {
          setSelectedTicket({...selectedTicket, status: 'em_andamento'});
          setTickets(tickets.map(t => 
            t.id === selectedTicket.id ? {...t, status: 'em_andamento' as TicketStatus} : t
          ));
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Não foi possível enviar a mensagem');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'aberto':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Aberto</Badge>;
      case 'em_andamento':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Em Andamento</Badge>;
      case 'resolvido':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Resolvido</Badge>;
      case 'fechado':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Fechado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'baixa':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Baixa</Badge>;
      case 'media':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Média</Badge>;
      case 'alta':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Alta</Badge>;
      case 'critica':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Crítica</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const navigateToNewTicket = () => {
    const newTicketTab = document.querySelector('[data-value="new-ticket"]') as HTMLElement;
    if (newTicketTab) {
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
                    <Card>
                      <CardHeader>
                        <CardTitle>Meus Tickets</CardTitle>
                        <CardDescription>
                          {tickets.length} tickets encontrados
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        ) : tickets.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">Você ainda não tem tickets de suporte.</p>
                            <Button onClick={navigateToNewTicket}>
                              <Plus className="mr-2 h-4 w-4" />
                              Criar Ticket
                            </Button>
                          </div>
                        ) : (
                          <ScrollArea className="h-[500px]">
                            <div className="space-y-3">
                              {tickets.map((ticket) => (
                                <Card 
                                  key={ticket.id} 
                                  className={`cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'border-primary' : 'hover:border-primary/50'}`}
                                  onClick={() => setSelectedTicket(ticket)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                      <h3 className="font-medium line-clamp-1">{ticket.title}</h3>
                                      {getStatusBadge(ticket.status)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {formatDate(ticket.created_at)}
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs capitalize">
                                        {ticket.category === 'technical' ? 'Técnico' : 
                                         ticket.category === 'billing' ? 'Faturamento' : 
                                         ticket.category === 'feature' ? 'Funcionalidade' : 
                                         ticket.category}
                                      </span>
                                      {getPriorityBadge(ticket.priority)}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-2">
                    {selectedTicket ? (
                      <Card className="h-full flex flex-col">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{selectedTicket.title}</CardTitle>
                            {getStatusBadge(selectedTicket.status)}
                          </div>
                          <CardDescription className="flex items-center justify-between">
                            <span>Criado em {formatDate(selectedTicket.created_at)}</span>
                            {getPriorityBadge(selectedTicket.priority)}
                          </CardDescription>
                          <div className="border-t pt-2 mt-2">
                            <p className="text-sm">{selectedTicket.description}</p>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden flex flex-col">
                          <h3 className="text-sm font-medium mb-4">Histórico de mensagens</h3>
                          <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4">
                              {messages.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">
                                  Nenhuma mensagem neste ticket ainda.
                                </p>
                              ) : (
                                messages.map((message) => (
                                  <div 
                                    key={message.id} 
                                    className={`flex ${message.sent_by_user ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div 
                                      className={`rounded-lg p-3 max-w-[80%] ${
                                        message.sent_by_user 
                                          ? 'bg-primary text-primary-foreground' 
                                          : 'bg-muted'
                                      }`}
                                    >
                                      <p className="text-sm">{message.content}</p>
                                      <p className="text-xs mt-1 opacity-70">
                                        {formatDate(message.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                        <CardFooter>
                          <form onSubmit={handleSendMessage} className="w-full">
                            <div className="flex gap-2">
                              <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escreva sua mensagem..."
                                disabled={['resolvido', 'fechado'].includes(selectedTicket.status)}
                              />
                              <Button 
                                type="submit" 
                                disabled={!newMessage.trim() || ['resolvido', 'fechado'].includes(selectedTicket.status)}
                              >
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Enviar</span>
                              </Button>
                            </div>
                            {['resolvido', 'fechado'].includes(selectedTicket.status) && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Este ticket está {selectedTicket.status === 'resolvido' ? 'resolvido' : 'fechado'} e não pode receber novas mensagens.
                              </p>
                            )}
                          </form>
                        </CardFooter>
                      </Card>
                    ) : (
                      <Card className="h-full flex items-center justify-center">
                        <div className="text-center py-12 px-4">
                          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Nenhum ticket selecionado</h3>
                          <p className="text-muted-foreground mb-6">
                            Selecione um ticket para visualizar a conversa ou crie um novo ticket de suporte.
                          </p>
                          <Button onClick={navigateToNewTicket}>
                            <Plus className="mr-2 h-4 w-4" />
                            Criar Novo Ticket
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="new-ticket">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar novo ticket de suporte</CardTitle>
                    <CardDescription>
                      Preencha as informações abaixo para abrir um novo chamado com nossa equipe de suporte
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={newTicket.title}
                          onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                          placeholder="Resumo do problema ou solicitação"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoria</Label>
                          <Select 
                            value={newTicket.category}
                            onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">Problema Técnico</SelectItem>
                              <SelectItem value="billing">Faturamento</SelectItem>
                              <SelectItem value="feature">Solicitação de Funcionalidade</SelectItem>
                              <SelectItem value="question">Dúvida Geral</SelectItem>
                              <SelectItem value="other">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="priority">Prioridade</Label>
                          <Select 
                            value={newTicket.priority}
                            onValueChange={(value) => setNewTicket({...newTicket, priority: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baixa">Baixa</SelectItem>
                              <SelectItem value="media">Média</SelectItem>
                              <SelectItem value="alta">Alta</SelectItem>
                              <SelectItem value="critica">Crítica</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                          id="description"
                          value={newTicket.description}
                          onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                          placeholder="Descreva detalhadamente o problema ou solicitação..."
                          rows={5}
                          required
                        />
                      </div>
                      
                      <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>Criar Ticket</>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
