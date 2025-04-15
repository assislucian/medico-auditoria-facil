
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/use-profile";

export const NotificationsSettings = () => {
  const { loading, updateNotificationPreferences } = useProfile();
  const [notifications, setNotifications] = useState({
    email: {
      newReports: true,
      systemUpdates: true,
      tips: false,
      newsletter: false
    },
    sms: {
      criticalAlerts: true,
      paymentRecovery: false,
      invoiceReminders: false
    }
  });

  const handleToggleChange = (category: 'email' | 'sms', name: string, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: checked
      }
    }));
  };

  const handleSubmit = async () => {
    await updateNotificationPreferences(notifications);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>
          Configure como você deseja receber notificações do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                checked={notifications.email.newReports} 
                onCheckedChange={(checked) => handleToggleChange('email', 'newReports', checked)}
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
                checked={notifications.email.systemUpdates} 
                onCheckedChange={(checked) => handleToggleChange('email', 'systemUpdates', checked)}
              />
            </div>
          </div>
        </div>
        
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
                checked={notifications.sms.criticalAlerts} 
                onCheckedChange={(checked) => handleToggleChange('sms', 'criticalAlerts', checked)}
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
                checked={notifications.sms.paymentRecovery} 
                onCheckedChange={(checked) => handleToggleChange('sms', 'paymentRecovery', checked)}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Preferências"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
