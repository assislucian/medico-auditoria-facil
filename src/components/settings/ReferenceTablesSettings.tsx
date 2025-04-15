
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReferenceTable {
  id: string;
  name: string;
  description?: string;
  category: 'table' | 'role';
  checked: boolean;
}

export const ReferenceTablesSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tables, setTables] = useState<ReferenceTable[]>([]);
  const [roles, setRoles] = useState<ReferenceTable[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('reference_tables_preferences')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data?.reference_tables_preferences) {
          const prefs = data.reference_tables_preferences;
          if (prefs.tables) setTables(prefs.tables);
          if (prefs.roles) setRoles(prefs.roles);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
        toast.error('Erro ao carregar preferências das tabelas');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user?.id]);
  
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
  
  const handleTableToggle = (id: string) => {
    setTables(prev => prev.map(table => 
      table.id === id ? { ...table, checked: !table.checked } : table
    ));
  };
  
  const handleRoleToggle = (id: string) => {
    setRoles(prev => prev.map(role => 
      role.id === id ? { ...role, checked: !role.checked } : role
    ));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          reference_tables_preferences: {
            tables,
            roles
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Preferências das tabelas atualizadas');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Erro ao salvar preferências das tabelas');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                        disabled={saving}
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
                  disabled={saving}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </div>
  );
};
