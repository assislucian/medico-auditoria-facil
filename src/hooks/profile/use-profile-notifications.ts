
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/utils/supabaseHelpers";

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

export const useProfileNotifications = () => {
  const [loading, setLoading] = useState(false);

  const updateNotificationPreferences = async (preferences: NotificationPreferences): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Não autenticado');
      }
      
      const profileData = await getProfile(supabase, session.user.id);
      
      const currentNotificationPrefs = profileData && 
        profileData.notification_preferences
        ? profileData.notification_preferences 
        : {};
      
      const prefJson = {
        ...currentNotificationPrefs,
        email: preferences.email,
        sms: preferences.sms
      };
      
      const success = await updateProfile(supabase, session.user.id, {
        notification_preferences: prefJson as Json
      });
      
      if (!success) {
        throw new Error('Erro ao atualizar preferências');
      }
      
      toast.success("Preferências atualizadas", {
        description: "Suas preferências de notificação foram atualizadas com sucesso."
      });
      
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar preferências", {
        description: "Não foi possível atualizar suas preferências. Tente novamente."
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateNotificationPreferences
  };
};
