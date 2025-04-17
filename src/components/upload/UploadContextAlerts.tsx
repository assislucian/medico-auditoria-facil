
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { FileType } from '@/types/upload';

interface UploadContextAlertsProps {
  showGuideAlert: boolean;
  showDemonstrativoAlert: boolean;
}

const UploadContextAlerts = ({ showGuideAlert, showDemonstrativoAlert }: UploadContextAlertsProps) => {
  return (
    <>
      {showGuideAlert && (
        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você enviou apenas demonstrativos. O sistema irá extrair os valores pagos, mas não poderá verificar 
            detalhes dos procedimentos ou comparar com a tabela CBHPM 2015. Para uma análise completa incluindo 
            comparativo por papel médico (cirurgião, auxiliares), adicione também guias médicas.
          </AlertDescription>
        </Alert>
      )}
      
      {showDemonstrativoAlert && (
        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você enviou apenas guias médicas. O sistema irá extrair os procedimentos realizados, mas não poderá 
            verificar os valores pagos ou detectar glosas. Para comparação com tabela CBHPM 2015 por papel médico, 
            adicione também demonstrativos de pagamento.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default UploadContextAlerts;
