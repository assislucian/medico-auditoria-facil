
import { Link, useLocation } from 'react-router-dom';

export const UserNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const getNavItemClass = (path: string) => {
    const baseClass = "px-3 py-2 text-sm font-medium transition-colors";
    return pathname === path 
      ? baseClass + " text-foreground border-b-2 border-primary" 
      : baseClass + " text-foreground/70 hover:text-foreground";
  };
  
  return (
    <>
      <Link to="/dashboard" className={getNavItemClass("/dashboard")}>
        Dashboard
      </Link>
      <Link to="/guides" className={getNavItemClass("/guides")}>
        Guias
      </Link>
      <Link to="/demonstratives" className={getNavItemClass("/demonstratives")}>
        Demonstrativos
      </Link>
      <Link to="/compare" className={getNavItemClass("/compare")}>
        Comparativos
      </Link>
      <Link to="/history" className={getNavItemClass("/history")}>
        Histórico
      </Link>
    </>
  );
};
