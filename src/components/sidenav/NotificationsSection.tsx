
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export function NotificationsSection() {
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
        Notificações
      </h2>
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start relative"
        >
          <Bell className="mr-2 h-4 w-4" />
          Notificações
          <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
        </Button>
      </div>
    </div>
  );
}
