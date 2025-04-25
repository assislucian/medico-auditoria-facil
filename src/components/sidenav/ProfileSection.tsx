
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  profileData: {
    name: string;
    avatarUrl: string;
  };
  className?: string;
}

export function ProfileSection({ profileData, className }: ProfileSectionProps) {
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
      <div className="flex items-center gap-3 p-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
          <AvatarFallback>{getInitials(profileData.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{profileData.name}</p>
          <Button variant="outline" size="sm" className="mt-1 w-full" asChild>
            <Link to="/profile">Ver perfil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
