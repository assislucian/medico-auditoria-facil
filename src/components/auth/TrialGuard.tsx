
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTrialStatus } from '@/hooks/use-trial-status';
import { useAuth } from '@/contexts/AuthContext';

interface TrialGuardProps {
  children: React.ReactNode;
}

const TrialGuard = ({ children }: TrialGuardProps) => {
  const { user } = useAuth();
  const { status, isLoading } = useTrialStatus();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we have a user and their trial status is loaded
    if (!isLoading && user) {
      if (status === 'not_started') {
        // Store the attempted URL to redirect back after trial activation
        const returnPath = location.pathname + location.search;
        // Only redirect if we're not already on the lock screen
        if (location.pathname !== '/lock') {
          navigate('/lock', { 
            state: { returnTo: returnPath },
            replace: true 
          });
        }
      }
    }
  }, [isLoading, user, status, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if trial is active
  return status === 'active' ? <>{children}</> : null;
};

export default TrialGuard;
