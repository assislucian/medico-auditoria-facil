
import { BenefitItem } from "./benefits/BenefitItem";

export function BenefitsSection() {
  const benefits = [
    "Aumento de até 30% na recuperação de valores glosados",
    "Redução de 70% no tempo gasto com processos administrativos",
    "Acesso a relatórios detalhados e insights valiosos",
    "Integração com as principais operadoras de saúde",
    "Suporte técnico especializado",
    "Atualizações automáticas de tabelas e normativas"
  ];

  return (
    <section className="py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Benefícios do MedCheck</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <BenefitItem key={index} text={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
