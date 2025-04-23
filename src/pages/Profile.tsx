
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfoForm } from "@/components/profile/ProfileInfoForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Perfil | MedCheck</title>
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <SideNav className="hidden lg:flex" />
        <div className="flex-1">
          <Navbar isLoggedIn={true} />
          <div className="container max-w-6xl py-8">
            <div className="grid gap-8">
              <ProfileHeader />
              
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="security">Segurança</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info">
                  <Card className="p-6">
                    <ProfileInfoForm />
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium mb-4">Alterar Senha</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Atualize sua senha para manter sua conta segura
                        </p>
                        <Button variant="outline">
                          Alterar Senha
                        </Button>
                      </div>
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-medium mb-4">Autenticação de Dois Fatores</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Adicione uma camada extra de segurança à sua conta
                        </p>
                        <Button variant="outline">
                          Configurar 2FA
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
