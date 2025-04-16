
import { useAuth } from "@/contexts/AuthContext";
import { SupportLayout } from "@/components/support/SupportLayout";
import { TicketList } from '@/components/support/TicketList';
import { TicketDetail } from '@/components/support/TicketDetail';
import { NewTicketForm } from '@/components/support/NewTicketForm';
import { useTickets } from '@/hooks/useTickets';

/**
 * Support Page
 * 
 * Main page for the support system, allowing users to view their tickets,
 * see ticket details, send messages, and create new tickets.
 */
const Support = () => {
  const { user } = useAuth();
  
  const {
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
  } = useTickets(user?.id);

  /**
   * Handles switching to the new ticket tab
   */
  const navigateToNewTicket = () => {
    setActiveTab('new-ticket');
  };

  /**
   * Content for the tickets tab showing list and details
   */
  const TicketsContent = (
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
          onSendMessage={sendMessage}
          onCreateTicket={navigateToNewTicket}
        />
      </div>
    </div>
  );

  /**
   * Content for the new ticket tab
   */
  const NewTicketContent = (
    <NewTicketForm
      onSubmit={createTicket}
      submitting={submitting}
    />
  );

  return (
    <SupportLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      ticketsContent={TicketsContent}
      newTicketContent={NewTicketContent}
    />
  );
};

export default Support;
