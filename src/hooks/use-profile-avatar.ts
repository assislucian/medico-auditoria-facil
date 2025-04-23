
import { useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";

export const useProfileAvatar = () => {
  const { uploadAvatar } = useProfile();
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return null;

    try {
      setUploading(true);
      const url = await uploadAvatar(file);
      if (url) {
        toast.success("Foto atualizada com sucesso");
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
    handleAvatarChange
  };
};
