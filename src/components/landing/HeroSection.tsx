
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, BadgeCheck, Trophy, Microscope, Syringe, BriefcaseMedical } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-6">
      {/* Enhanced gradient background with medical-themed overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(var(--primary),0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
      
      <motion.div 
        className="container mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-left space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
              Auditoria médica <br />
              <span className="bg-gradient-to-r from-primary/90 via-primary to-primary/80 bg-clip-text text-transparent">
                simplificada e eficiente
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Recupere valores glosados e automatize sua auditoria médica com inteligência artificial.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 h-14 animate-scale-in hover:scale-105 transition-transform shadow-lg shadow-primary/20"
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
                className="text-lg px-8 h-14 animate-scale-in hover:scale-105 transition-transform border-2"
              >
                <Link to="/pricing">Ver planos</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-8">
              <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.05]" />
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border/50">
                    <Microscope className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold">Análise Precisa</h3>
                    <p className="text-sm text-muted-foreground">Detecção automática de glosas</p>
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border/50">
                    <BriefcaseMedical className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold">Gestão TISS</h3>
                    <p className="text-sm text-muted-foreground">Conformidade garantida</p>
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border/50">
                    <Syringe className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold">CBHPM</h3>
                    <p className="text-sm text-muted-foreground">Valores atualizados</p>
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border/50">
                    <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold">Certificado</h3>
                    <p className="text-sm text-muted-foreground">Homologado CFM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="md:col-span-2 pt-8"
          >
            <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
                <BadgeCheck className="h-5 w-5 text-primary" />
                <span>Certificado CFM</span>
              </div>
              <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
                <Trophy className="h-5 w-5 text-primary" />
                <span>Líder no mercado</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
