
import { Procedure } from '@/types/medical';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProceduresTableProps {
  procedimentos: Procedure[];
  isDetailView: boolean;
}

export const ProceduresTable = ({ procedimentos, isDetailView }: ProceduresTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Guia</TableHead>
          <TableHead className="w-[300px]">Procedimento</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead className="text-right">Valor CBHPM</TableHead>
          <TableHead className="text-right">Valor Pago</TableHead>
          <TableHead className="text-right">Diferença</TableHead>
          <TableHead className="text-center">Status</TableHead>
          {isDetailView && <TableHead>Ação</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {procedimentos.map((item) => (
          <TableRow key={item.id} className={!item.pago ? 'bg-red-500/5' : item.diferenca < 0 ? 'bg-amber-500/5' : ''}>
            <TableCell className="font-medium">{item.codigo}</TableCell>
            <TableCell>{item.guia}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {item.procedimento}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Informações detalhadas sobre o procedimento {item.codigo}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={
                item.papel === "Cirurgião" ? "bg-blue-500/10 text-blue-500" : 
                item.papel === "1º Auxiliar" ? "bg-green-500/10 text-green-500" : 
                "bg-amber-500/10 text-amber-500"
              }>
                {item.papel}
              </Badge>
            </TableCell>
            <TableCell className="text-right">R$ {item.valorCBHPM.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              {item.pago ? `R$ ${item.valorPago.toFixed(2)}` : '-'}
            </TableCell>
            <TableCell className="text-right">
              {item.diferenca === 0 ? (
                <span>-</span>
              ) : (
                <span className={item.diferenca < 0 ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                  {item.diferenca < 0 ? '-' : '+'} R$ {Math.abs(item.diferenca).toFixed(2)}
                </span>
              )}
            </TableCell>
            <TableCell className="text-center">
              {item.pago ? (
                item.diferenca < 0 ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                    Pago Parcialmente
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Pago Corretamente
                  </Badge>
                )
              ) : (
                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Não Pago
                </Badge>
              )}
            </TableCell>
            {isDetailView && (
              <TableCell>
                <Button variant="ghost" size="sm">Contestar</Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
