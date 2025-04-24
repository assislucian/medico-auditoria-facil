
import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductFeatures } from "@/components/landing/ProductFeatures";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { DemoSection } from "@/components/landing/DemoSection";
import PricingPlans from "@/components/PricingPlans";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  const handleCheckoutRedirect = () => {
    return true;
  };
  
  return (
    <PublicLayout title="Auditoria médica automatizada">
      <div className="min-h-screen flex flex-col">
        <HeroSection />
        <ProductFeatures />
        <BenefitsSection />
        
        <section id="pricing" className="py-20 px-6 bg-secondary/20">
          <div className="container mx-auto max-w-6xl">
            <PricingPlans 
              isLoggedIn={!!user} 
              isTrial={false} 
              onCheckout={handleCheckoutRedirect} 
            />
          </div>
        </section>

        <DemoSection />
      </div>
    </PublicLayout>
  );
};

export default Index;
