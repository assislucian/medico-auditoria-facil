
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  FileText, 
  FileBarChart, 
  FileQuestion, 
  History, 
  Table
} from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function MainNavigation() {
  const location = useLocation();
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LineChart,
    },
    {
      name: "Guias",
      href: "/guides",
      icon: FileText,
    },
    {
      name: "Demonstrativos",
      href: "/demonstratives",
      icon: FileBarChart,
    },
    {
      name: "Não Pagos",
      href: "/unpaid-procedures",
      icon: FileQuestion,
    },
    {
      name: "Histórico",
      href: "/history",
      icon: History,
    },
    {
      name: "Tabelas",
      href: "/reference-tables",
      icon: Table,
    },
  ];

  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
        Navegação
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
