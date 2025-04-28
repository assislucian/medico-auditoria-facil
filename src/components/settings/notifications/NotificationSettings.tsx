
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Json } from '@/integrations/supabase/types';
import { EmailSettings } from './EmailSettings';
import { SmsSettings } from './SmsSettings';
import { 
  NotificationPreferences, 
  defaultNotificationPreferences,
  parseNotificationPreferences,
  notificationPreferencesToJson
} from "./types";
import { Profile, ProfileWithUUID } from '@/types';
import { getProfile, updateProfile, toJson } from "@/utils/supabase";
import { useAlert } from '@/utils/alertUtils';

/**
 * NotificationsSettings Component
 * 
 * This component allows users to manage their notification preferences
 * for both email and SMS channels. It fetches current preferences from
 * the database and handles updates via the Supabase client.
 */
export const NotificationSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const { showSuccess, showError } = useAlert();

  // Fetch user's notification preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const profileData = await getProfile(supabase, user.id);
        
        // Parse and set notification preferences using helper function
        if (profileData?.notification_preferences) {
          const prefs = parseNotificationPreferences(profileData.notification_preferences);
          setNotifications(prefs);
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

  // Handle toggle changes for notification preferences
  const handleToggleChange = (category: 'email' | 'sms', name: string, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: checked
      }
    }));
  };

  // Save updated notification preferences to the database
  const handleSubmit = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // Convert notification preferences to JSON format
      const preferencesJson = notificationPreferencesToJson(notifications);
      
      const success = await updateProfile(supabase, user.id, {
        notification_preferences: toJson(preferencesJson),
        updated_at: new Date().toISOString()
      });

      if (!success) {
        throw new Error("Não foi possível atualizar o perfil");
      }
      
      showSuccess(
        'Preferências salvas',
        'Suas preferências de notificação foram atualizadas com sucesso!'
      );
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      showError(
        'Erro ao salvar',
        'Não foi possível salvar suas preferências de notificação.'
      );
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
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>
          Configure como você deseja receber notificações do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EmailSettings 
          preferences={notifications.email}
          onChange={(name, checked) => handleToggleChange('email', name, checked)}
          disabled={saving}
        />
        
        <SmsSettings 
          preferences={notifications.sms}
          onChange={(name, checked) => handleToggleChange('sms', name, checked)}
          disabled={saving}
        />
        
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
