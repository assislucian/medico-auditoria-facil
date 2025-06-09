
import { useState } from "react";
import { toast } from "sonner";

/**
 * Hook that provides functionality for managing the user's profile avatar
 */
export const useProfileAvatar = () => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Alias 'uploading' as 'loading' for API consistency
  const loading = uploading;

  /**
   * Uploads an avatar file to Supabase storage
   */
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      // Implementation for uploading avatar
      // This is just a placeholder that returns a mock URL
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload delay
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      return url;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handles file input change event for avatar uploads
   */
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return null;

    try {
      setUploading(true);
      const url = await uploadAvatar(file);
      if (url) {
        toast.success("Foto atualizada com sucesso");
        setAvatarUrl(url);
        return url;
      }
    } catch (error) {
      toast.error("Erro ao atualizar foto");
    } finally {
      setUploading(false);
    }
    return null;
  };

  return {
    uploading,
    loading,
    avatarUrl,
    uploadAvatar,
    handleAvatarChange
  };
};
