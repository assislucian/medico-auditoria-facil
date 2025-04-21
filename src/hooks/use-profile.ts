
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateCRM, formatCRM } from '@/utils/formatters';
import { toast } from "sonner";

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
  const { toast: legacyToast } = useToast();
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
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
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
      
      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email,
          phone: data.telefone,
          specialty: data.especialidade,
          hospital: data.hospital,
          bio: data.bio,
          ...(avatarUrl ? { avatar_url: avatarUrl } : {})
        })
        .eq('id', session.user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      if (avatarUrl) {
        setAvatarUrl(avatarUrl);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
        variant: "destructive"
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
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso."
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro ao atualizar senha",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar sua senha",
        variant: "destructive"
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
      
      // Convert preferences to a JSON object for storage
      const prefJson = {
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
          notification_preferences: prefJson
        })
        .eq('id', session.user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram atualizadas com sucesso."
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro ao atualizar preferências",
        description: "Não foi possível atualizar suas preferências. Tente novamente.",
        variant: "destructive"
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
    updateSecurity,
    updateNotificationPreferences
  };
};
