
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import { ProfileForm } from "./form/ProfileForm";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { Scroll, Bell } from "lucide-react";

export const ProfileTabs = () => {
  const { loading, updateNotificationPreferences } = useProfile();

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full md:grid-cols-2 h-auto">
        <TabsTrigger value="info" className="flex items-center gap-2">
          <Scroll className="h-4 w-4" />
          <span>Informações</span>
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
              <Scroll className="h-5 w-5 text-primary" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais e profissionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm loading={loading} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="mt-4">
        <NotificationsTab 
          loading={loading} 
          onSubmit={updateNotificationPreferences}
        />
      </TabsContent>
    </Tabs>
  );
};
