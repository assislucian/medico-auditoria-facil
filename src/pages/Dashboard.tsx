
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import Dashboard from "@/components/Dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { GuidedTour } from '@/components/onboarding/GuidedTour';
import { useOnboarding } from '@/hooks/use-onboarding';

const DashboardPage = () => {
  const isMobile = useIsMobile();
  const { showTour } = useOnboarding();

  return (
    <AuthenticatedLayout title="Dashboard">
      <Dashboard />
      {showTour && <GuidedTour />}
    </AuthenticatedLayout>
  );
};

export default DashboardPage;
