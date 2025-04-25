
import { useEffect, useState } from 'react';
import { HistoryTable } from '@/components/history/HistoryTable';
import { HistorySearch } from '@/components/history/HistorySearch';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const HistoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulação de carregamento dos dados
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Histórico de Análises</h1>
            <p className="text-muted-foreground mt-1">
              Consulte todas as análises realizadas e seus resultados
            </p>
          </div>
          
          <Button variant="outline" onClick={handleExport} className="self-start">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
        
        <HistorySearch />
        <HistoryTable />
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
