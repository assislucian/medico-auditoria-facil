
/**
 * HistorySearch.tsx
 * 
 * Componente de busca e filtros para o histórico de análises.
 * Oferece funcionalidades de busca textual, filtro por status e período.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Download, RefreshCw, Search, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "../ui/card";

interface HistorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
  onExport: () => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onRefresh?: () => void;
}

/**
 * Componente de pesquisa e filtros para o histórico
 */
export function HistorySearch({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  onExport,
  dateRange,
  onDateRangeChange,
  onRefresh,
}: HistorySearchProps) {
  const [dateOpen, setDateOpen] = useState(false);
  
  /**
   * Limpa todos os filtros
   */
  const handleClearFilters = () => {
    onSearchChange("");
    onFilterChange("todos");
    onDateRangeChange(undefined);
  };
  
  /**
   * Manipulador para recarregar os dados
   */
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Campo de busca */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição ou hospital..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 bg-background"
            />
            {searchTerm && (
              <button
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => onSearchChange("")}
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filtro de status */}
          <Select value={filterStatus} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Analisado">Analisado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Seletor de período */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal bg-background",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Selecione um período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  onDateRangeChange(range);
                  setDateOpen(false);
                }}
                numberOfMonths={2}
              />
              <div className="flex items-center justify-between p-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onDateRangeChange(undefined);
                    setDateOpen(false);
                  }}
                >
                  Limpar
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setDateOpen(false);
                  }}
                >
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Botões de ação */}
          <div className="flex gap-2">
            {/* Botão para limpar filtros (só aparece se algum filtro estiver ativo) */}
            {(!!searchTerm || filterStatus !== "todos" || !!dateRange) && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="px-3"
              >
                <X className="h-4 w-4 mr-1" /> Limpar filtros
              </Button>
            )}
            
            {/* Botão para recarregar dados */}
            <Button
              variant="ghost"
              onClick={handleRefresh}
              className="px-3"
              title="Recarregar dados"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Botão de exportação */}
            <Button variant="outline" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
