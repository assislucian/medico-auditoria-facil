
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationsSettings } from '@/components/settings/NotificationsSettings';
import { ReferenceTablesSettings } from '@/components/settings/ReferenceTablesSettings';
import { MainLayout } from "@/components/layout/MainLayout";

const Settings = () => {
  return (
    <MainLayout title="Configurações">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Personalize suas preferências e configure as opções do sistema
          </p>
        </div>
        
        <Tabs defaultValue="notificacoes" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none h-auto">
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="tabelas">Tabelas de Referência</TabsTrigger>
          </TabsList>
          
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
    </MainLayout>
  );
};

export default Settings;
