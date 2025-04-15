
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, User, Settings } from 'lucide-react';

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
                <div className="border-l border-border h-6 mx-2" />
                <Button 
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <Link to="/profile">
                    <User size={18} />
                    <span className="sr-only">Perfil</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost" 
                  size="icon"
                  asChild
                >
                  <Link to="/settings">
                    <Settings size={18} />
                    <span className="sr-only">Configurações</span>
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" className="ml-2">
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/pricing" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
                  Planos
                </Link>
                <Link to="/about" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
                  Sobre
                </Link>
                <Link to="/contact" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
                  Contato
                </Link>
                <div className="border-l border-border h-6 mx-2" />
                <Button variant="outline" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
                  Dashboard
                </Link>
                <Link to="/uploads" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
                  Uploads
                </Link>
                <Link to="/history" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
                  Histórico
                </Link>
                <Link to="/profile" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
                  Perfil
                </Link>
                <Link to="/settings" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
                  Configurações
                </Link>
                <Button variant="destructive" className="w-full mt-2">
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/pricing" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
                  Planos
                </Link>
                <Link to="/about" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
                  Sobre
                </Link>
                <Link to="/contact" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-secondary rounded-md">
                  Contato
                </Link>
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
