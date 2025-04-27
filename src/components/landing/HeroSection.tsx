
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36 px-6">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary),0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(var(--primary),0.03),transparent_30%)]" />
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-12">
          <motion.div
            className="max-w-3xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Auditoria médica
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                intuitiva e eficiente
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mt-6">
              Recupere valores glosados e maximize seus resultados com a 
              plataforma líder em auditoria para profissionais de saúde.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-10 h-14 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/20"
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
                className="text-lg px-10 h-14 rounded-full transition-all duration-300 hover:scale-105 border-2"
              >
                <Link to="/pricing">Ver planos</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            className="w-full max-w-5xl mx-auto mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/40 bg-gradient-to-b from-background to-muted/30">
              <div className="aspect-video relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                <img 
                  src="/assets/dashboard-preview.png" 
                  alt="MedCheck Platform Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";
                    e.currentTarget.style.objectFit = "cover";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-wrap justify-center gap-x-12 gap-y-4 pt-10"
          >
            <p className="text-muted-foreground flex items-center text-sm">
              <span className="inline-block w-5 h-5 mr-2 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="block w-2 h-2 rounded-full bg-primary"></span>
              </span>
              Certificado CFM
            </p>
            <p className="text-muted-foreground flex items-center text-sm">
              <span className="inline-block w-5 h-5 mr-2 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="block w-2 h-2 rounded-full bg-primary"></span>
              </span>
              Dados protegidos (LGPD)
            </p>
            <p className="text-muted-foreground flex items-center text-sm">
              <span className="inline-block w-5 h-5 mr-2 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="block w-2 h-2 rounded-full bg-primary"></span>
              </span>
              Suporte 24/7
            </p>
            <p className="text-muted-foreground flex items-center text-sm">
              <span className="inline-block w-5 h-5 mr-2 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="block w-2 h-2 rounded-full bg-primary"></span>
              </span>
              +10.000 médicos
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
