import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';
import { ProfileWithUUID } from "@/types";
import { updateProfile, getProfile } from "@/utils/supabaseHelpers";

interface ProfileSidebarProps {
  name: string;
  specialty: string;
  crm: string;
  avatarUrl?: string;
  onUpdateAvatar?: (file: File) => Promise<void>;
}

export const ProfileSidebar = ({ name, specialty, crm, avatarUrl, onUpdateAvatar }: ProfileSidebarProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle click on edit photo button
  const handleEditPhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido", {
        description: "Por favor, selecione uma imagem no formato JPG ou PNG"
      });
      return;
    }

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("Arquivo grande demais", {
        description: "A imagem deve ter no máximo 2MB"
      });
      return;
    }

    setUploading(true);
    try {
      if (onUpdateAvatar) {
        await onUpdateAvatar(file);
        toast.success("Foto atualizada", {
          description: "Sua foto de perfil foi atualizada com sucesso."
        });
      } else {
        // Direct upload implementation if no callback is provided
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          throw new Error("Usuário não autenticado");
        }

        const userId = sessionData.session.user.id;
        const filePath = `avatars/${userId}/profile-${Date.now()}`;
        
        // Check if the storage bucket exists and create it if needed
        try {
          const { data: buckets } = await supabase.storage.listBuckets();
          const profilesBucketExists = buckets?.some(b => b.name === 'profiles');
          
          if (!profilesBucketExists) {
            await supabase.storage.createBucket('profiles', {
              public: true
            });
          }
        } catch (bucketError) {
          console.error("Error checking/creating bucket:", bucketError);
        }
        
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
          
        // Get the current user profile
        const profileData = await getProfile(supabase, userId);
        
        if (!profileData) {
          throw new Error("Não foi possível recuperar o perfil do usuário");
        }
        
        // Ensure we have an object to work with
        const currentPreferences = profileData.notification_preferences 
          ? profileData.notification_preferences 
          : {};
        
        // Update the profile with new avatar_url
        const success = await updateProfile(supabase, userId, {
          notification_preferences: {
            ...(currentPreferences as object),
            avatar_url: urlData.publicUrl
          } as Json
        });

        if (!success) {
          throw new Error("Não foi possível atualizar o perfil");
        }

        toast.success("Foto atualizada", {
          description: "Sua foto de perfil foi atualizada com sucesso."
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Erro ao atualizar foto", {
        description: "Não foi possível atualizar sua foto. Tente novamente."
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="mb-6 relative inline-block">
          <Avatar className="w-24 h-24 mx-auto">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} />
            ) : (
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            )}
          </Avatar>
          {uploading && (
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-muted-foreground">{specialty}</p>
        <p className="text-sm mt-1">CRM: {crm}</p>
        
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">Ortopedia</Badge>
          <Badge variant="secondary">Traumatologia</Badge>
          <Badge variant="outline">Cirurgia</Badge>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">127</p>
              <p className="text-sm text-muted-foreground">Análises</p>
            </div>
            <div>
              <p className="text-2xl font-bold">R$ 12.450</p>
              <p className="text-sm text-muted-foreground">Recuperados</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleEditPhotoClick}
            disabled={uploading}
          >
            {uploading ? "Enviando..." : "Editar Foto"}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};
