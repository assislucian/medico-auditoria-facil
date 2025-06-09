
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  name: string;
  email: string;
  specialty?: string;
  avatarUrl?: string;
  onLogout: () => void;
}

export const UserMenu = ({ name, email, specialty, avatarUrl, onLogout }: UserMenuProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost"
          className="flex items-center gap-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt="Avatar" />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium">{name}</p>
            {specialty && (
              <p className="text-xs text-muted-foreground">{specialty}</p>
            )}
          </div>
          <ChevronDown className="h-4 w-4 hidden lg:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="flex items-center justify-start p-2 lg:hidden">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={avatarUrl} alt="Avatar" />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="lg:hidden" />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Tema</span>
            <ThemeToggle className="ml-0" />
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
