
/**
 * use-profile-avatar.ts
 * 
 * Custom hook para gerenciar o upload e atualização do avatar do usuário.
 * Lida com o armazenamento de imagens no Supabase Storage.
 */

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook que fornece funcionalidades para gerenciar o avatar do perfil do usuário
 * @returns Objeto com estados e funções para manipulação de avatar
 */
export const useProfileAvatar = () => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  /**
   * Faz upload de um arquivo de avatar para o armazenamento do Supabase
   * @param file Arquivo de imagem para upload
   * @returns URL pública do avatar ou null em caso de erro
   */
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      // Verifica se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Não autenticado');
      }
      
      const userId = session.user.id;
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}/profile-${Date.now()}.${fileExt}`;
      
      // Verifica se o bucket de armazenamento existe e cria se necessário
      const { data: buckets } = await supabase.storage.listBuckets();
      const profilesBucketExists = buckets?.some(b => b.name === 'profiles');
      
      if (!profilesBucketExists) {
        await supabase.storage.createBucket('profiles', {
          public: true
        });
      }
      
      // Faz upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Obtém a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };
  
  /**
   * Manipula a mudança de arquivo do input de avatar
   * @param event Evento de mudança do input
   * @returns URL do avatar ou null em caso de erro
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
    avatarUrl,
    uploadAvatar,
    handleAvatarChange
  };
};
