
/**
 * ProceduresTable.tsx
 * 
 * Componente para exibir procedimentos médicos em formato de tabela.
 * Destaca divergências, glosas e valores de referência CBHPM.
 */

import { Procedure } from '@/types/medical';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, HelpCircle, Users } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { findProcedureByCodigo, calculateTotalCBHPM } from '@/data/cbhpmData';
import { formatCurrency } from '@/utils/numberUtils';

interface ProceduresTableProps {
  procedimentos: Procedure[];
  isDetailView: boolean;
}

/**
 * Tabela para exibição e comparação de procedimentos médicos
 */
export const ProceduresTable = ({ procedimentos, isDetailView }: ProceduresTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Guia</TableHead>
          <TableHead className="w-[300px]">Procedimento</TableHead>
          <TableHead>Médicos</TableHead>
          <TableHead className="text-right">Valor CBHPM</TableHead>
          <TableHead className="text-right">Valor Pago</TableHead>
          <TableHead className="text-right">Diferença</TableHead>
          <TableHead className="text-center">Status</TableHead>
          {isDetailView && <TableHead>Ação</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {procedimentos.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isDetailView ? 9 : 8} className="text-center py-8">
              Nenhum procedimento encontrado
            </TableCell>
          </TableRow>
        ) : (
          procedimentos.map((item) => {
            // Buscar dados CBHPM para este código
            const cbhpmData = findProcedureByCodigo(item.codigo);
            const baseCBHPM = cbhpmData ? calculateTotalCBHPM(cbhpmData) : item.valorCBHPM;
            
            return (
              <TableRow 
                key={item.id} 
                className={!item.pago 
                  ? 'bg-red-500/5' 
                  : item.diferenca < 0 
                    ? 'bg-amber-500/5' 
                    : ''
                }
              >
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
                          <p className="max-w-xs">
                            CBHPM 2015: {cbhpmData?.descricao || item.procedimento}<br />
                            Valor Base: {formatCurrency(baseCBHPM)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Users className="h-4 w-4 mr-2" />
                        {item.doctors.length} médicos
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        {item.doctors.map((doctor) => (
                          <div key={doctor.code} className="flex flex-col space-y-1 border-b last:border-0 pb-2">
                            <span className="font-medium">{doctor.name}</span>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <Badge variant="outline" className={
                                doctor.role === "Cirurgiao" ? "bg-blue-500/10 text-blue-500" : 
                                doctor.role === "Primeiro Auxiliar" ? "bg-green-500/10 text-green-500" : 
                                doctor.role === "Anestesista" ? "bg-amber-500/10 text-amber-500" :
                                "bg-purple-500/10 text-purple-500"
                              }>
                                {doctor.role}
                              </Badge>
                              <span>CRM: {doctor.code}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(item.valorCBHPM)}</TableCell>
                <TableCell className="text-right">
                  {item.pago ? formatCurrency(item.valorPago) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {item.diferenca === 0 ? (
                    <span>-</span>
                  ) : (
                    <span className={item.diferenca < 0 ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                      {item.diferenca < 0 ? '-' : '+'} {formatCurrency(Math.abs(item.diferenca), false)}
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
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
