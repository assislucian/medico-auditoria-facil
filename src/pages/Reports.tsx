import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { StatusCardsSection } from "@/components/reports/StatusCardsSection";
import { OverviewCharts } from "@/components/reports/OverviewCharts";
import { HospitalsTable } from "@/components/reports/HospitalsTable";
import { fetchMonthlyData, fetchHospitalData, fetchReportsTotals } from "@/services/reports";
import { exportToExcel } from "@/services/export";
import { exportToTissXML } from "@/services/export/tissExport";
import { exportToFHIR } from "@/services/export/fhirExport";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";

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
          exportToExcel(reportData.hospitalData || [], filename);
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

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Carregando Relatórios | MedCheck</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Navbar isLoggedIn={true} />
          <div className="flex-1 container py-8 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-medium mb-2">Carregando relatórios...</h2>
              <p className="text-muted-foreground">
                Estamos buscando os dados mais recentes.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Relatórios | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={true} />
        <div className="flex-1 container py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Exportar
                  </Button>
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
            </div>
          </div>
          
          <ReportsHeader 
            onExport={() => handleExport('excel')}
            onYearChange={handleYearChange}
            onFilterPeriod={handleFilterPeriod}
          />
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
