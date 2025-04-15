
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Menu, 
  X, 
  User, 
  Settings, 
  HelpCircle, 
  Bell, 
  ChevronDown 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gradient">MedCheck</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/uploads" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
                  Uploads
                </Link>
                <Link to="/history" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
                  Histórico
                </Link>
                <Link to="/reports" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
                  Relatórios
                </Link>
                
                {/* Notificações */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell size={18} />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
                      <span className="sr-only">Notificações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <div className="max-h-80 overflow-y-auto">
                      {[
                        {
                          title: "Novo relatório disponível",
                          description: "Seu relatório de abril foi processado com sucesso.",
                          time: "Há 5 minutos",
                          isNew: true
                        },
                        {
                          title: "Divergência detectada",
                          description: "Detectamos uma divergência de R$ 245,50 em seu pagamento da Unimed.",
                          time: "Há 3 horas",
                          isNew: true
                        },
                        {
                          title: "Upload processado",
                          description: "Seus documentos foram processados com sucesso.",
                          time: "Há 1 dia",
                          isNew: true
                        },
                        {
                          title: "Atualização do sistema",
                          description: "Novos recursos foram adicionados ao MedCheck.",
                          time: "Há 3 dias",
                          isNew: false
                        },
                      ].map((notification, index) => (
                        <div key={index} className={`p-3 hover:bg-accent cursor-pointer ${notification.isNew ? "bg-primary/5" : ""}`}>
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">{notification.title}</h5>
                            {notification.isNew && <Badge variant="default" className="text-[10px] h-5">Novo</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    
                    <DropdownMenuSeparator />
                    <div className="p-2 text-center">
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        Ver todas as notificações
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="border-l border-border h-6 mx-2" />
                
                {/* Menu Ajuda */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost"
                      size="icon"
                    >
                      <HelpCircle size={18} />
                      <span className="sr-only">Ajuda</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/help">Central de Ajuda</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/contact">Contato</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/about">Sobre o MedCheck</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Menu Usuário */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost"
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200" alt="Avatar" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium">Dra. Ana Silva</p>
                        <p className="text-xs text-muted-foreground">Ortopedia</p>
                      </div>
                      <ChevronDown className="h-4 w-4 hidden lg:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <div className="flex items-center justify-start p-2 lg:hidden">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200" alt="Avatar" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Dra. Ana Silva</p>
                        <p className="text-xs text-muted-foreground">dr.anasilva@exemplo.com.br</p>
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
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Sobre Menu - Para usuários não logados */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost"
                      className="flex items-center gap-1 text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors"
                    >
                      Sobre
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem asChild>
                      <Link to="/about">Quem Somos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/pricing">Planos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/help">Como Funciona</Link>
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
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isLoggedIn && (
              <>
                <Button variant="ghost" size="icon" className="relative mr-2">
                  <Bell size={18} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
                  <span className="sr-only">Notificações</span>
                </Button>
                
                <ThemeToggle className="mr-2" />
              </>
            )}
            <button
              type="button"
              className="text-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-background border-b border-border animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
            {isLoggedIn ? (
              <>
                {/* Avatar para usuário logado em mobile */}
                <div className="flex items-center p-4 border-b">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200" alt="Avatar" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Dra. Ana Silva</p>
                    <p className="text-xs text-muted-foreground">dr.anasilva@exemplo.com.br</p>
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
                
                <Button variant="destructive" className="w-full mt-4">
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
      )}
    </nav>
  );
};

export default Navbar;
