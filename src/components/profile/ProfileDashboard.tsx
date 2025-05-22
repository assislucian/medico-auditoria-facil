
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileOverview } from "./ProfileOverview";
import { ProfileTabs } from "./ProfileTabs";
import { ActivitySummary } from "./ActivitySummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, UserCog, BadgeAlert } from "lucide-react";

export const ProfileDashboard = () => {
  const { user, getProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    specialty: "",
    crm: "",
    email: "",
    avatarUrl: "",
    hospitalName: "Hospital São Paulo",
    memberSince: "Jan 2023"
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setLoading(true);
        try {
          const profile = await getProfile();
          if (profile) {
            let avatarUrl = "";
            if (profile.notification_preferences && 
                typeof profile.notification_preferences === 'object' && 
                'avatar_url' in profile.notification_preferences) {
              avatarUrl = profile.notification_preferences.avatar_url as string || "";
            }
            
            setProfileData({
              name: profile.name || "Usuário",
              specialty: profile.specialty || "Especialidade não informada",
              crm: profile.crm || "CRM não informado",
              email: profile.email || user?.email || "",
              avatarUrl: avatarUrl,
              hospitalName: profile.hospital || "Hospital não informado",
              memberSince: new Date(profile.created_at || Date.now()).toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'short' 
              })
            });
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadProfile();
  }, [user, getProfile]);

  return (
    <div className="space-y-8">
      <ProfileOverview profile={profileData} loading={loading} />
      
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-background border">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span>Informações</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <BadgeAlert className="h-4 w-4" />
            <span>Atividade</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Visão Geral</h2>
          <ActivitySummary />
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileTabs />
        </TabsContent>
        
        <TabsContent value="activity">
          <h2 className="text-2xl font-semibold mb-4">Histórico de Atividades</h2>
          <div className="bg-muted/30 p-16 rounded-lg flex flex-col items-center justify-center text-center">
            <p className="text-lg text-muted-foreground">
              O histórico detalhado de atividades estará disponível em breve
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div className="text-sm text-muted-foreground text-center">
        <p>Última atualização: {new Date().toLocaleString('pt-BR')}</p>
      </div>
    </div>
  );
};
