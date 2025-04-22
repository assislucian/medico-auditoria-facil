import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { RolesList } from './reference-tables/RolesList';
import { TablesList } from './reference-tables/TablesList';
import { referenceTables } from "@/data/referenceTables";
import { Json } from '@/integrations/supabase/types';
import { ProfileWithUUID } from '@/types';
import { 
  ReferenceTablesPreferences, 
  defaultReferenceTablesPreferences,
  parseReferenceTablesPreferences,
  referenceTablesPreferencesToJson 
} from './reference-tables/types';

/**
 * ReferenceTablesSettings Component
 * 
 * This component allows users to manage their reference tables preferences
 * for both roles and pricing tables. It fetches current preferences from
 * the database and handles updates via the Supabase client.
 */
export const ReferenceTablesSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tables, setTables] = useState<string[]>(defaultReferenceTablesPreferences.tables);
  const [roles, setRoles] = useState<string[]>(defaultReferenceTablesPreferences.roles);

  // Fetch user's reference tables preferences on component mount
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
        
        // Parse and set reference tables preferences using helper function
        if (data?.reference_tables_preferences) {
          const prefs = parseReferenceTablesPreferences(data.reference_tables_preferences);
          setTables(prefs.tables);
          setRoles(prefs.roles);
        }
      } catch (error) {
        console.error('Error fetching reference tables preferences:', error);
        toast.error('Erro ao carregar preferências de tabelas de referência');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user?.id]);

  // Handle toggle changes for table selections
  const handleTableToggle = (tableId: string, selected: boolean) => {
    if (selected) {
      setTables(prev => [...prev, tableId]);
    } else {
      setTables(prev => prev.filter(id => id !== tableId));
    }
  };

  // Handle toggle changes for role selections
  const handleRoleToggle = (roleId: string, selected: boolean) => {
    if (selected) {
      setRoles(prev => [...prev, roleId]);
    } else {
      setRoles(prev => prev.filter(id => id !== roleId));
    }
  };

  // Save updated reference tables preferences to the database
  const handleSubmit = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const preferences: ReferenceTablesPreferences = { tables, roles };
      const updateData = {
        reference_tables_preferences: referenceTablesPreferencesToJson(preferences) as Json,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Preferências de tabelas atualizadas');
    } catch (error) {
      console.error('Error saving reference tables preferences:', error);
      toast.error('Erro ao salvar preferências de tabelas');
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
      <div>
        <h3 className="text-xl font-medium">Tabelas de Preços</h3>
        <p className="text-sm text-muted-foreground">
          Selecione as tabelas de preços que você deseja usar como referência para análises de pagamentos.
        </p>
        <TablesList 
          tables={referenceTables.pricingTables}
          selectedTables={tables}
          onToggle={handleTableToggle}
          disabled={saving}
        />
      </div>
      
      <div>
        <h3 className="text-xl font-medium">Funções</h3>
        <p className="text-sm text-muted-foreground">
          Selecione as funções que você deseja usar como referência para análises de pagamentos.
        </p>
        <RolesList 
          roles={referenceTables.roles}
          selectedRoles={roles}
          onToggle={handleRoleToggle}
          disabled={saving}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Preferências'
          )}
        </Button>
      </div>
    </div>
  );
};
