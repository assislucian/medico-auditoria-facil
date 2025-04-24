import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { DateRange } from "react-day-picker";
import { format, parseISO } from 'date-fns';
import Navbar from "@/components/Navbar";
import { HistorySearch } from "@/components/history/HistorySearch";
import { HistoryTable } from "@/components/history/HistoryTable";
import { fetchHistoryData, searchHistory } from '@/services/historyService';
import { HistoryItem } from '@/components/history/data';
import { Loader2 } from 'lucide-react';
import { exportToExcel } from '@/services/exportService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    const loadHistoryData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // If there's an active search or date filter, use the search endpoint
        if (searchTerm || dateRange?.from || filterStatus !== "todos") {
          const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
          const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;
          const data = await searchHistory(searchTerm, startDate, endDate);
          setHistoryData(data);
        } else {
          // Otherwise use the regular fetch endpoint
          const data = await fetchHistoryData();
          setHistoryData(data);
        }
      } catch (error) {
        console.error("Erro ao carregar o histórico:", error);
        toast.error("Não foi possível carregar seu histórico de análises");
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      loadHistoryData();
    }
  }, [user, authLoading, searchTerm, dateRange, filterStatus]);
  
  const filteredHistory = historyData.filter(item => {
    // Additional client-side filtering by status if needed
    return filterStatus === "todos" || 
      item.status.toLowerCase() === filterStatus.toLowerCase();
  });
  
  const handleExport = () => {
    try {
      exportToExcel(filteredHistory, 'historico-analises');
      toast.success("Histórico exportado com sucesso");
    } catch (error) {
      console.error("Erro ao exportar histórico:", error);
      toast.error("Falha ao exportar histórico");
    }
  };

  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Histórico de Análises | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={true} />
        <div className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6">Histórico de Análises</h1>
          
          <HistorySearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            onExport={handleExport}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          
          {loading || authLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Carregando histórico...</span>
            </div>
          ) : historyData.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Nenhum histórico de análise encontrado.</p>
              <p className="text-gray-500 text-sm mt-1">Faça upload de arquivos para gerar análises.</p>
            </div>
          ) : (
            <HistoryTable items={filteredHistory} />
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
