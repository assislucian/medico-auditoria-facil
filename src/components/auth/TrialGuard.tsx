
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
  const { status, endDate, isLoading, error } = useTrialStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    console.log('TrialGuard - User:', !!user, 'Status:', status, 'isLoading:', isLoading, 'Path:', location.pathname);
    
    // Only proceed if loading is complete
    if (!isLoading && user && !hasNavigated) {
      console.log('TrialGuard check complete - Status:', status);
      
      if (status === 'not_started' && location.pathname !== '/welcome') {
        console.log('Trial not started, redirecting to welcome page from:', location.pathname);
        setHasNavigated(true);
        navigate('/welcome', { 
          state: { returnTo: location.pathname + location.search },
          replace: true 
        });
      } else if (status === 'expired') {
        console.log('Trial expired, showing message');
        toast.error('Seu período de avaliação expirou', {
          description: 'Por favor, atualize para um plano pago para continuar.'
        });
      }
      
      setIsChecking(false);
    } else if (!user && !isLoading) {
      // If there's no user and we're not loading, allow the auth routes to handle it
      setIsChecking(false);
    }
    
    // If we're still loading or checking, don't update isChecking yet
    if (isLoading) {
      return;
    }
    
    // If we've reached this point and we're still checking, stop checking
    // This prevents infinite loading states
    if (isChecking && !isLoading) {
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 2000); // Set a maximum wait time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, user, status, navigate, location, isChecking, hasNavigated]);

  // Added a max timeout to prevent infinite loading
  useEffect(() => {
    const maxLoadingTimer = setTimeout(() => {
      if (isChecking) {
        console.log('TrialGuard max loading time reached, forcing proceed');
        setIsChecking(false);
      }
    }, 5000);
    
    return () => clearTimeout(maxLoadingTimer);
  }, [isChecking]);

  if (error) {
    console.error('Trial status error:', error);
  }

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-xl font-medium">Verificando acesso...</span>
      </div>
    );
  }

  // Always render children if not in the checking state, even if the status is not_started
  // This allows the Welcome page to work without redirecting back to itself
  return <>{children}</>;
};

export default TrialGuard;
