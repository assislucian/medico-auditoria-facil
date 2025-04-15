
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export const NotificationsSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    notificacoesEmail: true,
    notificacoesSMS: false
  });

  const handleToggleChange = (name: string, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Configurações salvas",
      description: "Suas alterações foram salvas com sucesso."
    });
    
    setSaving(false);
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
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notificações por Email</p>
            <p className="text-sm text-muted-foreground">
              Receba alertas sobre novos relatórios por email
            </p>
          </div>
          <Switch 
            checked={notifications.notificacoesEmail} 
            onCheckedChange={(checked) => handleToggleChange('notificacoesEmail', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notificações por SMS</p>
            <p className="text-sm text-muted-foreground">
              Receba alertas sobre novos relatórios por SMS
            </p>
          </div>
          <Switch 
            checked={notifications.notificacoesSMS} 
            onCheckedChange={(checked) => handleToggleChange('notificacoesSMS', checked)}
          />
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
