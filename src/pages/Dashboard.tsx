
import Dashboard from "@/components/Dashboard";
import { GuidedTour } from '@/components/onboarding/GuidedTour';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";

const DashboardPage = () => {
  const { showTour, onboardingCompleted } = useOnboarding();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
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
      <PageHeader
        title="Dashboard"
        description="Acompanhe suas auditorias e análises mais recentes"
        actions={
          <Button asChild>
            <Link to="/uploads">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Auditoria
            </Link>
          </Button>
        }
      />
      
      <Dashboard />
      {showTour && <GuidedTour />}
    </MainLayout>
  );
};

export default DashboardPage;
