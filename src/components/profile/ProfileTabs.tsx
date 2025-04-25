
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import { ProfileForm } from "./form/ProfileForm";
import { PasswordChangeForm } from "./security/PasswordChangeForm";

export const ProfileTabs = () => {
  const { loading, updateProfile, updateSecurity } = useProfile();

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

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full md:grid-cols-2 h-auto">
        <TabsTrigger value="info">Informações</TabsTrigger>
        <TabsTrigger value="security">Segurança</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais e profissionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm loading={loading} onSubmit={handleUpdateProfile} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Gerencie sua senha e configurações de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Alterar Senha</h4>
              <PasswordChangeForm loading={loading} onSubmit={handleUpdateSecurity} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
