
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingPlans from "@/components/PricingPlans";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTrialStatus } from '@/hooks/use-trial-status';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';

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
      <PageHeader
        title="Planos MedCheck"
        description="Escolha o plano ideal para suas necessidades e comece a recuperar valores glosados hoje mesmo"
      />
      
      <PricingPlans 
        isLoggedIn={!!session}
        isTrial={status === 'active'} 
        onCheckout={handleCheckoutRedirect}
      />
    </MainLayout>
  );
};

export default PricingPage;
