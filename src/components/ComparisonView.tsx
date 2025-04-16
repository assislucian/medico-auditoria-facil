
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { SummaryCards } from './comparison/SummaryCards';
import { ComparisonHeader } from './comparison/ComparisonHeader';
import { DemonstrativeInfo } from './comparison/DemonstrativeInfo';
import { ProceduresTable } from './comparison/ProceduresTable';
import { useDemonstrativoSelection } from '@/hooks/useDemonstrativoSelection';
import { getExtractedData } from '@/services/uploadService';

const ComparisonView = () => {
  const [isDetailView, setIsDetailView] = useState(false);
  const {
    demonstrativos,
    selectedDemonstrativo,
    setSelectedDemonstrativo,
    currentDemonstrativo,
    procedimentos
  } = useDemonstrativoSelection();

  // Obter dados extraídos do serviço (que seriam os dados completos)
  const extractedData = getExtractedData();
  const totais = extractedData.totais;

  const exportReport = () => {
    if (!currentDemonstrativo) return;

    const reportData = {
      demonstrativo: extractedData.demonstrativoInfo,
      procedimentos: extractedData.procedimentos,
      totais: extractedData.totais
    };

    console.log('Dados do relatório para contestação:', reportData);
    
    const fileName = `contestacao_${currentDemonstrativo.numero}_${currentDemonstrativo.beneficiario}.pdf`;
    toast.success(`Relatório de contestação "${fileName}" gerado com sucesso!`);
  };

  return (
    <Card className="w-full">
      <ComparisonHeader 
        demonstrativos={demonstrativos}
        selectedDemonstrativo={selectedDemonstrativo}
        onDemonstrativoChange={setSelectedDemonstrativo}
        onViewChange={setIsDetailView}
        isDetailView={isDetailView}
      />
      
      <CardContent>
        {currentDemonstrativo && (
          <DemonstrativeInfo demonstrativo={{
            ...currentDemonstrativo,
            ...extractedData.demonstrativoInfo
          }} />
        )}

        <SummaryCards 
          totalCBHPM={totais.valorCBHPM}
          totalPago={totais.valorPago}
          totalDiferenca={totais.diferenca}
          procedimentosNaoPagos={totais.procedimentosNaoPagos}
        />

        <ProceduresTable 
          procedimentos={extractedData.procedimentos}
          isDetailView={isDetailView}
        />
      </CardContent>

      <CardFooter className="border-t p-4">
        <div className="flex justify-between w-full items-center">
          <p className="text-sm text-muted-foreground">
            Análise baseada na Tabela CBHPM 2015
          </p>
          <Button onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório para Contestação
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ComparisonView;
