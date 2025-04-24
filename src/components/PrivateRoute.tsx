
/**
 * PrivateRoute.tsx
 * 
 * Componente que protege rotas que exigem autenticação.
 * Redireciona usuários não autenticados para a página de login.
 */

import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from './ui/loading-spinner';

/**
 * Componente de rota privada que verifica se o usuário está autenticado
 * antes de permitir o acesso às rotas protegidas.
 */
const PrivateRoute = () => {
  const { session, loading } = useAuth();

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
    return <Navigate to="/login" replace />;
  }

  // Renderiza as rotas filhas se o usuário estiver autenticado
  return <Outlet />;
};

export default PrivateRoute;
