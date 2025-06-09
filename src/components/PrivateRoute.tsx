
/**
 * PrivateRoute.tsx
 * 
 * Componente que protege rotas que exigem autenticação.
 * Redireciona usuários não autenticados para a página de login.
 */

import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from './ui/loading-spinner';
import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Componente de rota privada que verifica se o usuário está autenticado
 * antes de permitir o acesso às rotas protegidas.
 */
const PrivateRoute = () => {
  const { session, loading, userProfile } = useAuth();
  const location = useLocation();

  // Show security-related warnings based on profile status
  useEffect(() => {
    if (userProfile && !loading) {
      // Check if user has CRM
      if (!userProfile.crm) {
        toast.warning('Perfil incompleto', {
          description: 'Por favor, adicione seu CRM no perfil para aproveitar todas as funcionalidades.',
          duration: 5000,
        });
      }
      
      // Check trial status
      if (userProfile.trial_status === 'expired') {
        toast.warning('Período de teste expirado', {
          description: 'Por favor, atualize para um plano pago para continuar utilizando o sistema.',
          duration: 5000,
        });
      }
    }
  }, [userProfile, loading]);

  // Exibe um spinner enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner text="Verificando autenticação..." />
      </div>
    );
  }

  // Redireciona para a página de login se não houver sessão
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Renderiza as rotas filhas se o usuário estiver autenticado
  return <Outlet />;
};

export default PrivateRoute;
