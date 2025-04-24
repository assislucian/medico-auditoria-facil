
/**
 * History.tsx
 * 
 * Página que exibe o histórico de análises realizadas pelo usuário.
 * Oferece funcionalidades de filtro, exportação e visualização detalhada.
 */

import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import { DateRange } from "react-day-picker";
import { format } from 'date-fns';
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { HistorySearch } from "@/components/history/HistorySearch";
import { HistoryTable } from "@/components/history/HistoryTable";
import { fetchHistoryData, searchHistory } from '@/services/historyService';
import { HistoryItem } from '@/components/history/data';
import { Loader2 } from 'lucide-react';
import { exportToExcel } from '@/services/exportService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Página de histórico de análises
 * Gerencia a exibição, busca e filtragem de análises anteriores
 */
const HistoryPage = () => {
  // Estados para controle dos filtros e resultados
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const { user, loading: authLoading } = useAuth();
  
  /**
   * Carrega dados do histórico baseado nos filtros aplicados
   */
  const loadHistoryData = useCallback(async () => {
    if (authLoading) return;
    
    if (!user) {
      toast.error("Faça login para visualizar seu histórico");
      return;
    }
    
    setLoading(true);
    setLoadingFailed(false);
    
    try {
      console.log("Carregando histórico com filtros:", { 
        searchTerm, 
        dateRange, 
        filterStatus 
      });
      
      // Se houver filtros ativos, usa a função de busca filtrada
      if (searchTerm || dateRange?.from || filterStatus !== "todos") {
        const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
        const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;
        const data = await searchHistory(searchTerm, startDate, endDate, filterStatus);
        
        console.log("Dados filtrados recebidos:", data);
        setHistoryData(data);
      } else {
        // Caso contrário, busca todos os registros
        const data = await fetchHistoryData();
        console.log("Todos os dados recebidos:", data);
        setHistoryData(data);
      }
    } catch (error) {
      console.error("Erro ao carregar o histórico:", error);
      setLoadingFailed(true);
      toast.error("Não foi possível carregar seu histórico de análises", {
        description: "Verifique sua conexão de internet e tente novamente."
      });
    } finally {
      setLoading(false);
    }
  }, [user, authLoading, searchTerm, dateRange, filterStatus]);
  
  // Carregar histórico quando os filtros mudarem
  useEffect(() => {
    loadHistoryData();
  }, [loadHistoryData]);
  
  /**
   * Manipulador para exportação do histórico para Excel
   */
  const handleExport = () => {
    try {
      if (historyData.length === 0) {
        toast.warning("Nenhum dado para exportar");
        return;
      }
      
      exportToExcel(historyData, 'historico-analises');
      toast.success("Histórico exportado com sucesso");
    } catch (error) {
      console.error("Erro ao exportar histórico:", error);
      toast.error("Falha ao exportar histórico");
    }
  };
  
  /**
   * Manipulador para recarregar os dados
   */
  const handleRefresh = () => {
    loadHistoryData();
  };

  return (
    <AuthenticatedLayout title="Histórico de Análises">
      <Helmet>
        <title>Histórico de Análises | MedCheck</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Histórico de Análises</h1>
        </div>
        
        <HistorySearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          onExport={handleExport}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRefresh={handleRefresh}
        />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Carregando histórico...</span>
          </div>
        ) : loadingFailed ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Não foi possível carregar o histórico.</p>
            <button 
              onClick={handleRefresh}
              className="mt-4 text-primary hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : historyData.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Nenhum histórico de análise encontrado.</p>
            <p className="text-gray-500 text-sm mt-1">
              Faça upload de arquivos para gerar análises ou ajuste os filtros de busca.
            </p>
          </div>
        ) : (
          <HistoryTable items={historyData} />
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default HistoryPage;
