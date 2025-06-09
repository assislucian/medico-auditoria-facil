
import { ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from './MainLayout';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  requireAuth?: boolean;
  showSidebar?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
}

export function AuthenticatedLayout({
  children,
  title,
  description,
  requireAuth = true,
  showSidebar = true,
  isLoading = false,
  loadingMessage,
}: AuthenticatedLayoutProps) {
  const { session, loading } = useAuth();
  
  // Se a autenticação é necessária e o usuário não está autenticado, redirecione para o login
  if (requireAuth && !loading && !session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout
      title={title}
      description={description}
      showSideNav={showSidebar}
      isLoading={loading || isLoading}
      loadingMessage={loadingMessage}
    >
      {children}
    </MainLayout>
  );
}
