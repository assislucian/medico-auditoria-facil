
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import ProceduresTab from "@/components/dashboard/tabs/ProceduresTab";
import PaymentStatementsTab from "@/components/dashboard/tabs/PaymentStatementsTab";
import GlosasTab from "@/components/dashboard/tabs/GlosasTab";

const DashboardPage = () => {
  return (
    <AuthenticatedLayout 
      title="Dashboard" 
      description="Gerencie seus procedimentos e contracheques"
    >
      <Tabs defaultValue="procedures" className="space-y-4">
        <TabsList className="w-full bg-muted/50 p-1">
          <TabsTrigger value="procedures" className="flex-1">
            Procedimentos
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex-1">
            Contracheques
          </TabsTrigger>
          <TabsTrigger value="glosas" className="flex-1">
            Glosas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="procedures">
          <ProceduresTab />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentStatementsTab />
        </TabsContent>

        <TabsContent value="glosas">
          <GlosasTab />
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
};

export default DashboardPage;
