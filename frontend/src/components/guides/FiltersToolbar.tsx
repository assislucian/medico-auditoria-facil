import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { XCircle, FilePlus } from "lucide-react";
import React from "react";

interface FiltersToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  date: string;
  onDateChange: (date: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  pendingCount?: number;
  onClear: () => void;
  onExportCsv: () => void;
  onExportProcedures: () => void;
  onNewGuide: () => void;
}

export function FiltersToolbar({
  search, onSearch,
  date, onDateChange,
  status, onStatusChange,
  pendingCount = 0,
  onClear, onExportCsv, onExportProcedures, onNewGuide
}: FiltersToolbarProps) {
  const hasFilters = !!search || status !== "ALL" || date;
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 flex-wrap toolbar-surface">
      {/* --- Filtros --- */}
      <fieldset role="search" className="flex flex-wrap items-end gap-2">
        <label htmlFor="search" className="sr-only">Buscar por número ou beneficiário</label>
        <Input
          id="search"
          placeholder="Buscar nº ou beneficiário"
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-60"
        />
        <label htmlFor="date" className="sr-only">Filtrar por data</label>
        <input
          id="date"
          type="date"
          value={date ?? ""}
          onChange={e => onDateChange(e.target.value)}
          className="input w-36"
        />
        <label htmlFor="status" className="sr-only">Filtrar por status</label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-36">
            {status === "ALL" ? "Todos Status" : "Status"}
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pendingCount}
              </Badge>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos Status</SelectItem>
            <SelectItem value="PENDING_UPLOAD">Pendentes</SelectItem>
            <SelectItem value="PROCESSED">Processadas</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="link" size="sm" onClick={onClear} disabled={!hasFilters}>
          <XCircle className="size-4 mr-1" /> Limpar
        </Button>
      </fieldset>
      {/* --- Ações --- */}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={onExportCsv}>Exportar CSV</Button>
        <Button variant="secondary" onClick={onExportProcedures}>Exportar Proced.</Button>
        <Button onClick={onNewGuide}>
          <FilePlus className="size-4 mr-1" /> Nova Guia
        </Button>
      </div>
    </div>
  );
} 