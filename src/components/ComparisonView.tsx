
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

const ComparisonView = () => {
  const [isDetailView, setIsDetailView] = useState(false);
  const {
    demonstrativos,
    selectedDemonstrativo,
    setSelectedDemonstrativo,
    currentDemonstrativo,
    procedimentos,
    getTotals
  } = useDemonstrativoSelection();

  const exportReport = () => {
    if (!currentDemonstrativo) return;

    const reportData = {
      demonstrativo: {
        numero: currentDemonstrativo.numero,
        competencia: currentDemonstrativo.competencia,
        hospital: currentDemonstrativo.hospital,
        data: currentDemonstrativo.data,
        beneficiario: currentDemonstrativo.beneficiario
      },
      procedimentos: currentDemonstrativo.procedimentos.map(proc => ({
        guia: proc.guia,
        codigo: proc.codigo,
        procedimento: proc.procedimento,
        medicos: proc.doctors.map(doc => ({
          nome: doc.name,
          papel: doc.role,
          crm: doc.code,
          valorCBHPM: calculateCBHPMByRole(proc.valorCBHPM, doc.role),
          valorPago: proc.valorPago / proc.doctors.length, // Distribuição proporcional
          diferenca: calculateCBHPMByRole(proc.valorCBHPM, doc.role) - (proc.valorPago / proc.doctors.length)
        })),
        status: proc.pago ? (proc.diferenca < 0 ? 'Pago Parcialmente' : 'Pago Corretamente') : 'Não Pago'
      })),
      totais: getTotals()
    };

    console.log('Dados do relatório para contestação:', reportData);
    
    const fileName = `contestacao_${currentDemonstrativo.numero}_${currentDemonstrativo.beneficiario}.pdf`;
    toast.success(`Relatório de contestação "${fileName}" gerado com sucesso!`);
  };

  const { totalCBHPM, totalPago, totalDiferenca, procedimentosNaoPagos } = getTotals();

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
          <DemonstrativeInfo demonstrativo={currentDemonstrativo} />
        )}

        <SummaryCards 
          totalCBHPM={totalCBHPM}
          totalPago={totalPago}
          totalDiferenca={totalDiferenca}
          procedimentosNaoPagos={procedimentosNaoPagos}
        />

        <ProceduresTable 
          procedimentos={procedimentos}
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
