
import { Clock, DollarSign, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Economize Tempo",
    description: "Reduza em até 80% o tempo gasto em auditorias médicas manuais"
  },
  {
    icon: DollarSign,
    title: "Maximize Receitas",
    description: "Recupere valores glosados indevidamente e aumente seu faturamento"
  },
  {
    icon: ShieldCheck,
    title: "Segurança Total",
    description: "Seus dados protegidos com a mais alta tecnologia em nuvem"
  }
];

export function BenefitsSection() {
  return (
    <section className="py-20 px-6 bg-secondary/20">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Benefícios do MedCheck
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="flex flex-col items-center text-center p-6 glass-card rounded-xl transform hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-primary/20 p-4 rounded-full mb-6">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
