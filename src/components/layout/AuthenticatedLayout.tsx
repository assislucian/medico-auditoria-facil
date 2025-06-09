
import { ReactNode } from 'react';
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
  requireAuth = false, // Mudando para false por padrão
  showSidebar = true,
  isLoading = false,
  loadingMessage,
}: AuthenticatedLayoutProps) {
  const { session, loading } = useAuth();
  
  // Removendo a verificação de autenticação para permitir acesso livre
  // if (requireAuth && !loading && !session) {
  //   return <Navigate to="/login" replace />;
  // }

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
