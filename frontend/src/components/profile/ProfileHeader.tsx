
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { ProfileAvatar } from "./avatar/ProfileAvatar";

export const ProfileHeader = () => {
  const { fetchProfile } = useProfile();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: "",
    specialty: "",
    crm: "",
    avatarUrl: "",
    email: user?.email || ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await fetchProfile();
      if (profileData) {
        const avatarUrl = profileData.notification_preferences 
          ? (profileData.notification_preferences as Record<string, any>)['avatar_url'] || ''
          : '';

        setProfile({
          name: profileData.name || "Usuário",
          specialty: profileData.specialty || "Não informado",
          crm: profileData.crm || "Não informado",
          avatarUrl: avatarUrl,
          email: profileData.email || user?.email || ""
        });
      }
    };
    
    loadProfile();
  }, [fetchProfile, user]);

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

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <Badge variant="outline" className="md:self-start">
                {profile.specialty}
              </Badge>
            </div>
            <p className="text-muted-foreground">{profile.email}</p>
            {profile.crm && (
              <p className="text-sm text-muted-foreground">CRM: {profile.crm}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {profile.specialty}
            </Badge>
            <Badge variant="outline">
              MedCheck Pro
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
