
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

interface ProfileSectionProps {
  profileData: {
    name: string;
    avatarUrl: string;
  };
  className?: string;
}

export function ProfileSection({ profileData, className }: ProfileSectionProps) {
  const { user } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={cn("px-3 py-2", className)}>
      <Link to="/profile" className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-lg transition-colors">
        <Avatar className="h-10 w-10 border border-muted">
          {profileData.avatarUrl ? (
            <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{profileData.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || "Configure seu perfil"}
          </p>
        </div>
      </Link>
    </div>
  );
}
