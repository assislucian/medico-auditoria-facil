
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { toast } from "sonner";
import { getProfile } from "@/utils/supabaseHelpers";

export const useProfileData = () => {
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Não autenticado');
      }
      
      const profileData = await getProfile(supabase, session.user.id);
      return profileData as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await useProfileAvatar().uploadAvatar(avatarFile);
        if (!avatarUrl) {
          throw new Error('Falha ao fazer upload da imagem');
        }
      }
      
      const profileData = await getProfile(supabase, session.user.id);
      
      const currentNotificationPrefs = profileData && 
        profileData.notification_preferences 
        ? profileData.notification_preferences
        : {};
      
      const updatedNotificationPrefs = {
        ...currentNotificationPrefs,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {})
      };
      
      const success = await updateProfile(supabase, session.user.id, {
        name: data.name,
        email: data.email,
        specialty: data.especialidade,
        notification_preferences: updatedNotificationPrefs as Json
      });
      
      if (!success) {
        throw new Error('Erro ao atualizar o perfil');
      }
      
      toast.success("Perfil atualizado", {
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar", {
        description: "Não foi possível atualizar suas informações. Tente novamente."
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchProfile,
    updateProfile
  };
};
