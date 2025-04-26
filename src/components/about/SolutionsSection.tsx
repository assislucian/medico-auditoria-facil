
import { SolutionCard } from "./solutions/SolutionCard";
import { motion } from "framer-motion";

export function SolutionsSection() {
  const solutions = [
    {
      title: "Auditoria automatizada",
      description: "Nossa solução utiliza tecnologia avançada para identificar automaticamente discrepâncias em pagamentos médicos, eliminando a necessidade de análise manual.",
      icon: "chart"
    },
    {
      title: "Comparativo inteligente",
      description: "Sistema que compara valores pagos com as tabelas de referência do setor, identificando instantaneamente valores incorretos ou glosados.",
      icon: "compare"
    },
    {
      title: "Contestação facilitada",
      description: "Geração automática de documentos para contestação, com fundamentação técnica baseada nas regras do setor de saúde.",
      icon: "document"
    },
    {
      title: "Dashboard analítico",
      description: "Visualize todos os seus dados em um painel intuitivo que apresenta métricas importantes e oportunidades de recuperação de valores.",
      icon: "dashboard"
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossas Soluções</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            O MedCheck oferece uma plataforma completa para médicos e prestadores de serviços de saúde 
            que buscam maximizar seus honorários e minimizar perdas com glosas indevidas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <SolutionCard 
              key={index}
              title={solution.title}
              description={solution.description}
              icon={solution.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
