
import React, { useState, useMemo } from 'react';
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
import { CheckCircle, XCircle, AlertCircle, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  // Sort and filter logic
  const filteredDetails = useMemo(() => {
    let result = [...details];
    
    // Apply text search filter
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      result = result.filter(detail => 
        detail.descricao.toLowerCase().includes(lowerFilter) || 
        detail.codigo.includes(filter)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(detail => detail.status === statusFilter);
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(detail => detail.papel === roleFilter);
    }
    
    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let aValue = a[sortField as keyof ComparisonDetail];
        let bValue = b[sortField as keyof ComparisonDetail];
        
        // Handle string comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Handle number comparison
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
    }
    
    return result;
  }, [details, filter, statusFilter, roleFilter, sortField, sortDirection]);

  // Calculate filtered summary
  const filteredSummary = useMemo(() => {
    return filteredDetails.reduce((acc, detail) => {
      acc.total++;
      if (detail.status === 'conforme') acc.conforme++;
      else if (detail.status === 'abaixo') acc.abaixo++;
      else if (detail.status === 'acima') acc.acima++;
      return acc;
    }, { total: 0, conforme: 0, abaixo: 0, acima: 0 });
  }, [filteredDetails]);

  // Handler for sort toggling
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortDirection === 'asc' 
      ? <ArrowUpDown className="h-3 w-3 ml-1 text-primary" /> 
      : <ArrowUpDown className="h-3 w-3 ml-1 text-primary rotate-180" />;
  };

  // Check if any filter is active
  const filterActive = filter !== '' || statusFilter !== 'all' || roleFilter !== 'all';

  // Reset all filters
  const resetFilters = () => {
    setFilter('');
    setStatusFilter('all');
    setRoleFilter('all');
    setSortField(null);
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

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
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
              <Filter className="h-4 w-4 mr-2" />
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

      <div className="flex flex-wrap gap-2 text-sm">
        <Badge variant="outline" className="bg-secondary/20">
          Exibindo {filteredDetails.length} de {details.length} procedimentos
        </Badge>
        {filterActive && (
          <Badge variant="outline" className="bg-primary/10 cursor-pointer" onClick={() => resetFilters()}>
            Limpar filtros
          </Badge>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-2 flex overflow-auto">
          <TabsTrigger value="all">
            Todos ({filteredSummary.total})
          </TabsTrigger>
          {roles.map(role => {
            // Count filtered items for this role
            const count = filteredDetails.filter(detail => detail.papel === role).length;
            return (
              <TabsTrigger key={role} value={role}>
                {role} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <TabsContent value="all">
          <ComparisonTable 
            details={filteredDetails}
            getStatusBadge={getStatusBadge}
            getRoleBadge={getRoleBadge}
            toggleSort={toggleSort}
            sortField={sortField}
            getSortIcon={getSortIcon}
          />
        </TabsContent>
        
        {roles.map(role => {
          const roleDetails = filteredDetails.filter(detail => detail.papel === role);
          return (
            <TabsContent key={role} value={role}>
              <ComparisonTable 
                details={roleDetails}
                getStatusBadge={getStatusBadge}
                getRoleBadge={getRoleBadge}
                toggleSort={toggleSort}
                sortField={sortField}
                getSortIcon={getSortIcon}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

interface ComparisonTableProps {
  details: ComparisonDetail[];
  getStatusBadge: (status: string) => React.ReactNode;
  getRoleBadge: (role: string) => React.ReactNode;
  toggleSort: (field: string) => void;
  sortField: string | null;
  getSortIcon: (field: string) => React.ReactNode;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  details, 
  getStatusBadge, 
  getRoleBadge,
  toggleSort,
  sortField,
  getSortIcon
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('codigo')}>
              <div className="flex items-center">
                Código {getSortIcon('codigo')}
              </div>
            </TableHead>
            <TableHead className="w-[30%] cursor-pointer" onClick={() => toggleSort('descricao')}>
              <div className="flex items-center">
                Procedimento {getSortIcon('descricao')}
              </div>
            </TableHead>
            <TableHead>Papel</TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('valorCbhpm')}>
              <div className="flex items-center justify-end">
                Valor CBHPM {getSortIcon('valorCbhpm')}
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('valorPago')}>
              <div className="flex items-center justify-end">
                Valor Pago {getSortIcon('valorPago')}
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('diferenca')}>
              <div className="flex items-center justify-end">
                Diferença {getSortIcon('diferenca')}
              </div>
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => toggleSort('status')}>
              <div className="flex items-center justify-center">
                Status {getSortIcon('status')}
              </div>
            </TableHead>
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
