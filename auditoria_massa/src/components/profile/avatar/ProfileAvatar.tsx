
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileAvatar } from "@/hooks/profile/use-profile-avatar";
import { Camera, User } from "lucide-react";
import { useState } from "react";
import { useAlert } from "@/utils/alertUtils";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  name: string;
  avatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
}

export const ProfileAvatar = ({ 
  name, 
  avatarUrl, 
  onAvatarUpdate,
  size = 'md',
  editable = true
}: ProfileAvatarProps) => {
  const { uploading, handleAvatarChange } = useProfileAvatar();
  const [isHovering, setIsHovering] = useState(false);
  const { showSuccess, showError } = useAlert();

  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const url = await handleAvatarChange(event);
      if (url) {
        onAvatarUpdate(url);
        showSuccess(
          'Avatar atualizado',
          'Sua imagem de perfil foi atualizada com sucesso!'
        );
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showError(
        'Falha ao atualizar avatar',
        'Não foi possível atualizar sua imagem de perfil. Tente novamente.'
      );
    }
  };

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
    xl: 'h-24 w-24',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
    xl: 'h-8 w-8',
  };

  return (
    <div 
      className={cn(
        "relative", 
        editable ? "cursor-pointer group" : ""
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Avatar className={cn(sizeClasses[size], "border-2 border-muted")}>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(name) || <User className={iconSizes[size]} />}
          </AvatarFallback>
        )}
      </Avatar>
      
      {editable && (
        <label 
          htmlFor="avatar-upload"
          className={cn(
            "absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity duration-200",
            isHovering || uploading ? "opacity-100" : "opacity-0"
          )}
        >
          {uploading ? (
            <div className="h-8 w-8 border-2 border-t-white border-r-transparent border-b-white border-l-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="text-white" />
          )}
          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
};
