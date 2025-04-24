
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

interface PublicLayoutProps {
  children: ReactNode;
  title: string;
}

export function PublicLayout({ children, title }: PublicLayoutProps) {
  const { session } = useAuth();

  return (
    <>
      <Helmet>
        <title>{title} | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar isLoggedIn={!!session} />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
}
