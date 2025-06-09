
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24 px-6">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary),0.08),transparent_70%)]" />
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <motion.div
            className="md:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Auditoria médica
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                simplificada
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-6 max-w-lg">
              Recupere valores glosados e maximize seus resultados com a 
              plataforma que já ajudou mais de 10.000 médicos brasileiros.
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 h-12 rounded-md transition-all duration-300 hover:translate-y-[-2px] shadow-lg shadow-primary/20"
              >
                <Link to="/register">
                  Comece agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 h-12 rounded-md transition-all duration-300 hover:translate-y-[-2px]"
              >
                <Link to="/how-it-works">Como funciona</Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} className="text-primary" />
                <span>Economize até 80% do tempo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign size={16} className="text-primary" />
                <span>Recupere valores glosados</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield size={16} className="text-primary" />
                <span>Conformidade com LGPD</span>
              </div>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            className="md:col-span-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/40">
              <img 
                src="/assets/dashboard-preview.png" 
                alt="MedCheck Dashboard" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80";
                }}
              />
              
              {/* Floating card effect */}
              <div className="absolute -bottom-6 -right-6 bg-background rounded-lg p-4 shadow-lg border border-border/50 transform rotate-3 hidden md:block">
                <div className="text-3xl font-bold text-primary">+80%</div>
                <div className="text-sm text-muted-foreground">Economia de tempo</div>
              </div>
              
              <div className="absolute -top-6 -left-6 bg-background rounded-lg p-4 shadow-lg border border-border/50 transform -rotate-3 hidden md:block">
                <div className="text-3xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Taxa de precisão</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Testimonial or statistic */}
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg max-w-3xl">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="md:w-1/4 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" 
                  alt="Dr. Carla Mendes" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div className="md:w-3/4">
                <p className="text-muted-foreground italic">"O MedCheck transformou nossa auditoria médica, aumentando nosso faturamento em 23% no primeiro trimestre de uso. A interface é intuitiva e os resultados são impressionantes."</p>
                <p className="font-semibold mt-2">Dra. Carla Mendes</p>
                <p className="text-sm text-muted-foreground">Diretora Clínica, Hospital São Paulo</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
