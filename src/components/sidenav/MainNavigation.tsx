
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileUp, 
  History, 
  BarChart2, 
  CreditCard,
  FileBarChart,
  FileText,
  AlertCircle
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
    },
    {
      name: "Guias",
      href: "/guides",
      icon: FileText,
    },
    {
      name: "Demonstrativos",
      href: "/demonstratives",
      icon: FileUp,
    },
    {
      name: "Comparativo",
      href: "/compare",
      icon: FileBarChart,
    },
    {
      name: "Glosas",
      href: "/glosas",
      icon: AlertCircle,
    },
    {
      name: "Upload",
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
              <TooltipContent side="right">{item.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
