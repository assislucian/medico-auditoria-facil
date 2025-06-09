import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusCardsSection } from "@/components/reports/StatusCardsSection";
import { OverviewCharts } from "@/components/reports/OverviewCharts";
import { HospitalsTable } from "@/components/reports/HospitalsTable";
import { fetchMonthlyData, fetchHospitalData, fetchReportsTotals } from "@/services/reports";
import { exportReportToExcel, exportToTissXML, exportToFHIR } from "@/services/exportService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";

const ReportsPage = () => {
  const [currentYear, setCurrentYear] = useState("2025");
  const [monthlyData, setMonthlyData] = useState([]);
  const [hospitalData, setHospitalData] = useState([]);
  const [reportTotals, setReportTotals] = useState({
    totalRecebido: 0,
    totalGlosado: 0,
    totalProcedimentos: 0,
    auditoriaPendente: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadReportsData();
  }, [currentYear]);
  
  const loadReportsData = async () => {
    setLoading(true);
    try {
      console.log('Loading reports data for year:', currentYear);
      
      // Run these in parallel for better performance
      const [monthData, hospData, totals] = await Promise.all([
        fetchMonthlyData(),
        fetchHospitalData(),
        fetchReportsTotals()
      ]);
      
      console.log('Reports data loaded successfully');
      setMonthlyData(monthData);
      setHospitalData(hospData);
      setReportTotals(totals);
    } catch (error) {
      console.error("Erro ao carregar dados dos relatórios:", error);
      toast.error("Erro ao carregar dados", {
        description: "Não foi possível carregar os dados dos relatórios."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleYearChange = (year: string) => {
    setCurrentYear(year);
  };
  
  const handleFilterPeriod = () => {
    toast.info("Função em desenvolvimento", {
      description: "O filtro por período personalizado estará disponível em breve."
    });
  };
  
  const handleExport = (format: 'excel' | 'tiss' | 'fhir' = 'excel') => {
    try {
      const reportData = {
        period: `Ano ${currentYear}`,
        summary: reportTotals,
        hospitalData: hospitalData,
        monthlyData: monthlyData,
        procedureData: [] // Será implementado na próxima versão
      };
      
      const filename = `relatorio-medcheck-${currentYear}`;
      
      switch (format) {
        case 'excel':
          exportReportToExcel(reportData, filename);
          toast.success("Relatório exportado em Excel", {
            description: "O arquivo foi baixado para o seu computador."
          });
          break;
          
        case 'tiss':
          exportToTissXML(hospitalData, `${filename}-tiss`);
          toast.success("Relatório exportado em formato TISS (XML)", {
            description: "O arquivo XML foi baixado para o seu computador."
          });
          break;
          
        case 'fhir':
          exportToFHIR(hospitalData, 'Organization', `${filename}-fhir`);
          toast.success("Relatório exportado em formato HL7 FHIR", {
            description: "O arquivo JSON foi baixado para o seu computador."
          });
          break;
      }
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast.error("Erro ao exportar", {
        description: "Não foi possível exportar o relatório."
      });
    }
  };

  return (
    <MainLayout 
      title="Relatórios" 
      isLoading={loading} 
      loadingMessage="Carregando relatórios..."
    >
      <PageHeader
        title="Relatórios"
        description="Visualize e exporte resumos de pagamentos e procedimentos"
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Exportar</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Exportar como Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('tiss')}>
                Exportar como TISS (XML)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('fhir')}>
                Exportar como HL7 FHIR
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      
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
    </MainLayout>
  );
};

export default ReportsPage;
