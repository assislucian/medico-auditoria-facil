
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductFeatures } from "@/components/landing/ProductFeatures";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <PublicLayout 
      title="MedCheck | Auditoria médica automatizada"
      description="A solução definitiva para automatizar a auditoria médica e maximizar a recuperação de valores glosados."
      showGradientBackground={true}
    >
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <BenefitsSection />
        <ProductFeatures />
        <PricingSection />
        <DemoSection />
      </motion.div>
    </PublicLayout>
  );
};

export default Index;
