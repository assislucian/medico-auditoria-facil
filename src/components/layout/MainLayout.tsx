
import { ReactNode, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import { SideNav } from '@/components/SideNav';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showSideNav?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
}

export function MainLayout({
  children,
  title,
  description,
  showSideNav = true,
  isLoading = false,
  loadingMessage = 'Carregando...'
}: MainLayoutProps) {
  const { session, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mostrar tela de carregamento se autenticação estiver carregando ou se estamos carregando dados da página
  if (authLoading || isLoading) {
    return (
      <>
        <Helmet>
          <title>{`${title} | MedCheck`}</title>
          {description && <meta name="description" content={description} />}
        </Helmet>
        <div className="h-screen w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{loadingMessage}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${title} | MedCheck`}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <div className="min-h-screen flex bg-background">
        {/* SideNav para desktop */}
        {showSideNav && !isMobile && (
          <SideNav className="hidden lg:flex w-64 border-r fixed top-0 bottom-0" />
        )}

        {/* SideNav para mobile com Sheet */}
        {showSideNav && isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-50 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SideNav />
            </SheetContent>
          </Sheet>
        )}

        <div className={`flex-1 ${showSideNav ? 'lg:ml-64' : ''}`}>
          <Navbar isLoggedIn={!!session} />
          <div className="container max-w-6xl py-6 px-4 md:py-8 md:px-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
