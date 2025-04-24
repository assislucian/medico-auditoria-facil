
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
  
  useEffect(() => {
    // Show welcome toast only when user first completes the tour
    if (onboardingCompleted) {
      toast.success("Bem-vindo ao MedCheck!", {
        description: "Seu dashboard está pronto para uso."
      });
    }
  }, [onboardingCompleted]);

  return (
    <AuthenticatedLayout title="Dashboard">
      <Dashboard />
      {showTour && <GuidedTour />}
    </AuthenticatedLayout>
  );
};

export default DashboardPage;
