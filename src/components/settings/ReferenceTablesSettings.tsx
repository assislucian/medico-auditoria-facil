
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { medicalReferenceTables, medicalRoles, type ReferenceTable } from '@/data/referenceTables';

export const ReferenceTablesSettings = () => {
  const [tables, setTables] = useState(medicalReferenceTables);
  const [roles, setRoles] = useState(medicalRoles);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Helper function to filter tables by category
  const getFilteredTables = () => {
    if (filterCategory === 'all') return tables;
    if (filterCategory === 'tuss') return tables.filter(table => table.id.startsWith('tuss'));
    if (filterCategory === 'amb') return tables.filter(table => table.id.startsWith('amb'));
    if (filterCategory === 'sus') return tables.filter(table => table.id.startsWith('sus'));
    if (filterCategory === 'other') return tables.filter(table => 
      !table.id.startsWith('tuss') && 
      !table.id.startsWith('amb') && 
      !table.id.startsWith('sus')
    );
    return tables;
  };
  
  // Toggle table checked status
  const handleTableToggle = (id: string) => {
    setTables(prev => prev.map(table => 
      table.id === id ? { ...table, checked: !table.checked } : table
    ));
  };
  
  // Toggle role checked status
  const handleRoleToggle = (id: string) => {
    setRoles(prev => prev.map(role => 
      role.id === id ? { ...role, checked: !role.checked } : role
    ));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tables">Tabelas de Referência</TabsTrigger>
          <TabsTrigger value="roles">Papéis Médicos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables" className="space-y-4">
          <div className="my-4">
            <p className="text-sm text-muted-foreground mb-2">Filtrar por categoria:</p>
            <ToggleGroup 
              type="single" 
              value={filterCategory}
              onValueChange={(value) => value && setFilterCategory(value)}
              className="justify-start flex-wrap"
            >
              <ToggleGroupItem value="all">Todas</ToggleGroupItem>
              <ToggleGroupItem value="tuss">TUSS</ToggleGroupItem>
              <ToggleGroupItem value="amb">AMB</ToggleGroupItem>
              <ToggleGroupItem value="sus">SUS</ToggleGroupItem>
              <ToggleGroupItem value="other">Outras</ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Tabela</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead className="w-[100px] text-right">Ativo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredTables().map(table => (
                  <TableRow key={table.id}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{table.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Switch 
                        checked={table.checked} 
                        onCheckedChange={() => handleTableToggle(table.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecione os papéis médicos que você deseja incluir nas análises de pagamentos.
          </p>
          <div className="space-y-4">
            {roles.map(role => (
              <div key={role.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{role.name}</p>
                  {role.description && (
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  )}
                </div>
                <Switch 
                  checked={role.checked} 
                  onCheckedChange={() => handleRoleToggle(role.id)}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferenceTablesSettings;
