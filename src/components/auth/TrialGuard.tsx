
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrialStatus } from '@/hooks/use-trial-status';
import { useAuth } from '@/contexts/AuthContext';

interface TrialGuardProps {
  children: React.ReactNode;
}

const TrialGuard = ({ children }: TrialGuardProps) => {
  const { user } = useAuth();
  const { status, isLoading } = useTrialStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user && status === 'not_started') {
      navigate('/lock');
    }
  }, [isLoading, user, status, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return status === 'active' ? <>{children}</> : null;
};

export default TrialGuard;
