import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProceduresTab from "./ProceduresTab";
import PaymentsTab from "./PaymentsTab";
import GlosasTab from "./GlosasTab";
import { Procedure } from "@/types/medical";

interface DashboardTabsProps {
  procedures?: Procedure[];
  glosas?: any[];
}

export function DashboardTabs({ procedures, glosas }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="procedimentos">
      <TabsList>
        <TabsTrigger value="procedimentos">Procedimentos</TabsTrigger>
        <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        <TabsTrigger value="glosas">Glosas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="procedimentos" className="pt-4">
        <ProceduresTab procedures={procedures} />
      </TabsContent>
      
      <TabsContent value="pagamentos">
        <PaymentsTab procedures={procedures} />
      </TabsContent>
      
      <TabsContent value="glosas">
        <GlosasTab glosas={glosas} />
      </TabsContent>
    </Tabs>
  );
}
