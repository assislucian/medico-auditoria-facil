
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { ReferenceTable } from './types';

interface TablesListProps {
  tables: ReferenceTable[];
  onToggle: (id: string) => void;
  disabled: boolean;
}

/**
 * TablesList Component
 * 
 * Displays a list of reference tables that the user can toggle on/off
 * 
 * @param tables - Array of reference tables
 * @param onToggle - Function to handle toggling a table
 * @param disabled - Whether the switches are disabled
 */
export const TablesList = ({ tables, onToggle, disabled }: TablesListProps) => {
  return (
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
          <TableRow key={table.id}>
            <TableCell className="font-medium">{table.name}</TableCell>
            <TableCell className="hidden md:table-cell">{table.description || "-"}</TableCell>
            <TableCell className="text-right">
              <Switch 
                checked={table.checked} 
                onCheckedChange={() => onToggle(table.id)}
                disabled={disabled}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
