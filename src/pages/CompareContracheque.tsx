
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';
import CBHPMSummaryCards from '@/components/comparison/CBHPMSummaryCards';
import CBHPMComparisonTable from '@/components/comparison/CBHPMComparisonTable';
import { useComparisonData } from '@/hooks/useComparisonData';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';

const CompareContracheque = () => {
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useComparisonData(analysisId);
  const [guiaDetails, setGuiaDetails] = useState(null);
  const [isLoadingGuias, setIsLoadingGuias] = useState(false);

  // Buscar dados das guias relacionadas
  useEffect(() => {
    const fetchGuiaDetails = async () => {
      if (!analysisId) return;
      setIsLoadingGuias(true);
      try {
        const { data, error } = await supabase
          .from('procedures')
          .select('*')
          .eq('analysis_id', analysisId);
        
        if (error) {
          throw error;
        }
        
        // Filtrar apenas procedimentos da guia
        const guiaProcedures = data.filter(proc => proc.guia && proc.codigo);
        setGuiaDetails(guiaProcedures);
        
        // Mostrar informação sobre guias encontradas
        if (guiaProcedures.length > 0) {
          toast.info(`${guiaProcedures.length} procedimentos de guia encontrados para comparação`, {
            duration: 3000
          });
        }
      } catch (error) {
        console.error('Erro ao buscar guias:', error);
      } finally {
        setIsLoadingGuias(false);
      }
    };

    fetchGuiaDetails();
  }, [analysisId]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const navigateToUpload = () => {
    navigate('/uploads');
  };

  return (
    <>
      <Helmet>
        <title>Comparativo Contracheque | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={true} />
        <div className="flex-1 container py-8">
          <div className="flex items-center mb-6 gap-2">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Comparativo Contracheque CBHPM</h1>
          </div>

          {isLoading || isLoadingGuias ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Skeleton className="h-8 w-8 rounded-full mb-2" />
                        <Skeleton className="h-8 w-16 mb-1" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-64 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : isError || !data ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Análise não encontrada</h2>
                <p className="text-muted-foreground mb-6">
                  Não foi possível carregar a análise solicitada ou você não tem acesso a ela.
                </p>
                <Button onClick={navigateToUpload}>Fazer novo Upload</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <CBHPMSummaryCards 
                total={data.summary.total}
                conforme={data.summary.conforme}
                abaixo={data.summary.abaixo}
                acima={data.summary.acima}
              />
              
              <CBHPMComparisonTable 
                summary={data.summary}
                details={data.details}
                guiaDetails={guiaDetails}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CompareContracheque;
