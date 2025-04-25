
import { Helmet } from 'react-helmet-async';
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { Button } from '@/components/ui/button';
import { CheckCheck, Trash2 } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <>
      <Helmet>
        <title>Notificações | MedCheck</title>
      </Helmet>
      <AuthenticatedLayout title="Notificações">
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Notificações</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas notificações e atualizações do sistema
              </p>
            </div>
            <div className="flex items-center gap-2 self-end">
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => markAllAsRead()}
                >
                  <CheckCheck className="h-4 w-4" />
                  Marcar todas como lidas
                </Button>
              )}
              {notifications.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10 text-destructive"
                  onClick={() => clearNotifications()}
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar tudo
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="border-b mb-6">
              <TabsList className="mb-[-1px]">
                <TabsTrigger value="all">
                  Todas
                  {notifications.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {notifications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Não lidas
                  {unreadNotifications.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                      {unreadNotifications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read">
                  Lidas
                  {readNotifications.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {readNotifications.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <NotificationsList notifications={notifications} />
            </TabsContent>
            
            <TabsContent value="unread">
              <NotificationsList notifications={unreadNotifications} />
            </TabsContent>
            
            <TabsContent value="read">
              <NotificationsList notifications={readNotifications} />
            </TabsContent>
          </Tabs>
        </div>
      </AuthenticatedLayout>
    </>
  );
};

export default NotificationsPage;
