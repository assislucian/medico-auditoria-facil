
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { toast } from "sonner";
import { getProfile, updateProfile as updateProfileHelper } from "@/utils/supabaseHelpers";
import { useProfileAvatar } from "./use-profile-avatar";
import { Json } from '@/integrations/supabase/types';

// Define the ProfileData interface that was missing
interface ProfileData {
  name: string;
  email: string;
  especialidade?: string;
  [key: string]: any; // To allow for additional properties
}

export const useProfileData = () => {
  const [loading, setLoading] = useState(false);
  const { uploadAvatar } = useProfileAvatar();

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
        avatarUrl = await uploadAvatar(avatarFile);
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
      
      // Fix the call to updateProfileHelper with correct arguments
      const success = await updateProfileHelper(supabase, session.user.id, {
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
