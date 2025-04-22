
import { Switch } from '@/components/ui/switch';
import { ReferenceTable } from './types';

interface RolesListProps {
  roles: ReferenceTable[];
  selectedRoles: string[];
  onToggle: (id: string, selected: boolean) => void;
  disabled: boolean;
}

/**
 * RolesList Component
 * 
 * Displays a list of medical roles that the user can toggle on/off to include in
 * payment analysis calculations. Each role has a name, description, and toggle switch.
 * 
 * @param roles - Array of medical roles with their status (enabled/disabled)
 * @param selectedRoles - List of selected role IDs
 * @param onToggle - Function to handle toggling a role's status
 * @param disabled - Whether the switches are disabled (during saving operations)
 */
export const RolesList = ({ roles, selectedRoles, onToggle, disabled }: RolesListProps) => {
  return (
    <div className="space-y-4">
      {roles.map(role => (
        <div key={role.id} className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/30 transition-colors">
          <div className="mr-4">
            <p className="font-medium">{role.name}</p>
            {role.description && (
              <p className="text-sm text-muted-foreground">{role.description}</p>
            )}
          </div>
          <Switch 
            checked={selectedRoles.includes(role.id)} 
            onCheckedChange={(checked) => onToggle(role.id, checked)}
            disabled={disabled}
            aria-label={`Toggle ${role.name} role`}
          />
        </div>
      ))}

      {roles.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          Nenhum papel médico disponível para seleção
        </p>
      )}
    </div>
  );
};
