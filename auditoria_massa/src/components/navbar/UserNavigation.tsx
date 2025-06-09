
import { Link, useLocation } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const UserNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Guias', path: '/guides' },
    { name: 'Demonstrativos', path: '/demonstratives' },
    { name: 'Não Pagos', path: '/unpaid-procedures' },
    { name: 'Histórico', path: '/history' }
  ];
  
  return (
    <>
      {navItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path}
          className={cn(
            "px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.path
              ? "text-foreground border-b-2 border-primary"
              : "text-foreground/70 hover:text-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </>
  );
};
