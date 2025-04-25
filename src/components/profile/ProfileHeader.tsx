
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { useState } from "react";
import { ProfileAvatar } from "./avatar/ProfileAvatar";
import { ProfileStats } from "./stats/ProfileStats";
import { UserCog } from "lucide-react";

export const ProfileHeader = () => {
  const { fetchProfile } = useProfile();
  const [profile, setProfile] = useState({
    name: "Lucian",
    specialty: "Ortopedia",
    crm: "Não informado",
    avatarUrl: ""
  });

  const handleAvatarUpdate = (url: string) => {
    setProfile(prev => ({ ...prev, avatarUrl: url }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <UserCog className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold">Minha Conta</h1>
      </div>

      <Card className="p-6 bg-card hover:bg-accent/5 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ProfileAvatar 
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            onAvatarUpdate={handleAvatarUpdate}
          />

          <div className="text-center md:text-left flex-1">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground text-sm">{profile.specialty}</p>
              {profile.crm && (
                <p className="text-sm text-muted-foreground">CRM: {profile.crm}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                Ortopedia
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                Traumatologia
              </Badge>
              <Badge variant="outline" className="hover:bg-accent/5">
                Cirurgia
              </Badge>
            </div>
          </div>

          <ProfileStats analyses={127} recovered={12450} />
        </div>
      </Card>
    </div>
  );
};
