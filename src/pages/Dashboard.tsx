
/**
 * Dashboard.tsx
 * 
 * Página principal do dashboard que exibe o resumo das informações do usuário,
 * incluindo estatísticas, gráficos e atividades recentes.
 * Também gerencia a exibição do tour guiado quando necessário.
 */

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import Dashboard from "@/components/Dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { GuidedTour } from '@/components/onboarding/GuidedTour';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useEffect } from "react";
import { toast } from "sonner";

const DashboardPage = () => {
  const isMobile = useIsMobile();
  const { showTour, onboardingCompleted } = useOnboarding();
  
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
    <AuthenticatedLayout title="Dashboard">
      <Dashboard />
      {/* Exibe o tour guiado se necessário */}
      {showTour && <GuidedTour />}
    </AuthenticatedLayout>
  );
};

export default DashboardPage;
