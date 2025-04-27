
import { CheckCircle, ShieldCheck, Microscope, BriefcaseMedical } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Microscope,
    title: "Análise Inteligente",
    description: "Detecção automatizada de inconsistências em pagamentos e glosas com nossa tecnologia proprietária."
  },
  {
    icon: CheckCircle,
    title: "Validação CBHPM",
    description: "Comparação automática entre valores cobrados e tabelas de referência atualizadas."
  },
  {
    icon: BriefcaseMedical,
    title: "Gestão Completa",
    description: "Dashboard intuitivo para visualização de métricas e acompanhamento de recuperação."
  },
  {
    icon: ShieldCheck,
    title: "Segurança Total",
    description: "Proteção de dados conforme LGPD e requisitos do Conselho Federal de Medicina."
  }
];

export function ProductFeatures() {
  return (
    <section className="py-28 px-6 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.015]" />
      
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Recursos <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Premium</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tecnologia avançada para otimizar sua prática médica e maximizar seus resultados
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="bg-primary/5 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
