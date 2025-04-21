
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProceduresTable } from './comparison/ProceduresTable';
import { SummaryCards } from './comparison/SummaryCards';
import { ComparisonHeader } from './comparison/ComparisonHeader';
import { DemonstrativeInfo } from './comparison/DemonstrativeInfo';
import { getExtractedData } from '@/services/analysisService';
import { ExtractedData } from '@/types/upload';
import { Procedure } from '@/types/medical';
import { Skeleton } from '@/components/ui/skeleton';

interface ComparisonViewProps {
  analysisId?: string | null;
}

/**
 * ComparisonView Component
 * 
 * Exibe os resultados da comparação entre as guias e demonstrativos,
 * mostrando valores CBHPM x valores pagos e destacando diferenças.
 */
const ComparisonView = ({ analysisId }: ComparisonViewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ExtractedData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const extractedData = await getExtractedData(analysisId);
        setData(extractedData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [analysisId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-64" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao carregar dados</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Não foi possível carregar os dados da análise. Por favor, tente processar os arquivos novamente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <ComparisonHeader 
          totalProcedimentos={data.procedimentos.length}
          hospital={data.demonstrativoInfo?.hospital}
          competencia={data.demonstrativoInfo?.competencia}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <SummaryCards 
          totalCBHPM={data.totais.valorCBHPM}
          totalPago={data.totais.valorPago}
          totalDiferenca={data.totais.diferenca}
          procedimentosNaoPagos={data.totais.procedimentosNaoPagos}
        />
        
        <DemonstrativeInfo 
          info={data.demonstrativoInfo}
        />
        
        <div className="rounded-lg border">
          <div className="overflow-hidden">
            <ProceduresTable 
              procedimentos={data.procedimentos as unknown as Procedure[]}
              isDetailView={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonView;
