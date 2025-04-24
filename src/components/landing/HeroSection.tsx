
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 px-6">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.1),transparent_50%)]" />
      </div>
      
      <div className="container mx-auto max-w-5xl animate-fade-in">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Auditoria médica <span className="text-gradient">simplificada</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Identifique e recupere valores glosados pelos planos de saúde em procedimentos cirúrgicos de forma automática e eficiente.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 animate-scale-in hover:scale-105 transition-transform"
            >
              <Link to="/register">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 animate-scale-in hover:scale-105 transition-transform"
            >
              <Link to="/pricing">Ver planos</Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground animate-fade-in pt-4">
            Comece gratuitamente. Sem necessidade de cartão de crédito.
          </p>
        </div>
      </div>
    </section>
  );
}
