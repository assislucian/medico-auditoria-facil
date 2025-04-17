
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';

interface ComparisonDetail {
  id: string;
  codigo: string;
  descricao: string;
  qtd: number;
  valorCbhpm: number;
  valorPago: number;
  diferenca: number;
  status: 'conforme' | 'abaixo' | 'acima' | 'não_pago';
  papel: string;
}

interface Summary {
  total: number;
  conforme: number;
  abaixo: number;
  acima: number;
}

interface CBHPMComparisonTableProps {
  summary: Summary;
  details: ComparisonDetail[];
}

const CBHPMComparisonTable: React.FC<CBHPMComparisonTableProps> = ({ summary, details }) => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Group details by role
  const groupedByRole: Record<string, ComparisonDetail[]> = details.reduce((acc, detail) => {
    const role = detail.papel;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(detail);
    return acc;
  }, {} as Record<string, ComparisonDetail[]>);

  // Get unique roles
  const roles = Object.keys(groupedByRole);

  // Filter logic
  const filteredDetails = details.filter(detail => {
    const matchesSearch = filter === '' || 
      detail.descricao.toLowerCase().includes(filter.toLowerCase()) || 
      detail.codigo.includes(filter);
    
    const matchesStatus = statusFilter === 'all' || detail.status === statusFilter;
    const matchesRole = roleFilter === 'all' || detail.papel === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'conforme':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 flex gap-1 items-center">
          <CheckCircle className="h-3 w-3" />Conforme
        </Badge>;
      case 'abaixo':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 flex gap-1 items-center">
          <XCircle className="h-3 w-3" />Abaixo
        </Badge>;
      case 'acima':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 flex gap-1 items-center">
          <AlertCircle className="h-3 w-3" />Acima
        </Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 flex gap-1 items-center">
          <XCircle className="h-3 w-3" />Não Pago
        </Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Cirurgião':
        return <Badge className="bg-primary/10 text-primary">{role}</Badge>;
      case 'Primeiro Auxiliar':
        return <Badge className="bg-green-500/10 text-green-500">{role}</Badge>;
      case 'Segundo Auxiliar':
        return <Badge className="bg-blue-500/10 text-blue-500">{role}</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-500">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código ou descrição"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="conforme">Conforme</SelectItem>
              <SelectItem value="abaixo">Abaixo</SelectItem>
              <SelectItem value="acima">Acima</SelectItem>
              <SelectItem value="não_pago">Não Pago</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os papéis</SelectItem>
              {roles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos ({summary.total})</TabsTrigger>
          {roles.map(role => (
            <TabsTrigger key={role} value={role}>
              {role} ({groupedByRole[role].length})
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <ComparisonTable 
            details={filteredDetails} 
            getStatusBadge={getStatusBadge}
            getRoleBadge={getRoleBadge}
          />
        </TabsContent>
        
        {roles.map(role => (
          <TabsContent key={role} value={role}>
            <ComparisonTable 
              details={groupedByRole[role].filter(detail => {
                const matchesSearch = filter === '' || 
                  detail.descricao.toLowerCase().includes(filter.toLowerCase()) || 
                  detail.codigo.includes(filter);
                
                const matchesStatus = statusFilter === 'all' || detail.status === statusFilter;
                
                return matchesSearch && matchesStatus;
              })}
              getStatusBadge={getStatusBadge}
              getRoleBadge={getRoleBadge}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface ComparisonTableProps {
  details: ComparisonDetail[];
  getStatusBadge: (status: string) => React.ReactNode;
  getRoleBadge: (role: string) => React.ReactNode;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ details, getStatusBadge, getRoleBadge }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead className="w-[30%]">Procedimento</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead className="text-right">Valor CBHPM</TableHead>
            <TableHead className="text-right">Valor Pago</TableHead>
            <TableHead className="text-right">Diferença</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.length > 0 ? (
            details.map((detail) => (
              <TableRow key={detail.id} className={
                detail.status === 'não_pago' ? 'bg-red-100/50 dark:bg-red-950/20' : 
                detail.status === 'abaixo' ? 'bg-amber-100/50 dark:bg-amber-950/20' : 
                ''
              }>
                <TableCell className="font-medium">{detail.codigo}</TableCell>
                <TableCell>{detail.descricao}</TableCell>
                <TableCell>{getRoleBadge(detail.papel)}</TableCell>
                <TableCell className="text-right">R$ {detail.valorCbhpm.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {detail.status === 'não_pago' 
                    ? '-' 
                    : `R$ ${detail.valorPago.toFixed(2)}`
                  }
                </TableCell>
                <TableCell className="text-right">
                  {detail.status === 'não_pago' 
                    ? '-' 
                    : detail.status === 'conforme' 
                      ? '0,00'
                      : <span className={detail.status === 'abaixo' ? 'text-red-500' : 'text-blue-500'}>
                          {detail.status === 'abaixo' ? '-' : '+'} R$ {Math.abs(detail.diferenca).toFixed(2)}
                        </span>
                  }
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(detail.status)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum procedimento encontrado com os filtros atuais.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CBHPMComparisonTable;
