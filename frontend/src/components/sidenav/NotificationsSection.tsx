
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function NotificationsSection() {
  const location = useLocation();
  const notificationContext = useNotifications();
  
  // Fallback in case context is not available (this shouldn't happen with our fixed provider setup)
  const unreadCount = notificationContext?.unreadCount || 0;

  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
        Notificações
      </h2>
      <div className="space-y-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={location.pathname === "/notifications" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start relative"
                asChild
              >
                <Link to="/notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notificações
                  {unreadCount > 0 && (
                    <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Notificações</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
