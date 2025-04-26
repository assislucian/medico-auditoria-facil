
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
}

export function DataGrid({
  rows,
  columns,
  pageSize = 10,
  className = "",
}: DataGridProps) {
  // Make sure rows is always an array, even if undefined is passed
  const safeRows = Array.isArray(rows) ? rows : [];
  
  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.field}
                style={{
                  width: column.width,
                  flex: column.flex
                }}
              >
                {column.headerName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeRows.slice(0, pageSize).map((row, rowIndex) => (
            <TableRow key={row?.id || rowIndex}>
              {columns.map((column) => (
                <TableCell key={`${row?.id || rowIndex}-${column.field}`}>
                  {column.renderCell ? (
                    column.renderCell({ value: row?.[column.field], row })
                  ) : column.valueFormatter ? (
                    column.valueFormatter({ value: row?.[column.field] })
                  ) : (
                    row?.[column.field]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
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
          disabled={true}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={true}
        >
          Próximo
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
