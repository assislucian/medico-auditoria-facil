
import { MissionCard } from "./mission/MissionCard";
import { MissionHeader } from "./mission/MissionHeader";

export function MissionSection() {
  const cards = [
    {
      title: "Visão",
      content: "Ser a principal plataforma de gestão de honorários médicos no Brasil, reconhecida pela excelência e inovação tecnológica."
    },
    {
      title: "Valores",
      content: "Comprometimento com a transparência, eficiência e qualidade no suporte aos profissionais de saúde."
    }
  ];

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container max-w-4xl mx-auto px-4">
        <MissionHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <MissionCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
