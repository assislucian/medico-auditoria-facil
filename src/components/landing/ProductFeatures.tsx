
import { CheckCircle, ChartBar, FileStack, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileStack,
    title: "Auditoria Inteligente",
    description: "Upload e análise automática de guias hospitalares e demonstrativos de pagamento"
  },
  {
    icon: ChartBar,
    title: "Relatórios Detalhados",
    description: "Visualize análises completas de pagamentos e glosas em dashboards interativos"
  },
  {
    icon: CheckCircle,
    title: "Detecção de Inconsistências",
    description: "Identificação automática de divergências entre valores CBHPM e pagamentos"
  },
  {
    icon: ShieldCheck,
    title: "Segurança de Dados",
    description: "Seus dados protegidos com criptografia e conformidade com LGPD"
  }
];

export function ProductFeatures() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/5 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.02]" />
      
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Recursos <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Premium</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Ferramentas avançadas para otimizar seu processo de auditoria médica
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
              className="group p-8 rounded-xl bg-card hover:bg-accent/5 border border-border/50 hover:border-primary/20 transition-all duration-300"
            >
              <div className="relative mb-6">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur" />
                <div className="relative bg-background rounded-lg p-4 w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
