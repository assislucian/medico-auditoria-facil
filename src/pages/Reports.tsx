
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { StatusCardsSection } from "@/components/reports/StatusCardsSection";
import { OverviewCharts } from "@/components/reports/OverviewCharts";
import { HospitalsTable } from "@/components/reports/HospitalsTable";
import { fetchMonthlyData, fetchHospitalData, fetchReportsTotals } from "@/services/reportsService";
import { exportReportToExcel } from "@/services/exportService";
import { toast } from "sonner";

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
  
  useEffect(() => {
    loadReportsData();
  }, [currentYear]);
  
  const loadReportsData = async () => {
    try {
      // Carregar dados para os gráficos
      const monthData = await fetchMonthlyData();
      setMonthlyData(monthData);
      
      // Carregar dados para a tabela de hospitais
      const hospData = await fetchHospitalData();
      setHospitalData(hospData);
      
      // Carregar totais
      const totals = await fetchReportsTotals();
      setReportTotals(totals);
    } catch (error) {
      console.error("Erro ao carregar dados dos relatórios:", error);
      toast.error("Erro ao carregar dados", {
        description: "Não foi possível carregar os dados dos relatórios."
      });
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
  
  const handleExport = () => {
    try {
      const reportData = {
        period: `Ano ${currentYear}`,
        summary: reportTotals,
        hospitalData: hospitalData,
        monthlyData: monthlyData,
        procedureData: [] // Será implementado na próxima versão
      };
      
      exportReportToExcel(reportData, `relatorio-medcheck-${currentYear}`);
      
      toast.success("Relatório exportado com sucesso", {
        description: "O arquivo foi baixado para o seu computador."
      });
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      toast.error("Erro ao exportar", {
        description: "Não foi possível exportar o relatório."
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Relatórios | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={true} />
        <div className="flex-1 container py-8">
          <ReportsHeader 
            onExport={handleExport}
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
