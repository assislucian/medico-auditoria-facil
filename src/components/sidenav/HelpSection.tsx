
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function HelpSection() {
  const location = useLocation();

  return (
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
  );
}
