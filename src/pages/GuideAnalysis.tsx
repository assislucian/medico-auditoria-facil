
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAudit } from '@/hooks/useAudit';
import { AuditTable } from '@/components/audit/AuditTable';
import { AuditSummary } from '@/components/audit/AuditSummary';
import { Button } from '@/components/ui/button';
import { FileText, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const GuideAnalysisPage = () => {
  const { id: guideId } = useParams<{ id: string }>();
  const { 
    data, 
    isLoading, 
    error,
    summary,
    selectedParticipations,
    toggleParticipation,
    generateContestation,
    isGeneratingContestation
  } = useAudit(guideId);

  return (
    <MainLayout title="Análise de Guia">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Análise de Guia {guideId}
            </h1>
            <p className="text-muted-foreground">
              Comparativo entre valores esperados e pagos para os procedimentos desta guia
            </p>
          </div>
          
          <Button
            variant="default"
            onClick={generateContestation}
            disabled={selectedParticipations.length === 0 || isGeneratingContestation}
            className="gap-2"
          >
            {isGeneratingContestation ? (
              <>
                <Skeleton className="h-4 w-4 rounded-full" />
                Gerando...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Gerar Contestação
              </>
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <AlertTriangle className="h-10 w-10 text-yellow-500" />
                <h3 className="mt-4 text-lg font-semibold">Erro ao carregar dados</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Ocorreu um erro ao carregar os dados da análise. Por favor, tente novamente mais tarde.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : data && data.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <FileText className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhum dado encontrado</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Não foram encontrados dados de pagamento para esta guia.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {summary && <AuditSummary summary={summary} />}
            
            <Card>
              <CardHeader>
                <CardTitle>Procedimentos da Guia</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditTable 
                  data={data || []} 
                  selectedParticipations={selectedParticipations}
                  onToggleSelection={toggleParticipation}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default GuideAnalysisPage;
