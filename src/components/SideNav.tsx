
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileUp, 
  History, 
  BarChart2, 
  CreditCard, 
  Settings, 
  LogOut, 
  HelpCircle,
  User,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SideNavProps {
  className?: string;
}

export function SideNav({ className }: SideNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Uploads",
      href: "/uploads",
      icon: FileUp,
    },
    {
      name: "Histórico",
      href: "/history",
      icon: History,
    },
    {
      name: "Relatórios",
      href: "/reports",
      icon: BarChart2,
    },
    {
      name: "Planos",
      href: "/pricing",
      icon: CreditCard,
    },
  ];

  return (
    <div className={cn("pb-12 h-full flex flex-col", className)}>
      <div className="py-4 px-3">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary rounded-md p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6 text-primary-foreground"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <span className="font-bold text-xl">MedCheck</span>
        </Link>
      </div>
      
      <div className="px-3 py-2">
        <div className="flex flex-col items-center mb-6 p-2">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarImage src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200" alt="Avatar" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <h3 className="font-medium">Dra. Ana Silva</h3>
          <p className="text-xs text-muted-foreground">Ortopedia</p>
          <p className="text-xs text-muted-foreground">CRM 123456/SP</p>
          <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
            <Link to="/profile">Ver perfil</Link>
          </Button>
        </div>
      </div>
      
      <div className="px-3 py-2">
        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
          Principal
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={item.href}>
                    <Button
                      variant={location.pathname === item.href ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      
      <div className="px-3 py-2">
        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
          Notificações
        </h2>
        <div className="space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start relative"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notificações
                  <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Notificações</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="px-3 py-2">
        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
          Conta
        </h2>
        <div className="space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/profile">
                  <Button
                    variant={location.pathname === "/profile" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Perfil</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/settings">
                  <Button
                    variant={location.pathname === "/settings" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Configurações</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="px-3 py-2">
        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
          Ajuda
        </h2>
        <div className="space-y-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/help">
                  <Button
                    variant={location.pathname === "/help" ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Ajuda
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Ajuda</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="mt-auto px-3 py-2">
        <div className="flex items-center justify-between p-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
