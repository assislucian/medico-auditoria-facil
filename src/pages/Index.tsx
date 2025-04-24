
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductFeatures } from "@/components/landing/ProductFeatures";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { PricingSection } from "@/components/landing/PricingSection";

const Index = () => {
  return (
    <PublicLayout title="Auditoria médica automatizada">
      <div className="min-h-screen flex flex-col">
        <HeroSection />
        <ProductFeatures />
        <BenefitsSection />
        <PricingSection />
        <DemoSection />
      </div>
    </PublicLayout>
  );
};

export default Index;
