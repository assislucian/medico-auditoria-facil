
import { ShieldCheck, Users, BadgeCheck } from "lucide-react";
import { ProblemCard } from "./problems/ProblemCard";

export function ProblemsSection() {
  const problems = [
    {
      icon: ShieldCheck,
      title: "Complexidade nas Glosas",
      description: "Dificuldade em identificar e contestar glosas médicas, resultando em perdas financeiras significativas."
    },
    {
      icon: Users,
      title: "Tempo Desperdiçado",
      description: "Horas valiosas gastas em processos administrativos que poderiam ser dedicadas ao atendimento de pacientes."
    },
    {
      icon: BadgeCheck,
      title: "Falta de Padronização",
      description: "Inconsistências na interpretação e aplicação das tabelas de referência CBHPM entre diferentes convênios."
    }
  ];

  return (
    <section className="py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Problemas que Resolvemos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <ProblemCard key={index} {...problem} />
          ))}
        </div>
      </div>
    </section>
  );
}
