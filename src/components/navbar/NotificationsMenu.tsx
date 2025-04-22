
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NotificationsMenu = () => {
  const notifications = [
    {
      title: "Novo relatório disponível",
      description: "Seu relatório de abril foi processado com sucesso.",
      time: "Há 5 minutos",
      isNew: true
    },
    {
      title: "Divergência detectada",
      description: "Detectamos uma divergência de R$ 245,50 em seu pagamento da Unimed.",
      time: "Há 3 horas",
      isNew: true
    },
    {
      title: "Upload processado",
      description: "Seus documentos foram processados com sucesso.",
      time: "Há 1 dia",
      isNew: true
    },
    {
      title: "Atualização do sistema",
      description: "Novos recursos foram adicionados ao MedCheck.",
      time: "Há 3 dias",
      isNew: false
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
          <span className="sr-only">Notificações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification, index) => (
            <div key={index} className={`p-3 hover:bg-accent cursor-pointer ${notification.isNew ? "bg-primary/5" : ""}`}>
              <div className="flex justify-between items-start">
                <h5 className="font-medium text-sm">{notification.title}</h5>
                {notification.isNew && <Badge variant="default" className="text-[10px] h-5">Novo</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
            </div>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <div className="p-2 text-center">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            Ver todas as notificações
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
