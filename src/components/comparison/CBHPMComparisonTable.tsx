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
import CBHPMComparisonTableFilters from "./CBHPMComparisonTableFilters";
import CBHPMComparisonTabs from "./CBHPMComparisonTabs";

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
  const [filter, setFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [roleFilter, setRoleFilter] = React.useState('all');
  const [sortField, setSortField] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

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
  const filteredDetails = React.useMemo(() => {
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
  const filteredSummary = React.useMemo(() => {
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
      <CBHPMComparisonTableFilters
        filter={filter}
        setFilter={setFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        roles={roles}
        filterActive={filterActive}
        resetFilters={resetFilters}
        detailsLength={details.length}
        filteredLength={filteredDetails.length}
      />
      <CBHPMComparisonTabs
        roles={roles}
        filteredDetails={filteredDetails}
        getStatusBadge={getStatusBadge}
        getRoleBadge={getRoleBadge}
        toggleSort={toggleSort}
        sortField={sortField}
        getSortIcon={getSortIcon}
        filter={filter}
        filteredSummary={filteredSummary}
      />
    </div>
  );
};

export default CBHPMComparisonTable;
