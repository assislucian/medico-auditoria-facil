
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, BadgeCheck, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-6">
      {/* Enhanced gradient background */}
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
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
              Auditoria médica <br />
              <span className="bg-gradient-to-r from-primary/90 via-primary to-primary/80 bg-clip-text text-transparent">
                simplificada e eficiente
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Identifique e recupere valores glosados pelos planos de saúde de forma automática e inteligente.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
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
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="pt-16"
          >
            {/* Trust indicators with enhanced visual design */}
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
