
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { fetchAnalysisById, fetchProceduresByAnalysisId } from '@/utils/supabase';
import { ExtractedData } from '@/types';
import ComparisonView from '@/components/ComparisonView';
import { MainLayout } from '@/components/layout/MainLayout';

const CompareContracheque = () => {
  const location = useLocation();
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<ExtractedData | null>(null);
  
  // Extract analysis ID from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('analysisId');
    setAnalysisId(id);
  }, [location]);
  
  // Fetch analysis data when ID is available
  useEffect(() => {
    const fetchData = async () => {
      if (!analysisId) return;
      
      setLoading(true);
      try {
        // Properly pass only one argument to fetchAnalysisById
        const analysis = await fetchAnalysisById(analysisId);
        
        if (analysis) {
          // Fetch procedures related to this analysis
          const procedures = await fetchProceduresByAnalysisId(analysis.id);
          
          // Transform the data to match the ExtractedData type
          const transformedData: ExtractedData = {
            id: analysis.id,
            procedures: procedures.map(proc => ({
              id: proc.id,
              codigo: proc.codigo,
              procedimento: proc.procedimento,
              papel: proc.papel || undefined,
              valorCBHPM: proc.valor_cbhpm || 0,
              valorPago: proc.valor_pago || 0,
              diferenca: proc.diferenca || 0,
              pago: proc.pago || false,
              guia: proc.guia || undefined,
              beneficiario: proc.beneficiario || undefined,
              doctors: Array.isArray(proc.doctors) ? proc.doctors : []
            }))
          };
          
          setAnalysisData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [analysisId]);

  return (
    <MainLayout title="Comparação">
      <Helmet>
        <title>Comparativo | MedCheck</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Comparativo de Pagamentos</h1>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <ComparisonView analysisId={analysisId} />
        )}
      </div>
    </MainLayout>
  );
};

export default CompareContracheque;
