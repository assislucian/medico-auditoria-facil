
import { Switch } from "@/components/ui/switch";
import { EmailPreferences } from "./types";

interface EmailSettingsProps {
  preferences: EmailPreferences;
  onChange: (name: string, checked: boolean) => void;
  disabled: boolean;
}

export const EmailSettings = ({ preferences, onChange, disabled }: EmailSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Notificações por Email</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Novos Relatórios</p>
            <p className="text-sm text-muted-foreground">
              Receba alertas sobre novos relatórios por email
            </p>
          </div>
          <Switch 
            checked={preferences.newReports} 
            onCheckedChange={(checked) => onChange('newReports', checked)}
            disabled={disabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Atualizações do Sistema</p>
            <p className="text-sm text-muted-foreground">
              Seja notificado sobre atualizações importantes
            </p>
          </div>
          <Switch 
            checked={preferences.systemUpdates} 
            onCheckedChange={(checked) => onChange('systemUpdates', checked)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dicas e Novidades</p>
            <p className="text-sm text-muted-foreground">
              Receba dicas e melhores práticas
            </p>
          </div>
          <Switch 
            checked={preferences.tips} 
            onCheckedChange={(checked) => onChange('tips', checked)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
