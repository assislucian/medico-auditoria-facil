
import { Clock, DollarSign, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Clock,
    title: "Economize Tempo",
    description: "Reduza em até 80% o tempo gasto em auditorias médicas manuais com nossa plataforma automatizada.",
    color: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: DollarSign,
    title: "Maximize Receitas",
    description: "Recupere valores glosados indevidamente e aumente seu faturamento com alertas inteligentes.",
    color: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-600 dark:text-green-400"
  },
  {
    icon: ShieldCheck,
    title: "Segurança Total",
    description: "Seus dados protegidos com a mais alta tecnologia em nuvem e em conformidade com a LGPD.",
    color: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-600 dark:text-purple-400"
  }
];

export function BenefitsSection() {
  return (
    <section className="py-28 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Por que escolher o <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">MedCheck</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Desenvolvido por médicos para médicos, com foco na eficiência e recuperação financeira
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col rounded-2xl overflow-hidden bg-background border border-border/50"
            >
              <div className={`p-8 flex flex-col items-center text-center`}>
                <div className={`${benefit.color} p-4 rounded-full mb-6`}>
                  <benefit.icon className={`h-8 w-8 ${benefit.textColor}`} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
