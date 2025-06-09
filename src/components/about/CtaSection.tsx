
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CtaSection() {
  return (
    <section className="py-16">
      <div className="container max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Comece a otimizar seus processos hoje
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de profissionais que já transformaram a gestão de seus honorários médicos com o MedCheck.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg">
            <Link to="/register">
              Iniciar Teste Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg">
            <Link to="/contact">Agendar Demonstração</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
