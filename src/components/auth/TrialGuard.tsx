
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTrialStatus } from '@/hooks/use-trial-status';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TrialGuardProps {
  children: React.ReactNode;
}

const TrialGuard = ({ children }: TrialGuardProps) => {
  const { user } = useAuth();
  const { status, endDate, isLoading } = useTrialStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('TrialGuard - User:', !!user, 'Status:', status, 'isLoading:', isLoading);
    
    // Only proceed if loading is complete
    if (!isLoading && user) {
      console.log('TrialGuard check complete - Status:', status);
      
      if (status === 'not_started') {
        console.log('Trial not started, redirecting to welcome page');
        // Store the attempted URL to redirect back after trial activation
        if (location.pathname !== '/welcome') {
          console.log('Redirecting to welcome page from:', location.pathname);
          navigate('/welcome', { 
            state: { returnTo: location.pathname + location.search },
            replace: true 
          });
        }
      } else if (status === 'expired') {
        console.log('Trial expired, showing message');
        toast.error('Seu período de avaliação expirou', {
          description: 'Por favor, atualize para um plano pago para continuar.'
        });
        // For expired trials, we still allow access but show a message
      }
      
      setIsChecking(false);
    } else if (!user && !isLoading) {
      // If there's no user and we're not loading, allow the auth routes to handle it
      setIsChecking(false);
    }
  }, [isLoading, user, status, navigate, location]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-xl font-medium">Verificando acesso...</span>
      </div>
    );
  }

  // Only render children if trial is active or expired (we show a message for expired)
  return status === 'active' || status === 'expired' ? <>{children}</> : null;
};

export default TrialGuard;
