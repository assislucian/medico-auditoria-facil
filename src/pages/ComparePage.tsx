
/**
 * ComparePage.tsx
 * 
 * Página para visualização da comparação entre guias e demonstrativos.
 * Exibe o resultado detalhado da análise de procedimentos e valores.
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ComparisonView from '@/components/comparison/ComparisonView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';

/**
 * Página de comparação para visualização de análises
 */
const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');
  const navigate = useNavigate();
  
  return (
    <AuthenticatedLayout title="Resultado da Análise">
      <Helmet>
        <title>Comparativo | MedCheck</title>
      </Helmet>
      
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate('/historico')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao Histórico
        </Button>
        
        <h1 className="text-2xl font-bold">
          Resultado da Análise {analysisId ? `#${analysisId.slice(-6)}` : ''}
        </h1>
      </div>
      
      <ComparisonView analysisId={analysisId} />
    </AuthenticatedLayout>
  );
};

export default ComparePage;
