
import { CheckCircle, Microscope, BriefcaseMedical, Shield, Calculator, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Microscope,
    title: "Análise Inteligente",
    description: "Nossa tecnologia proprietária analisa automaticamente seus pagamentos e identifica inconsistências com precisão.",
    color: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: CheckCircle,
    title: "Validação CBHPM",
    description: "Comparação automática entre valores cobrados e tabelas de referência atualizadas, garantindo que você seja pago corretamente.",
    color: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-600 dark:text-green-400"
  },
  {
    icon: Users,
    title: "Cálculo por Papéis",
    description: "Análise personalizada baseada no seu papel (Cirurgião, Auxiliar ou Anestesista) garantindo o correto percentual de honorários.",
    color: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-600 dark:text-amber-400"
  },
  {
    icon: BriefcaseMedical,
    title: "Gestão Completa",
    description: "Acompanhe todo o processo de contestação de glosas através de dashboards informativos e relatórios detalhados.",
    color: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: Calculator,
    title: "Contestação Automática",
    description: "Gere contestações automáticas detalhadas com base nas divergências encontradas, economizando seu tempo e maximizando recuperação.",
    color: "bg-indigo-50 dark:bg-indigo-950/30",
    textColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    icon: Shield,
    title: "Segurança e Conformidade",
    description: "Seus dados protegidos com a mais alta tecnologia em nuvem e em conformidade com a LGPD e requisitos do CFM.",
    color: "bg-rose-50 dark:bg-rose-950/30",
    textColor: "text-rose-600 dark:text-rose-400"
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
            Veja como nossa plataforma transforma o processo de auditoria médica com reconhecimento inteligente de papéis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col p-6 rounded-xl bg-background border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 h-full"
            >
              <div className={`${benefit.color} p-3 rounded-xl self-start mb-4`}>
                <benefit.icon className={`h-6 w-6 ${benefit.textColor}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold mb-2">Cálculos precisos por papel desempenhado</h3>
              <p className="text-muted-foreground mb-4">
                O MedCheck reconhece automaticamente seu papel na equipe médica e calcula corretamente os honorários baseados na tabela CBHPM 2015:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Cirurgião: 100% do valor do porte</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>1º Auxiliar: 30% do valor do porte</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>2º Auxiliar: 20% do valor do porte</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Anestesista: valor próprio calculado pelo porte anestésico</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-background p-4 rounded-lg border border-border shadow-sm">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Exemplo de cálculo</p>
                  <h4 className="font-medium mb-2">Reconstrução Mamária</h4>
                  <div className="space-y-1 text-sm">
                    <p>Cirurgião: <span className="font-mono">R$ 1.525,45</span></p>
                    <p>1º Auxiliar: <span className="font-mono">R$ 457,64</span></p>
                    <p>Anestesista: <span className="font-mono">R$ 458,00</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center"
        >
          <Button 
            asChild 
            size="lg" 
            className="text-lg px-8 h-12 rounded-md"
          >
            <Link to="/register">
              Experimente grátis por 14 dias
            </Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">Recupere seus honorários e maximize sua remuneração</p>
        </motion.div>
      </div>
    </section>
  );
}
