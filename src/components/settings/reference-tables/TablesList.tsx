
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { ReferenceTable } from './types';

interface TablesListProps {
  tables: ReferenceTable[];
  selectedTables: string[];
  onToggle: (id: string, selected: boolean) => void;
  disabled: boolean;
}

/**
 * TablesList Component
 * 
 * Displays a list of reference tables that the user can toggle on/off for payment
 * analysis. Tables are presented in a structured format with name, description,
 * and toggle controls.
 * 
 * @param tables - Array of reference tables with their status
 * @param selectedTables - List of selected table IDs
 * @param onToggle - Function to handle toggling a table's status
 * @param disabled - Whether the switches are disabled (during saving operations)
 */
export const TablesList = ({ tables, selectedTables, onToggle, disabled }: TablesListProps) => {
  return (
    <div>
      {tables.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma tabela de referência encontrada
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Tabela</TableHead>
              <TableHead className="hidden md:table-cell">Descrição</TableHead>
              <TableHead className="w-[100px] text-right">Ativo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map(table => (
              <TableRow key={table.id} className="hover:bg-secondary/20">
                <TableCell className="font-medium">{table.name}</TableCell>
                <TableCell className="hidden md:table-cell">{table.description || "-"}</TableCell>
                <TableCell className="text-right">
                  <Switch 
                    checked={selectedTables.includes(table.id)} 
                    onCheckedChange={(checked) => onToggle(table.id, checked)}
                    disabled={disabled}
                    aria-label={`Ativar ou desativar tabela ${table.name}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
