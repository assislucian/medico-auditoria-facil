
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ComparisonView from '@/components/ComparisonView';
import { supabase } from '@/integrations/supabase/client';
import { getExtractedData } from '@/services/analysisService';
import { ExtractedData } from '@/types/upload';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const CompareContracheque = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (analysisId) {
        try {
          const data = await getExtractedData(analysisId);
          if (data) {
            setExtractedData(data);
          }
        } catch (error) {
          console.error('Error fetching analysis data:', error);
          // Handle error appropriately, e.g., show an error message
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadData();
  }, [analysisId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!extractedData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Análise não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comparativo de Contrachoque</h1>
      <ComparisonView extractedData={extractedData} />
    </div>
  );
};

export default CompareContracheque;
