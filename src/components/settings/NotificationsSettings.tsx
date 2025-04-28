import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Json } from '@/integrations/supabase/types';
import { Profile, ProfileWithUUID } from '@/types';
import { getProfile, updateProfile, toJson } from "@/utils/supabase";

interface NotificationPreferences {
  email: {
    newReports: boolean;
    systemUpdates: boolean;
    tips: boolean;
    newsletter: boolean;
  };
  sms: {
    criticalAlerts: boolean;
    paymentRecovery: boolean;
    invoiceReminders: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
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
};

export const NotificationsSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>(defaultPreferences);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const profileData = await getProfile(supabase, user.id);
        
        if (profileData && profileData.notification_preferences) {
          // Type assertion to fix the type error
          const prefs = profileData.notification_preferences as any;
          if (prefs.email && prefs.sms) {
            setNotifications(prefs as NotificationPreferences);
          }
        }
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
        toast.error('Erro ao carregar preferências de notificação');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user?.id]);

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
    if (!user?.id) return;
    
    setSaving(true);
    try {
      const success = await updateProfile(supabase, user.id, {
        notification_preferences: toJson(notifications),
        updated_at: new Date().toISOString()
      });

      if (!success) throw new Error("Erro ao atualizar o perfil");
      
      toast.success('Preferências de notificação atualizadas');
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error('Erro ao salvar preferências de notificação');
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
                disabled={saving}
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
                disabled={saving}
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
                checked={notifications.email.tips} 
                onCheckedChange={(checked) => handleToggleChange('email', 'tips', checked)}
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                checked={notifications.sms.invoiceReminders} 
                onCheckedChange={(checked) => handleToggleChange('sms', 'invoiceReminders', checked)}
                disabled={saving}
              />
            </div>
          </div>
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
      </CardContent>
    </Card>
  );
};
