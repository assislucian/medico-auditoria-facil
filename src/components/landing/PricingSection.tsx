
import PricingPlans from "@/components/PricingPlans";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export function PricingSection() {
  const { user } = useAuth();
  
  const handleCheckoutRedirect = () => {
    return true;
  };

  return (
    <section id="pricing" className="py-20 px-6 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha o plano ideal e comece a recuperar hoje mesmo
          </h2>
        </motion.div>
        
        <PricingPlans 
          isLoggedIn={!!user} 
          isTrial={false} 
          onCheckout={handleCheckoutRedirect} 
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">O que você recebe no plano individual R$ 89,90/mês:</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-2">
                <span className="text-primary-500">✓</span>
                <span>1 CRM registrado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">✓</span>
                <span>Uploads ilimitados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">✓</span>
                <span>Histórico completo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">✓</span>
                <span>Exportação para Excel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">✓</span>
                <span>Suporte por e-mail</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
