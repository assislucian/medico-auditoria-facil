
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from 'lucide-react';

interface MobileMenuProps {
  isLoggedIn: boolean;
  isOpen: boolean;
  profileData?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
}

export const MobileMenu = ({ isLoggedIn, isOpen, profileData, onLogout }: MobileMenuProps) => {
  if (!isOpen) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="md:hidden absolute w-full bg-background border-b border-border animate-fade-in">
      <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
        {isLoggedIn && profileData ? (
          <>
            <div className="flex items-center p-4 border-b">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={profileData.avatarUrl} alt="Avatar" />
                <AvatarFallback>{getInitials(profileData.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profileData.name}</p>
                <p className="text-xs text-muted-foreground">{profileData.email}</p>
              </div>
            </div>
            
            <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Dashboard
            </Link>
            <Link to="/uploads" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Uploads
            </Link>
            <Link to="/history" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Histórico
            </Link>
            <Link to="/reports" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Relatórios
            </Link>
            
            <div className="pt-2 pb-2 border-t border-border">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                Perfil
              </p>
            </div>
            
            <Link to="/profile" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Meu Perfil
            </Link>
            <Link to="/settings" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Configurações
            </Link>
            
            <div className="pt-2 pb-2 border-t border-border">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                Ajuda
              </p>
            </div>
            
            <Link to="/help" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Central de Ajuda
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Contato
            </Link>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Sobre o MedCheck
            </Link>
            
            <Button 
              variant="destructive" 
              className="w-full mt-4"
              onClick={onLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </>
        ) : (
          <>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Quem Somos
            </Link>
            <Link to="/pricing" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Planos
            </Link>
            <Link to="/help" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Como Funciona
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
              Contato
            </Link>
            
            <div className="flex items-center px-3 py-2">
              <span className="text-sm mr-2">Tema:</span>
              <ThemeToggle />
            </div>
            
            <div className="flex flex-col space-y-2 mt-3">
              <Button variant="outline" asChild className="w-full">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/register">Cadastrar</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
