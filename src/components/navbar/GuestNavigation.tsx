
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";

export const GuestNavigation = () => {
  const location = useLocation();

  const handleAboutClick = (e: React.MouseEvent) => {
    if (location.pathname === '/about') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost"
            className="flex items-center gap-1 text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
          >
            Produto
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem asChild>
            <Link to="/about" onClick={handleAboutClick}>Quem Somos</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/pricing">Planos</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/how-it-works">Como Funciona</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Link to="/contact" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
        Contato
      </Link>
      
      <div className="border-l border-border h-6 mx-2" />
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" asChild>
          <Link to="/login">Entrar</Link>
        </Button>
        <Button asChild>
          <Link to="/register">Cadastrar</Link>
        </Button>
      </div>
    </>
  );
};
