
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowUpDown, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ComparisonDetail {
  id: string;
  codigo: string;
  descricao: string;
  qtd: number;
  valorCbhpm: number;
  valorPago: number;
  diferenca: number;
  status: 'conforme' | 'abaixo' | 'acima' | 'não_pago';
  papel: 'Cirurgião' | 'Primeiro Auxiliar' | 'Segundo Auxiliar';
}

interface CBHPMComparisonSummary {
  total: number;
  conforme: number;
  abaixo: number;
  acima: number;
}

interface CBHPMComparisonTableProps {
  summary: CBHPMComparisonSummary;
  details: ComparisonDetail[];
}

const CBHPMComparisonTable: React.FC<CBHPMComparisonTableProps> = ({ summary, details }) => {
  const [currentRole, setCurrentRole] = useState<string>('all');
  const [currentStatus, setCurrentStatus] = useState<string>('all');

  // Filter the details based on the selected role and status
  const filteredDetails = details.filter(detail => {
    const roleMatch = currentRole === 'all' || detail.papel === currentRole;
    const statusMatch = currentStatus === 'all' || detail.status === currentStatus;
    return roleMatch && statusMatch;
  });

  // Status badge color variants
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'conforme': 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">Conforme</Badge>;
      case 'abaixo': 
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300">Abaixo</Badge>;
      case 'acima': 
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300">Acima</Badge>;
      case 'não_pago': 
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300">Não Pago</Badge>;
      default: 
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h3 className="text-lg font-semibold">Comparativo CBHPM 2015</h3>
        
        <div className="flex flex-wrap gap-2">
          <Select value={currentRole} onValueChange={setCurrentRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os papéis</SelectItem>
              <SelectItem value="Cirurgião">Cirurgião</SelectItem>
              <SelectItem value="Primeiro Auxiliar">Primeiro Auxiliar</SelectItem>
              <SelectItem value="Segundo Auxiliar">Segundo Auxiliar</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs defaultValue="all" value={currentStatus} onValueChange={setCurrentStatus}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="conforme">Conforme</TabsTrigger>
              <TabsTrigger value="abaixo">Abaixo</TabsTrigger>
              <TabsTrigger value="acima">Acima</TabsTrigger>
              <TabsTrigger value="não_pago">Não pago</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[60px] text-right">Qtd</TableHead>
              <TableHead className="w-[120px] text-right">CBHPM</TableHead>
              <TableHead className="w-[120px] text-right">Pago</TableHead>
              <TableHead className="w-[120px] text-right">
                <div className="flex items-center justify-end gap-1">
                  Diferença
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px]">Diferença entre o valor CBHPM 2015 e o valor pago</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[150px]">Papel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDetails.length > 0 ? (
              filteredDetails.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell className="font-medium">{detail.codigo}</TableCell>
                  <TableCell>{detail.descricao}</TableCell>
                  <TableCell className="text-right">{detail.qtd}</TableCell>
                  <TableCell className="text-right">R$ {detail.valorCbhpm.toFixed(2)}</TableCell>
                  <TableCell className="text-right">R$ {detail.valorPago.toFixed(2)}</TableCell>
                  <TableCell className={`text-right ${detail.diferenca < 0 ? 'text-red-600' : detail.diferenca > 0 ? 'text-green-600' : ''}`}>
                    R$ {Math.abs(detail.diferenca).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(detail.status)}</TableCell>
                  <TableCell>{detail.papel}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CBHPMComparisonTable;
