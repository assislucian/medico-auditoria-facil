
import { Check, Award, Star } from "lucide-react";
import { SolutionCard } from "./solutions/SolutionCard";

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
            <SolutionCard key={index} {...solution} />
          ))}
        </div>
      </div>
    </section>
  );
}
