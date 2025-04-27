
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductFeatures } from "@/components/landing/ProductFeatures";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { motion } from "framer-motion";

const Index = () => {
  // Staggered animation for children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        duration: 0.5 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <PublicLayout 
      title="MedCheck | Auditoria médica automatizada"
      description="A solução definitiva para automatizar a auditoria médica e maximizar a recuperação de valores glosados com reconhecimento inteligente de papéis."
      showGradientBackground={true}
    >
      <motion.div 
        className="flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <HeroSection />
        </motion.div>
        <motion.div variants={itemVariants}>
          <BenefitsSection />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ProductFeatures />
        </motion.div>
        <motion.div variants={itemVariants}>
          <PricingSection />
        </motion.div>
        <motion.div variants={itemVariants}>
          <DemoSection />
        </motion.div>
      </motion.div>
    </PublicLayout>
  );
};

export default Index;
