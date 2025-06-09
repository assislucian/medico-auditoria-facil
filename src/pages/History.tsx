
import { useEffect, useState } from 'react';
import { HistoryTable } from '@/components/history/HistoryTable';
import { HistorySearch } from '@/components/history/HistorySearch';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { HistoryItem, type HistoryFilters } from '@/components/history/data';
import { DateRange } from 'react-day-picker';
import { fetchHistoryData, searchHistory } from '@/services/historyService';

const HistoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  useEffect(() => {
    const loadHistoryData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchHistoryData();
        setHistoryItems(data);
      } catch (error) {
        console.error('Error loading history data:', error);
        toast.error('Erro ao carregar histórico');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistoryData();
  }, []);
  
  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);
    await filterHistoryData(value, filterStatus, dateRange);
  };
  
  const handleFilterChange = async (value: string) => {
    setFilterStatus(value);
    await filterHistoryData(searchTerm, value, dateRange);
  };
  
  const handleDateRangeChange = async (range: DateRange | undefined) => {
    setDateRange(range);
    await filterHistoryData(searchTerm, filterStatus, range);
  };
  
  const filterHistoryData = async (
    search: string, 
    status: string, 
    dates: DateRange | undefined
  ) => {
    setIsLoading(true);
    
    try {
      const startDate = dates?.from ? dates.from.toISOString().split('T')[0] : undefined;
      const endDate = dates?.to ? dates.to.toISOString().split('T')[0] : undefined;
      
      const filteredData = await searchHistory(search, startDate, endDate, status);
      setHistoryItems(filteredData);
    } catch (error) {
      console.error('Error filtering history data:', error);
      toast.error('Erro ao filtrar histórico');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = () => {
    toast.info("Função em desenvolvimento", {
      description: "A exportação do histórico estará disponível em breve."
    });
  };

  return (
    <MainLayout 
      title="Histórico de Análises" 
      isLoading={isLoading}
      loadingMessage="Carregando histórico..."
    >
      <div className="space-y-6">
        <PageHeader
          title="Histórico de Análises"
          description="Consulte todas as análises realizadas e seus resultados"
          actions={
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          }
        />
        
        <HistorySearch 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterStatus={filterStatus}
          onFilterChange={handleFilterChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onExport={handleExport}
        />
        
        <HistoryTable 
          items={historyItems} 
        />
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
