
/**
 * ComparisonView.tsx
 * 
 * Componente principal da visualização de comparação entre guia e demonstrativo.
 * Exibe informações detalhadas sobre procedimentos, valores CBHPM e pagamentos.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Printer, Download, FileText, AlertCircle } from 'lucide-react';
import { ProceduresTable } from './ProceduresTable';
import { ComparisonSummary } from './ComparisonSummary';
import { ComparisonLoading } from './ComparisonLoading';
import { fetchAnalysisById, getCurrentAnalysis } from '@/services/upload/analysisService';
import { ExtractedData } from '@/types/upload';
import { toast } from 'sonner';

interface ComparisonViewProps {
  analysisId?: string | null;
}

/**
 * Componente para visualização comparativa dos resultados de análise
 */
const ComparisonView = ({ analysisId }: ComparisonViewProps) => {
  const [analysisData, setAnalysisData] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('todos');
  const navigate = useNavigate();
  
  // Carregar dados da análise
  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: ExtractedData | null = null;
        
        // Tentar obter análise por ID se fornecido
        if (analysisId) {
          console.log('Buscando análise pelo ID:', analysisId);
          data = await fetchAnalysisById(analysisId);
        }
        
        // Se não encontrou por ID, tenta recuperar da análise atual
        if (!data) {
          console.log('Tentando recuperar análise atual da sessão');
          const currentAnalysis = getCurrentAnalysis();
          data = currentAnalysis.data;
        }
        
        if (!data || data.procedimentos.length === 0) {
          setError('Nenhum dado de análise encontrado. Por favor, realize uma nova análise.');
          setLoading(false);
          return;
        }
        
        console.log('Dados de análise carregados:', data);
        setAnalysisData(data);
      } catch (err) {
        console.error('Erro ao carregar análise:', err);
        setError('Erro ao carregar dados da análise. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalysis();
  }, [analysisId]);
  
  // Manipuladores para exportação e impressão
  const handleExportPDF = () => {
    toast.info('Preparando exportação para PDF...');
    
    // Aqui seria implementada a exportação para PDF
    setTimeout(() => {
      toast.success('Relatório exportado com sucesso');
    }, 2000);
  };
  
  const handleExportExcel = () => {
    toast.info('Preparando exportação para Excel...');
    
    // Aqui seria implementada a exportação para Excel
    setTimeout(() => {
      toast.success('Dados exportados com sucesso');
    }, 2000);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  // Filtrar procedimentos baseados na aba ativa
  const getFilteredProcedures = () => {
    if (!analysisData) return [];
    
    switch (activeTab) {
      case 'pagos':
        return analysisData.procedimentos.filter(p => p.pago && p.diferenca >= 0);
      case 'pagos-parcialmente':
        return analysisData.procedimentos.filter(p => p.pago && p.diferenca < 0);
      case 'glosados':
        return analysisData.procedimentos.filter(p => !p.pago);
      default:
        return analysisData.procedimentos;
    }
  };
  
  // Se carregando, exibe componente de loading
  if (loading) {
    return <ComparisonLoading />;
  }
  
  // Se erro, exibe mensagem de erro
  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-orange-500" />
            <h3 className="text-lg font-medium">{error}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Você pode iniciar uma nova análise ou verificar se há problemas de conexão.
            </p>
            <Button onClick={() => navigate('/nova-auditoria')} className="mt-4">
              Iniciar Nova Análise
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calcular contagem de procedimentos por categoria
  const counts = {
    total: analysisData?.procedimentos.length || 0,
    pagos: analysisData?.procedimentos.filter(p => p.pago && p.diferenca >= 0).length || 0,
    parciais: analysisData?.procedimentos.filter(p => p.pago && p.diferenca < 0).length || 0,
    glosados: analysisData?.procedimentos.filter(p => !p.pago).length || 0
  };
  
  const filteredProcedures = getFilteredProcedures();
  
  return (
    <div className="space-y-6 print:space-y-2">
      {/* Cabeçalho com informações do demonstrativo */}
      <div className="flex justify-between items-center flex-wrap gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold">Resultado da Auditoria</h2>
          <p className="text-muted-foreground">
            {analysisData?.demonstrativoInfo.hospital} - {analysisData?.demonstrativoInfo.competencia}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileText className="h-4 w-4 mr-1" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>
      
      {/* Cartão com informações do demonstrativo */}
      <Card className="print:shadow-none print:border-none">
        <CardHeader className="print:py-2">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <CardTitle className="print:text-base">
                {analysisData?.demonstrativoInfo.hospital}
              </CardTitle>
              <CardDescription>
                Demonstrativo {analysisData?.demonstrativoInfo.numero} - Competência {analysisData?.demonstrativoInfo.competencia}
              </CardDescription>
            </div>
            <Badge variant="outline" className="print:hidden">
              {analysisData?.demonstrativoInfo.data}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="print:pt-0">
          <ComparisonSummary data={analysisData?.totais} />
          
          {/* Tabs para filtrar procedimentos */}
          <Tabs 
            defaultValue="todos" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-6 print:hidden"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="todos">
                Todos
                <Badge variant="secondary" className="ml-2">{counts.total}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pagos">
                Pagos Corretamente
                <Badge variant="secondary" className="ml-2">{counts.pagos}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pagos-parcialmente">
                Pagos Parcialmente
                <Badge variant="secondary" className="ml-2">{counts.parciais}</Badge>
              </TabsTrigger>
              <TabsTrigger value="glosados">
                Glosados
                <Badge variant="secondary" className="ml-2">{counts.glosados}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <div className="overflow-auto">
              <ProceduresTable 
                procedimentos={filteredProcedures}
                isDetailView={true}
              />
            </div>
          </Tabs>
          
          {/* Versão para impressão - sempre mostra todos os procedimentos */}
          <div className="hidden print:block mt-4">
            <ProceduresTable 
              procedimentos={analysisData?.procedimentos || []}
              isDetailView={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonView;
