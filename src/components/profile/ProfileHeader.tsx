
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { useState, useEffect } from "react";
import { ProfileAvatar } from "./avatar/ProfileAvatar";
import { ProfileStats } from "./stats/ProfileStats";
import { UserCog, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Json } from '@/integrations/supabase/types';

export const ProfileHeader = () => {
  const { fetchProfile } = useProfile();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: "Lucian",
    specialty: "Ortopedia",
    crm: "Não informado",
    avatarUrl: "",
    email: user?.email || ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await fetchProfile();
      if (profileData) {
        // Safely extract avatar URL using type guard
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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UserCog className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Minha Conta</h1>
        </div>
        <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar Perfil
        </Button>
      </div>

      <Card className="p-6 bg-card">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ProfileAvatar 
            name={profile.name}
            avatarUrl={profile.avatarUrl}
            onAvatarUpdate={handleAvatarUpdate}
          />

          <div className="text-center md:text-left flex-1 space-y-4">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <Badge variant="outline" className="inline-flex md:self-start mt-1 md:mt-0">
                  {profile.specialty}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">{profile.email}</p>
              {profile.crm && (
                <p className="text-sm text-muted-foreground">CRM: {profile.crm}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
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
