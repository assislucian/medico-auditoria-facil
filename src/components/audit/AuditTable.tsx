
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AuditData } from '@/hooks/useAudit';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

interface AuditTableProps {
  data: AuditData[];
  selectedParticipations: string[];
  onToggleSelection: (id: string) => void;
}

export function AuditTable({ data, selectedParticipations, onToggleSelection }: AuditTableProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <span className="sr-only">Selecionar</span>
            </TableHead>
            <TableHead>Procedimento</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead className="text-right">Esperado</TableHead>
            <TableHead className="text-right">Recebido</TableHead>
            <TableHead className="text-right">Diferença</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const isUnderPaid = (item.difference || 0) < 0;
            const isSelected = selectedParticipations.includes(item.participation_id);
            
            return (
              <TableRow key={item.participation_id}>
                <TableCell>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelection(item.participation_id)}
                    disabled={!isUnderPaid} // Only allow selection of underpaid items
                  />
                </TableCell>
                <TableCell className="font-medium">{item.procedimento}</TableCell>
                <TableCell>{item.codigo}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.role_name}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.expected_value)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.valor_pago)}
                </TableCell>
                <TableCell className={`text-right font-medium ${
                  item.difference < 0 ? 'text-red-500' : item.difference > 0 ? 'text-green-500' : ''
                }`}>
                  {formatCurrency(item.difference)}
                </TableCell>
                <TableCell>
                  {item.difference < 0 ? (
                    <div className="flex items-center">
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-xs">Abaixo</span>
                    </div>
                  ) : item.difference > 0 ? (
                    <div className="flex items-center">
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs">Acima</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <MinusIcon className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-xs">Correto</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
