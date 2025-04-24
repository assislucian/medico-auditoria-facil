
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import { Footer } from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface PublicLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showGradientBackground?: boolean;
}

export function PublicLayout({
  children,
  title,
  description,
  showGradientBackground = false
}: PublicLayoutProps) {
  const { session } = useAuth();

  return (
    <>
      <Helmet>
        <title>{title} | MedCheck</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <div className={`min-h-screen flex flex-col bg-background ${
        showGradientBackground ? 'bg-gradient-to-b from-background to-muted/50' : ''
      }`}>
        <Navbar isLoggedIn={!!session} />
        <motion.main 
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </>
  );
}
