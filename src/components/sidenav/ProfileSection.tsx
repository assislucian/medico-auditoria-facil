
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProfileSectionProps {
  profileData: {
    name: string;
    specialty: string;
    crm: string;
    avatarUrl: string;
  };
}

export function ProfileSection({ profileData }: ProfileSectionProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="px-3 py-2">
      <div className="flex flex-col items-center mb-6 p-2">
        <Avatar className="h-16 w-16 mb-2">
          <AvatarImage src={profileData.avatarUrl} alt="Avatar" />
          <AvatarFallback>{getInitials(profileData.name)}</AvatarFallback>
        </Avatar>
        <h3 className="font-medium">{profileData.name}</h3>
        {profileData.specialty && (
          <p className="text-xs text-muted-foreground">{profileData.specialty}</p>
        )}
        {profileData.crm && (
          <p className="text-xs text-muted-foreground">CRM {profileData.crm}</p>
        )}
        <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
          <Link to="/profile">Ver perfil</Link>
        </Button>
      </div>
    </div>
  );
}
