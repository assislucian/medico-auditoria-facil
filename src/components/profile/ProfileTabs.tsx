
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import { ProfileForm } from "./form/ProfileForm";
import { PasswordChangeForm } from "./security/PasswordChangeForm";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { Shield, Scroll, Bell, Settings } from "lucide-react";

export const ProfileTabs = () => {
  const { loading, updateProfile, updateSecurity, updateNotificationPreferences } = useProfile();

  // Create wrapper functions to handle the void return type expected by the form components
  const handleUpdateProfile = async (
    data: { name: string; email: string; telefone: string; crm: string; especialidade: string; hospital: string; bio: string; }, 
    selectedImage: File | null
  ) => {
    await updateProfile(data, selectedImage);
  };

  const handleUpdateSecurity = async (
    data: { currentPassword: string; newPassword: string; confirmPassword: string; }
  ) => {
    await updateSecurity(data);
  };

  const handleUpdateNotifications = async (data: any) => {
    await updateNotificationPreferences(data);
  };

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full md:grid-cols-3 h-auto">
        <TabsTrigger value="info" className="flex items-center gap-2">
          <Scroll className="h-4 w-4" />
          <span>Informações</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Segurança</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Notificações</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais e profissionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm loading={loading} onSubmit={handleUpdateProfile} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="security" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Segurança
            </CardTitle>
            <CardDescription>
              Gerencie sua senha e configurações de segurança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Alterar Senha</h4>
                <PasswordChangeForm loading={loading} onSubmit={handleUpdateSecurity} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-4">
        <NotificationsTab loading={loading} onSubmit={handleUpdateNotifications} />
      </TabsContent>
    </Tabs>
  );
};
