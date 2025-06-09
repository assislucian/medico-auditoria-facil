
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProceduresTab from "./ProceduresTab";
import PaymentsTab from "./PaymentsTab";
import GlosasTab from "./GlosasTab";

export function DashboardTabs() {
  return (
    <Tabs defaultValue="procedimentos">
      <TabsList>
        <TabsTrigger value="procedimentos">Procedimentos</TabsTrigger>
        <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        <TabsTrigger value="glosas">Glosas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="procedimentos" className="pt-4">
        <ProceduresTab />
      </TabsContent>
      
      <TabsContent value="pagamentos">
        <PaymentsTab />
      </TabsContent>
      
      <TabsContent value="glosas">
        <GlosasTab />
      </TabsContent>
    </Tabs>
  );
}
