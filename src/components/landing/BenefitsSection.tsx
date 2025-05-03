
import { CheckCircle, Microscope, BriefcaseMedical, Shield, BarChart, Database } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: CheckCircle,
    title: "Detecta erros de pagamento",
    description: "Identifica automaticamente divergências entre o que foi feito e o que foi pago.",
    color: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: Microscope,
    title: "Validação CBHPM",
    description: "Compara seus procedimentos com a CBHPM 2015, considerando seu papel: cirurgião, auxiliar, anestesista…",
    color: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-600 dark:text-green-400"
  },
  {
    icon: BarChart,
    title: "Relatórios completos",
    description: "Gere PDF com detalhes para contestação e registro.",
    color: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: BriefcaseMedical,
    title: "Dashboard intuitivo",
    description: "Visualize glosas por procedimento, valor e frequência.",
    color: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-600 dark:text-amber-400"
  },
  {
    icon: Shield,
    title: "Segurança total",
    description: "Proteção de dados com criptografia e conformidade com a LGPD.",
    color: "bg-indigo-50 dark:bg-indigo-950/30",
    textColor: "text-indigo-600 dark:text-indigo-400"
  }
];

export function BenefitsSection() {
  return (
    <section className="py-20 px-6 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que milhares de médicos escolhem o <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">MedCheck</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa tecnologia analisa pagamentos e mostra, com clareza, onde você deixou de receber.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col gap-4 p-6 rounded-xl bg-background border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300"
            >
              <div className={`${benefit.color} p-3 rounded-xl self-start`}>
                <benefit.icon className={`h-6 w-6 ${benefit.textColor}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mt-12 bg-primary/5 py-10 px-6 rounded-lg"
        >
          <p className="text-xl font-semibold mb-6">
            Com menos de R$ 3 por dia, médicos recuperam até R$ 2.000 por mês com o MedCheck.
            <br />
            Transforme glosas ocultas em faturamento.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="text-lg px-8 h-12 rounded-md"
          >
            <Link to="/register">
              Comece grátis — sem cartão de crédito
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
