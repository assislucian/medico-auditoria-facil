
import { ShieldCheck, Users, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
