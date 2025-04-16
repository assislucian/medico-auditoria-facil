
import { Switch } from '@/components/ui/switch';
import { ReferenceTable } from './types';

interface RolesListProps {
  roles: ReferenceTable[];
  onToggle: (id: string) => void;
  disabled: boolean;
}

/**
 * RolesList Component
 * 
 * Displays a list of medical roles that the user can toggle on/off
 * 
 * @param roles - Array of medical roles
 * @param onToggle - Function to handle toggling a role
 * @param disabled - Whether the switches are disabled
 */
export const RolesList = ({ roles, onToggle, disabled }: RolesListProps) => {
  return (
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
            onCheckedChange={() => onToggle(role.id)}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
};
