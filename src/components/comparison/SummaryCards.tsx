
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Info } from 'lucide-react';

interface SummaryCardsProps {
  totalCBHPM: number;
  totalPago: number;
  totalDiferenca: number;
  procedimentosNaoPagos: number;
}

export const SummaryCards = ({ 
  totalCBHPM, 
  totalPago, 
  totalDiferenca, 
  procedimentosNaoPagos 
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-secondary/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Valor CBHPM</p>
          <p className="text-2xl font-bold">R$ {totalCBHPM.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Valor Pago</p>
          <p className="text-2xl font-bold">R$ {totalPago.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <Card className={`${totalDiferenca < 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-muted-foreground">Diferença</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Diferença entre o valor CBHPM 2015 e o valor efetivamente pago pelo plano</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className={`text-2xl font-bold ${totalDiferenca < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {totalDiferenca < 0 ? '-' : '+'} R$ {Math.abs(totalDiferenca).toFixed(2)}
          </p>
        </CardContent>
      </Card>
      
      <Card className={`${procedimentosNaoPagos > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-muted-foreground">Procedimentos Não Pagos</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Procedimentos que constam na guia mas não foram pagos pelo plano</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className={`text-2xl font-bold ${procedimentosNaoPagos > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {procedimentosNaoPagos}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
