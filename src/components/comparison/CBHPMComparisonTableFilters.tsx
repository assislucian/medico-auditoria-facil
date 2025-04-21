
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface FilterProps {
  filter: string;
  setFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  roles: string[];
  filterActive: boolean;
  resetFilters: () => void;
  detailsLength: number;
  filteredLength: number;
}
const CBHPMComparisonTableFilters: React.FC<FilterProps> = ({
  filter,
  setFilter,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  roles,
  filterActive,
  resetFilters,
  detailsLength,
  filteredLength
}) => (
  <div className="flex flex-col sm:flex-row justify-between gap-4">
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar por código ou descrição"
        value={filter}
        onChange={e => setFilter(e.target.value)}
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
    <div className="flex flex-wrap gap-2 text-sm">
      <Badge variant="outline" className="bg-secondary/20">
        Exibindo {filteredLength} de {detailsLength} procedimentos
      </Badge>
      {filterActive && (
        <Badge variant="outline" className="bg-primary/10 cursor-pointer" onClick={resetFilters}>
          Limpar filtros
        </Badge>
      )}
    </div>
  </div>
);
export default CBHPMComparisonTableFilters;
