import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { validateCRM, formatCRM } from '@/utils/formatters';
import { toast } from "sonner";
import { Json } from '@/integrations/supabase/types';
import { Profile } from '@/types';

interface ProfileData {
  name: string;
  email: string;
  telefone: string;
  crm: string;
  especialidade: string;
  hospital: string;
  bio: string;
}

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

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

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Não autenticado');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single(); // Use single() when expecting the record to exist
        
      if (error) {
        throw error;
      }
      
      // Extract avatar URL from notification_preferences if it exists
      if (data && data.notification_preferences && 
          typeof data.notification_preferences === 'object') {
        const prefs = data.notification_preferences as any;
        if (prefs.avatar_url) {
          setAvatarUrl(prefs.avatar_url);
        }
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Upload avatar image to storage
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Não autenticado');
      }
      
      const userId = session.user.id;
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}/profile-${Date.now()}.${fileExt}`;
      
      // Check if the storage bucket exists and create it if needed
      const { data: buckets } = await supabase.storage.listBuckets();
      const profilesBucketExists = buckets?.some(b => b.name === 'profiles');
      
      if (!profilesBucketExists) {
        await supabase.storage.createBucket('profiles', {
          public: true
        });
      }
      
      // Upload the file to the bucket
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };

  const updateProfile = async (data: ProfileData, avatarFile?: File | null): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Não autenticado');
      }
      
      // Upload avatar if provided
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
        if (!avatarUrl) {
          throw new Error('Falha ao fazer upload da imagem');
        }
      }
      
      // Get current profile to merge with updated data
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', session.user.id)
        .single(); // Use single() when expecting the record to exist
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Ensure notification_preferences is an object before spreading
      const currentNotificationPrefs = currentProfile && 
        typeof currentProfile.notification_preferences === 'object' 
        ? currentProfile.notification_preferences || {} 
        : {};
      
      // Merge current notification preferences with avatar URL if available
      const updatedNotificationPrefs = {
        ...currentNotificationPrefs,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {})
      };
      
      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email,
          specialty: data.especialidade,
          notification_preferences: updatedNotificationPrefs as Json
        })
        .eq('id', session.user.id);
        
      if (error) {
        throw error;
      }
      
      toast.success("Perfil atualizado", {
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      if (avatarUrl) {
        setAvatarUrl(avatarUrl);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Erro ao atualizar", {
        description: "Não foi possível atualizar suas informações. Tente novamente."
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSecurity = async (data: SecurityData): Promise<boolean> => {
    setLoading(true);
    try {
      // Validate passwords match
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("As senhas não conferem");
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Senha atualizada", {
        description: "Sua senha foi atualizada com sucesso."
      });
      
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar senha", {
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar sua senha"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationPreferences = async (preferences: NotificationPreferences): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Não autenticado');
      }
      
      // Get current profile to preserve avatar URL if it exists
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', session.user.id)
        .single(); // Use single() when expecting the record to exist
        
      if (fetchError) {
        throw fetchError;
      }
      
      // Ensure notification_preferences is an object before spreading
      const currentNotificationPrefs = currentProfile && 
        typeof currentProfile.notification_preferences === 'object' 
        ? currentProfile.notification_preferences || {} 
        : {};
      
      // Convert preferences to a JSON object for storage while preserving avatar URL
      const prefJson = {
        ...currentNotificationPrefs,
        email: {
          newReports: preferences.email.newReports,
          systemUpdates: preferences.email.systemUpdates,
          tips: preferences.email.tips,
          newsletter: preferences.email.newsletter
        },
        sms: {
          criticalAlerts: preferences.sms.criticalAlerts,
          paymentRecovery: preferences.sms.paymentRecovery,
          invoiceReminders: preferences.sms.invoiceReminders
        }
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: prefJson as Json
        })
        .eq('id', session.user.id);
        
      if (error) {
        throw error;
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
    avatarUrl,
    fetchProfile,
    uploadAvatar,
    updateProfile,
    updateSecurity: async () => false,
    updateNotificationPreferences: async () => false
  };
};
