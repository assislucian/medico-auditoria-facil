
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import PricingPlans from "@/components/PricingPlans";
import { useAuth } from '@/contexts/AuthContext';
import { SideNav } from '@/components/SideNav';
import { toast } from 'sonner';
import { useTrialStatus } from '@/hooks/use-trial-status';

const PricingPage = () => {
  const { user } = useAuth();
  const { status } = useTrialStatus();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if trying to checkout without being logged in
  const handleCheckoutRedirect = () => {
    if (!user) {
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
    <>
      <Helmet>
        <title>Planos e Preços | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex">
        {user ? (
          <SideNav className="hidden lg:flex" />
        ) : null}
        <div className="flex-1">
          <Navbar isLoggedIn={!!user} />
          <div className="container py-8 md:py-12">
            <PricingPlans 
              isLoggedIn={!!user}
              isTrial={status === 'active'} 
              onCheckout={handleCheckoutRedirect}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
