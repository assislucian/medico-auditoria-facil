
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingPlans from "@/components/PricingPlans";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTrialStatus } from '@/hooks/use-trial-status';
import { MainLayout } from '@/components/layout/MainLayout';

const PricingPage = () => {
  const { session } = useAuth();
  const { status } = useTrialStatus();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
  
  return (
    <MainLayout 
      title="Planos e Preços"
      showSideNav={!!session}
    >
      <div className="py-20 px-6 bg-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <PricingPlans 
            isLoggedIn={!!session}
            isTrial={status === 'active'} 
            onCheckout={handleCheckoutRedirect}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PricingPage;
