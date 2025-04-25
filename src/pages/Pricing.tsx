
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
  
  return (
    <MainLayout 
      title="Planos e Preços"
      showSideNav={!!session}
    >
      <div className="py-4 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Planos MedCheck</h1>
          <p className="text-muted-foreground mt-1">
            Escolha o plano ideal para suas necessidades e comece a recuperar valores glosados hoje mesmo
          </p>
        </div>
        
        <PricingPlans 
          isLoggedIn={!!session}
          isTrial={status === 'active'} 
          onCheckout={handleCheckoutRedirect}
        />
      </div>
    </MainLayout>
  );
};

export default PricingPage;
