
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SideNav } from '@/components/SideNav';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  title: string;
  requireAuth?: boolean;
  showSidebar?: boolean;
}

export function AuthenticatedLayout({
  children,
  title,
  requireAuth = true,
  showSidebar = true,
}: AuthenticatedLayoutProps) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !loading && !session) {
    return <Navigate to="/login" replace />;
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title} | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex bg-background">
        {showSidebar && session && (
          <SideNav className="hidden lg:flex" />
        )}
        <div className="flex-1">
          <Navbar isLoggedIn={!!session} />
          <div className="container max-w-6xl py-8">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
