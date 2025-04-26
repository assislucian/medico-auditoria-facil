
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ComparisonResult, MedicalGuideDetailed } from '@/types';
import { MedicalDataService } from '@/services/MedicalDataService';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalGuideView from '@/components/guide/MedicalGuideView';
import GuideStatementComparison from '@/components/comparison/GuideStatementComparison';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const CompararGuiaPage: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const [guide, setGuide] = useState<MedicalGuideDetailed | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!guideId) {
        toast.error('ID da guia não especificado');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const comparisonResult = await MedicalDataService.compareGuideWithStatements(guideId);
        
        if (!comparisonResult) {
          toast.error('Erro ao carregar comparação da guia');
          setLoading(false);
          return;
        }
        
        setGuide(comparisonResult.guia);
        setComparison(comparisonResult);
        
      } catch (error) {
        console.error('Error fetching guide comparison:', error);
        toast.error('Erro ao carregar comparação da guia');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [guideId]);
  
  return (
    <MainLayout title={guide ? `Comparação - Guia ${guide.numero}` : 'Comparação de Guia'}>
      <PageHeader
        title={guide ? `Comparação - Guia ${guide.numero}` : 'Comparação de Guia'}
        description="Compare os procedimentos da guia com os demonstrativos de pagamento"
      />
      
      {loading ? (
        <div className="flex justify-center items-center p-20">
          <LoadingSpinner size="lg" text="Carregando dados da guia..." />
        </div>
      ) : (
        <Tabs defaultValue="comparacao">
          <TabsList className="mb-4">
            <TabsTrigger value="comparacao">Comparação</TabsTrigger>
            <TabsTrigger value="guia">Dados da Guia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparacao">
            <Card>
              <CardContent className="pt-6">
                {comparison ? (
                  <GuideStatementComparison comparison={comparison} />
                ) : (
                  <div className="flex flex-col items-center justify-center p-10 text-center">
                    <h3 className="text-lg font-medium">Nenhuma comparação disponível</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Não foi possível carregar a comparação para esta guia.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guia">
            <Card>
              <CardContent className="pt-6">
                {guide ? (
                  <MedicalGuideView guide={guide} showPayments={false} />
                ) : (
                  <div className="flex flex-col items-center justify-center p-10 text-center">
                    <h3 className="text-lg font-medium">Nenhuma guia encontrada</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Não foi possível carregar os dados da guia.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </MainLayout>
  );
};

export default CompararGuiaPage;
