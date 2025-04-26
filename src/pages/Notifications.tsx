
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BellRing, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <MainLayout title="Notificações">
      <PageHeader
        title="Notificações"
        description="Acompanhe todas as notificações do sistema"
      />

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          <span className="text-lg font-medium">
            {notifications.length} Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} não lidas
              </Badge>
            )}
          </span>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => markAllAsRead()}
          >
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <BellRing className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-xl font-medium mt-2">Nenhuma notificação</h3>
            <p className="text-muted-foreground">
              Você não possui nenhuma notificação no momento.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`p-4 ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    {notification.type && (
                      <Badge variant={
                        notification.type === 'success' ? 'success' : 
                        notification.type === 'warning' ? 'warning' : 
                        notification.type === 'error' ? 'destructive' : 
                        'default'
                      }>
                        {notification.type}
                      </Badge>
                    )}
                    {!notification.read && (
                      <Badge variant="outline" className="bg-primary/10">Nova</Badge>
                    )}
                  </div>
                  <p className="mt-1">{notification.message}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {notification.createdAt && formatDistanceToNow(notification.createdAt, { 
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Marcar como lida</span>
                  </Button>
                )}
              </div>
              {notification.link && (
                <div className="mt-2">
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href={notification.link}>Ver detalhes</a>
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default NotificationsPage;
