
import { Helmet } from 'react-helmet-async';
import Dashboard from "@/components/Dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { GuidedTour } from '@/components/onboarding/GuidedTour';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useOnboarding } from '@/hooks/use-onboarding';

const DashboardPage = () => {
  const isMobile = useIsMobile();
  const { showTour } = useOnboarding();

  return (
    <>
      <Helmet>
        <title>Dashboard | MedCheck</title>
      </Helmet>
      <div className="min-h-screen flex">
        <DashboardLayout isMobile={isMobile}>
          <Dashboard />
        </DashboardLayout>
      </div>
      {showTour && <GuidedTour />}
    </>
  );
};

export default DashboardPage;
