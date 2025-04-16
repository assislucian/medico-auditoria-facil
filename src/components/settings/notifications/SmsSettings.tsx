
import { Switch } from "@/components/ui/switch";
import { SmsPreferences } from "./types";

interface SmsSettingsProps {
  preferences: SmsPreferences;
  onChange: (name: string, checked: boolean) => void;
  disabled: boolean;
}

export const SmsSettings = ({ preferences, onChange, disabled }: SmsSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Notificações por SMS</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Alertas Críticos</p>
            <p className="text-sm text-muted-foreground">
              Receba alertas importantes por SMS
            </p>
          </div>
          <Switch 
            checked={preferences.criticalAlerts} 
            onCheckedChange={(checked) => onChange('criticalAlerts', checked)}
            disabled={disabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Recuperação de Valores</p>
            <p className="text-sm text-muted-foreground">
              Notificações sobre valores recuperados
            </p>
          </div>
          <Switch 
            checked={preferences.paymentRecovery} 
            onCheckedChange={(checked) => onChange('paymentRecovery', checked)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Lembretes de Fatura</p>
            <p className="text-sm text-muted-foreground">
              Receba lembretes sobre faturas pendentes
            </p>
          </div>
          <Switch 
            checked={preferences.invoiceReminders} 
            onCheckedChange={(checked) => onChange('invoiceReminders', checked)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
