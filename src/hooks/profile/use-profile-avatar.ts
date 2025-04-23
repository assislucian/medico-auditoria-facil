
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/utils/supabaseHelpers";

export const useProfileAvatar = () => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };

  return {
    loading,
    avatarUrl,
    uploadAvatar
  };
};
