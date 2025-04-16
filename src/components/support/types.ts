
export type TicketStatus = 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
export type TicketPriority = 'baixa' | 'media' | 'alta' | 'critica';
export type TicketCategory = 'technical' | 'billing' | 'feature' | 'question' | 'other';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  user_id: string;
}

export interface Message {
  id: string;
  ticket_id: string;
  content: string;
  sent_by_user: boolean;
  created_at: string;
}
