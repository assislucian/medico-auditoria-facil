
import { ProblemCard } from "./problems/ProblemCard";
import { motion } from "framer-motion";

export function ProblemsSection() {
  const problems = [
    {
      title: "Glosas indevidas",
      description: "Estudos mostram que até 30% dos honorários médicos são indevidamente retidos por operadoras de saúde através de glosas injustificadas."
    },
    {
      title: "Processos manuais",
      description: "A maioria dos médicos e clínicas ainda utiliza métodos manuais para conferir pagamentos, resultando em perda de tempo e dinheiro."
    },
    {
      title: "Complexidade administrativa",
      description: "A burocracia para contestar glosas é desafiadora, levando muitos profissionais a desistirem de valores que lhes são de direito."
    },
    {
      title: "Falta de transparência",
      description: "Informações pouco claras nas demonstrações de pagamento dificultam a identificação de inconsistências e a tomada de decisões."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Problemas que Resolvemos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Os profissionais de saúde enfrentam diversos desafios na gestão de seus honorários. 
            O MedCheck foi criado para solucionar esses problemas de forma eficiente e tecnológica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <ProblemCard 
              key={index}
              title={problem.title}
              description={problem.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
