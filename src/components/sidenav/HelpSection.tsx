
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, PlayCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useOnboarding } from "@/hooks/use-onboarding";

export function HelpSection() {
  const location = useLocation();
  const { resetTour } = useOnboarding();

  /**
   * Manipulador para o botão de reiniciar o tour
   * Chama a função resetTour do hook useOnboarding
   */
  const handleResetTour = () => {
    resetTour();
  };

  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
        Ajuda
      </h2>
      <div className="space-y-1">
        {/* Link para a página de ajuda */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={location.pathname === "/help" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <Link to="/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Ajuda
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Ajuda</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Botão para reiniciar o tour guiado */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={handleResetTour}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Ver Tour Novamente
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Ver Tour Novamente</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
