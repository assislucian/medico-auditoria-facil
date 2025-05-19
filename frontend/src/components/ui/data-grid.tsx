import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface DataGridProps {
  rows: any[];
  columns: {
    field: string;
    headerName: string;
    width?: number;
    flex?: number;
    type?: string;
    renderCell?: (params: any) => React.ReactNode;
    valueFormatter?: (params: any) => string;
  }[];
  pageSize?: number;
  rowsPerPageOptions?: number[];
  disableSelectionOnClick?: boolean;
  className?: string;
  renderExpandedRow?: (row: any) => React.ReactNode;
}

export function DataGrid({
  rows,
  columns,
  pageSize = 10,
  className = "",
  renderExpandedRow,
}: DataGridProps) {
  // Make sure rows is always an array, even if undefined is passed
  const safeRows = Array.isArray(rows) ? rows : [];
  
  // Função para obter o valor de uma célula com segurança
  const getCellValue = (row: any, field: string) => {
    if (!row) return null;
    return row[field] !== undefined ? row[field] : null;
  };
  
  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              let headerContent = column.headerName;
              if (["CBHPM", "Liberado", "Diferença", "Delta %"].includes(column.headerName)) {
                let tooltipText = '';
                if (column.headerName === "CBHPM") tooltipText = "Valor de referência da tabela CBHPM vigente.";
                if (column.headerName === "Liberado") tooltipText = "Valor efetivamente liberado pelo convênio.";
                if (column.headerName === "Diferença") tooltipText = "Diferença entre CBHPM e valor liberado.";
                if (column.headerName === "Delta %") tooltipText = "Percentual de diferença em relação ao CBHPM.";
                headerContent = (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 cursor-help">
                          {column.headerName}
                          <span className="text-xs text-blue-500 align-middle">ⓘ</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs text-sm">
                        {tooltipText}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }
              return (
                <TableHead
                  key={column.field}
                  style={{ width: column.width, flex: column.flex }}
                  className="text-center align-middle text-base font-semibold bg-neutral-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-gray-800 py-3 px-4 tracking-tight text-gray-700 dark:text-gray-200"
                >
                  {headerContent}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeRows.slice(0, pageSize).map((row, rowIndex) => [
            <TableRow
              key={row?.id || rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-blue-50/40 dark:hover:bg-blue-900/30 transition-colors'}
            >
              {columns.map((column) => {
                const cellValue = getCellValue(row, column.field);
                // Alinhamento condicional: numérico à direita, texto à esquerda
                const isNumeric = ["number", "currency", "percent"].includes(column.type) || /total|valor|quantidade|qtd|delta|percent|glosa|liberado|apresentado|cbhpm|diferença|procedimentos/i.test(column.field);
                return (
                  <TableCell
                    key={`${row?.id || rowIndex}-${column.field}`}
                    className={(isNumeric ? "text-right" : "text-left") + " align-middle py-3 px-4 text-base font-normal text-gray-800 dark:text-gray-100"}
                  >
                    {column.renderCell ? (
                      column.renderCell({ value: cellValue, row })
                    ) : column.valueFormatter ? (
                      column.valueFormatter({ value: cellValue })
                    ) : (
                      cellValue !== null && cellValue !== undefined ? cellValue : ''
                    )}
                  </TableCell>
                );
              })}
            </TableRow>,
            renderExpandedRow && renderExpandedRow(row)
          ])}
          {safeRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          disabled={safeRows.length <= pageSize}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={safeRows.length <= pageSize}
        >
          Próximo
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          th, td {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
            font-size: 0.92rem !important;
          }
        }
      `}</style>
    </div>
  );
}
