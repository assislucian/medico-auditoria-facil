
import { Check, Award, Star } from "lucide-react";

export function SolutionsSection() {
  const solutions = [
    {
      icon: Check,
      title: "Auditoria Automatizada",
      description: "Sistema inteligente que analisa automaticamente seus recebimentos e identifica divergências."
    },
    {
      icon: Award,
      title: "Gestão Completa",
      description: "Plataforma integrada para gerenciar todo o ciclo de faturamento médico."
    },
    {
      icon: Star,
      title: "Suporte Especializado",
      description: "Equipe dedicada para auxiliar em todas as etapas do processo."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nossas Soluções</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <solution.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
              <p className="text-muted-foreground">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
