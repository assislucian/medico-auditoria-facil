
import Dashboard from "@/components/Dashboard";
import { GuidedTour } from '@/components/onboarding/GuidedTour';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { showTour, onboardingCompleted } = useOnboarding();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulação de carregamento dos dados do dashboard
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  /**
   * Efeito que exibe uma mensagem de boas-vindas quando o usuário
   * completa o tour pela primeira vez
   */
  useEffect(() => {
    // Exibe toast de boas-vindas apenas quando o usuário finaliza o tour
    if (onboardingCompleted) {
      toast.success("Bem-vindo ao MedCheck!", {
        description: "Seu dashboard está pronto para uso."
      });
    }
  }, [onboardingCompleted]);

  return (
    <MainLayout 
      title="Dashboard" 
      isLoading={isLoading}
      loadingMessage="Carregando dashboard..."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe suas auditorias e análises mais recentes
            </p>
          </div>
          
          <Button asChild>
            <Link to="/uploads">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Auditoria
            </Link>
          </Button>
        </div>
        
        <Dashboard />
        {/* Exibe o tour guiado se necessário */}
        {showTour && <GuidedTour />}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
