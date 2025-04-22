
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { medicalReferenceTables, medicalRoles } from '@/data/referenceTables';
import { TablesList } from './reference-tables/TablesList';
import { RolesList } from './reference-tables/RolesList';
import { 
  ReferenceTable, 
  ReferenceTablesPreferences,
  parseReferenceTablesPreferences,
  referenceTablesPreferencesToJson 
} from './reference-tables/types';

/**
 * ReferenceTablesSettings Component
 * 
 * Allows users to select which reference tables and medical roles
 * they want to use for payment analysis in the system.
 */
export const ReferenceTablesSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tables, setTables] = useState<ReferenceTable[]>(
    medicalReferenceTables.map(t => ({ ...t, checked: t.checked || false }))
  );
  const [roles, setRoles] = useState<ReferenceTable[]>(
    medicalRoles.map(r => ({ ...r, checked: false }))
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('reference_tables_preferences')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        // Parse preferences using helper function
        if (data?.reference_tables_preferences) {
          const prefs = parseReferenceTablesPreferences(data.reference_tables_preferences);
          
          if (prefs.tables && Array.isArray(prefs.tables)) {
            setTables(prev => prev.map(table => ({
              ...table,
              checked: prefs.tables.find(t => t.id === table.id)?.checked || false
            })));
          }
          
          if (prefs.roles && Array.isArray(prefs.roles)) {
            setRoles(prev => prev.map(role => ({
              ...role,
              checked: prefs.roles.find(r => r.id === role.id)?.checked || false
            })));
          }
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
  
  /**
   * Filters tables based on selected category
   * @returns Filtered array of tables
   */
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
  
  /**
   * Handles toggling a table's checked state
   */
  const handleTableToggle = (id: string) => {
    setTables(prev => prev.map(table => 
      table.id === id ? { ...table, checked: !table.checked } : table
    ));
  };
  
  /**
   * Handles toggling a role's checked state
   */
  const handleRoleToggle = (id: string) => {
    setRoles(prev => prev.map(role => 
      role.id === id ? { ...role, checked: !role.checked } : role
    ));
  };

  /**
   * Saves updated preferences to the database
   */
  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const preferences: ReferenceTablesPreferences = { tables, roles };
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          reference_tables_preferences: referenceTablesPreferencesToJson(preferences),
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

  // Show loading state
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
            <TablesList 
              tables={getFilteredTables()}
              onToggle={handleTableToggle}
              disabled={saving}
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecione os papéis médicos que você deseja incluir nas análises de pagamentos.
          </p>
          <RolesList 
            roles={roles}
            onToggle={handleRoleToggle}
            disabled={saving}
          />
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
