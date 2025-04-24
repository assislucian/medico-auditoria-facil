
import { HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MissionSection() {
  return (
    <section className="py-16 bg-secondary/10">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <HeartHandshake className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Capacitar profissionais da saúde com tecnologia avançada para simplificar 
            a gestão de honorários médicos, permitindo que se concentrem no que realmente 
            importa: o cuidado com os pacientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Visão</h3>
              <p className="text-muted-foreground">
                Ser a principal plataforma de gestão de honorários médicos no Brasil, 
                reconhecida pela excelência e inovação tecnológica.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Valores</h3>
              <p className="text-muted-foreground">
                Comprometimento com a transparência, eficiência e qualidade no 
                suporte aos profissionais de saúde.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
