
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const UserNavigation = () => {
  return (
    <>
      <Link to="/dashboard" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
        Dashboard
      </Link>
      <Link to="/guides" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
        Guias
      </Link>
      <Link to="/demonstratives" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
        Demonstrativos
      </Link>
      <Link to="/compare" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
        Comparativo
      </Link>
      <Link to="/glosas" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
        Glosas
      </Link>
      <Link to="/uploads" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
        Uploads
      </Link>
      <Link to="/reports" className="text-foreground/80 hover:text-foreground px-3 py-2 text-sm font-medium transition-colors">
        Relatórios
      </Link>
    </>
  );
};
