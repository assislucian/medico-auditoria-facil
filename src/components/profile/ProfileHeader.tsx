
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { useState } from "react";
import { ProfileAvatar } from "./avatar/ProfileAvatar";
import { ProfileStats } from "./stats/ProfileStats";

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
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <ProfileAvatar 
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          onAvatarUpdate={handleAvatarUpdate}
        />

        <div className="text-center md:text-left flex-1">
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.specialty}</p>
            {profile.crm && (
              <p className="text-sm">CRM: {profile.crm}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
            <Badge variant="secondary">Ortopedia</Badge>
            <Badge variant="secondary">Traumatologia</Badge>
            <Badge variant="outline">Cirurgia</Badge>
          </div>
        </div>

        <ProfileStats analyses={127} recovered={12450} />
      </div>
    </Card>
  );
};
