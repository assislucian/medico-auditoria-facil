
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { StatusCardsSection } from "@/components/reports/StatusCardsSection";
import { OverviewCharts } from "@/components/reports/OverviewCharts";
import { HospitalsTable } from "@/components/reports/HospitalsTable";

const ReportsPage = () => {
  return (
    <>
      <Helmet>
        <title>Relatórios | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={true} />
        <div className="flex-1 container py-8">
          <ReportsHeader />
          <StatusCardsSection />
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="hospitals">Por Hospital</TabsTrigger>
              <TabsTrigger value="procedures">Por Procedimento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <OverviewCharts />
            </TabsContent>
            
            <TabsContent value="hospitals">
              <HospitalsTable />
            </TabsContent>
            
            <TabsContent value="procedures">
              <Card>
                <CardHeader>
                  <CardTitle>Análise por Procedimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-12">
                    Esta funcionalidade será disponibilizada em breve.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
