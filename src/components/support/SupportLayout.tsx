
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SupportLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  ticketsContent: ReactNode;
  newTicketContent: ReactNode;
}

/**
 * SupportLayout Component
 * 
 * Provides the layout structure for the support page with tabs for tickets and new ticket creation.
 * 
 * @param activeTab - Currently active tab ('my-tickets' or 'new-ticket')
 * @param onTabChange - Function to handle tab changes
 * @param ticketsContent - Content to display in the tickets tab
 * @param newTicketContent - Content to display in the new ticket tab
 */
export const SupportLayout = ({
  activeTab,
  onTabChange,
  ticketsContent,
  newTicketContent
}: SupportLayoutProps) => {
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
            
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="my-tickets">Meus Tickets</TabsTrigger>
                <TabsTrigger value="new-ticket">Novo Ticket</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-tickets">
                {ticketsContent}
              </TabsContent>
              
              <TabsContent value="new-ticket">
                {newTicketContent}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};
