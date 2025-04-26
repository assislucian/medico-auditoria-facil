
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface FooterSectionProps {
  onSignOut: () => Promise<void>;
}

export function FooterSection({ onSignOut }: FooterSectionProps) {
  return (
    <div className="mt-auto px-3 py-2">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between p-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da plataforma
        </Button>
      </div>
    </div>
  );
}
