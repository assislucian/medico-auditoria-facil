
import { BenefitItem } from "./benefits/BenefitItem";
import { motion } from "framer-motion";

export function BenefitsSection() {
  const benefits = [
    {
      title: "Aumento da receita",
      description: "Recupere até 25% dos honorários que seriam perdidos devido a glosas indevidas.",
      icon: "trend-up"
    },
    {
      title: "Economia de tempo",
      description: "Reduza em até 80% o tempo gasto com tarefas administrativas relacionadas a pagamentos.",
      icon: "clock"
    },
    {
      title: "Transparência total",
      description: "Tenha uma visão clara e completa de todos os seus pagamentos e pendências.",
      icon: "search"
    },
    {
      title: "Suporte especializado",
      description: "Conte com nossa equipe de especialistas em regulação de saúde para ajudá-lo.",
      icon: "headset"
    },
    {
      title: "Dados seguros",
      description: "Sua informação está protegida com criptografia de ponta a ponta e conformidade com a LGPD.",
      icon: "shield"
    },
    {
      title: "Integração fácil",
      description: "Compatível com os principais sistemas de gestão médica e hospitalar do mercado.",
      icon: "puzzle"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefícios</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ao utilizar o MedCheck, você terá acesso a diversos benefícios que transformarão 
            a gestão financeira da sua prática médica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitItem 
              key={index}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
