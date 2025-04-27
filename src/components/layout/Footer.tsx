
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const handleAboutClick = (e: React.MouseEvent) => {
    if (location.pathname === '/about') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                MedCheck
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              Automatizando a auditoria médica para maximizar seus resultados
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-sm text-muted-foreground uppercase tracking-wider">Produto</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" onClick={handleAboutClick} className="text-sm text-foreground/90 hover:text-primary transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-foreground/90 hover:text-primary transition-colors">
                  Planos
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-foreground/90 hover:text-primary transition-colors">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-sm text-muted-foreground uppercase tracking-wider">Suporte</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-sm text-foreground/90 hover:text-primary transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-foreground/90 hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-foreground/90 hover:text-primary transition-colors">
                  Suporte Técnico
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-sm text-muted-foreground uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-foreground/90 hover:text-primary transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-foreground/90 hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} MedCheck. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/80 hover:text-primary transition-colors">
              LinkedIn
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/80 hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/80 hover:text-primary transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
