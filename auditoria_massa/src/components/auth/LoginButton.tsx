
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '../ui/loading-spinner';

interface LoginButtonProps {
  isLoading: boolean;
}

const LoginButton = ({ isLoading }: LoginButtonProps) => {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" /> 
          Entrando...
        </span>
      ) : 'Entrar'}
    </Button>
  );
};

export default LoginButton;
