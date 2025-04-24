
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingPlans from "@/components/PricingPlans";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTrialStatus } from '@/hooks/use-trial-status';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';

const PricingPage = () => {
  const { user, session } = useAuth();
  const { status } = useTrialStatus();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if trying to checkout without being logged in
  const handleCheckoutRedirect = () => {
    if (!session) {
      toast.info('Você precisa estar logado para assinar um plano', {
        action: {
          label: 'Fazer Login',
          onClick: () => navigate('/login?redirect=/pricing')
        }
      });
      return false;
    }
    return true;
  };

  // Use the appropriate layout based on authentication status
  const Layout = session ? AuthenticatedLayout : PublicLayout;
  
  return (
    <Layout title="Planos e Preços">
      <div className="py-8 md:py-12">
        <PricingPlans 
          isLoggedIn={!!session}
          isTrial={status === 'active'} 
          onCheckout={handleCheckoutRedirect}
        />
      </div>
    </Layout>
  );
};

export default PricingPage;
