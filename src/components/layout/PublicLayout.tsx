
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import { Footer } from './Footer';
import { useAuth } from '@/contexts/AuthContext';

interface PublicLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function PublicLayout({ children, title, description }: PublicLayoutProps) {
  const { session } = useAuth();

  return (
    <>
      <Helmet>
        <title>{title} | MedCheck</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar isLoggedIn={!!session} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
