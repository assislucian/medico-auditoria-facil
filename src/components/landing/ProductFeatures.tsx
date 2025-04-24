
import { CheckCircle2, ChartBar, FileStack, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: FileStack,
    title: "Auditoria Inteligente",
    description: "Upload e análise automática de guias hospitalares e demonstrativos de pagamento"
  },
  {
    icon: ChartBar,
    title: "Relatórios Detalhados",
    description: "Visualize análises completas de pagamentos e glosas em dashboards interativos"
  },
  {
    icon: CheckCircle2,
    title: "Detecção de Inconsistências",
    description: "Identificação automática de divergências entre valores CBHPM e pagamentos"
  },
  {
    icon: ShieldCheck,
    title: "Segurança de Dados",
    description: "Seus dados protegidos com criptografia e conformidade com LGPD"
  }
];

export function ProductFeatures() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Recursos Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-card border hover:border-primary/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
