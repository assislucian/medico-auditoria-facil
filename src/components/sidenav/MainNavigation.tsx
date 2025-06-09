
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  FileText,
  FileBarChart,
  Settings,
  HelpCircle,
  History,
  BookOpen,
  FileX
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

export function MainNavigation() {
  const location = useLocation();
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Visão geral"
    },
    {
      name: "Guias",
      href: "/guides",
      icon: FileText,
      description: "Guias médicas"
    },
    {
      name: "Demonstrativos",
      href: "/demonstratives",
      icon: FileBarChart,
      description: "Demonstrativos de pagamento"
    },
    {
      name: "Não Pagos",
      href: "/unpaid-procedures",
      icon: FileX,
      description: "Procedimentos não pagos e glosas"
    },
    {
      name: "Histórico",
      href: "/history",
      icon: History,
      description: "Histórico de análises"
    },
    {
      name: "Tabelas",
      href: "/reference-tables",
      icon: BookOpen,
      description: "Tabelas de referência"
    },
    {
      name: "Configurações",
      href: "/settings",
      icon: Settings,
      description: "Ajustes da conta"
    },
    {
      name: "Suporte",
      href: "/help",
      icon: HelpCircle,
      description: "Central de ajuda"
    }
  ];

  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
        Principal
      </h2>
      <div className="space-y-1">
        {navItems.map((item) => (
          <TooltipProvider key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={location.pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
