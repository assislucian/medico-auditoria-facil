
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";  // Changed from { Navbar }
import { SideNav } from "@/components/SideNav";
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { NotificationsSettings } from '@/components/settings/NotificationsSettings';
import { ReferenceTablesSettings } from '@/components/settings/ReferenceTablesSettings';

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Configurações | MedCheck</title>
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <SideNav className="hidden md:flex" />
        <div className="flex-1">
          <Navbar isLoggedIn={true} />
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Configurações</h1>
            
            <Tabs defaultValue="perfil" className="space-y-6">
              <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 md:grid-cols-none h-auto">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                <TabsTrigger value="tabelas">Tabelas de Referência</TabsTrigger>
              </TabsList>
              
              <TabsContent value="perfil">
                <ProfileSettings />
              </TabsContent>
              
              <TabsContent value="notificacoes">
                <NotificationsSettings />
              </TabsContent>
              
              <TabsContent value="tabelas">
                <Card>
                  <CardHeader>
                    <CardTitle>Tabelas de Referência</CardTitle>
                    <CardDescription>
                      Configure quais tabelas de valores médicos você deseja usar como referência para análises de pagamentos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReferenceTablesSettings />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
