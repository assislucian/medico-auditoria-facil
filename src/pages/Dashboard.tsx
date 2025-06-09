
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardAlert } from "@/components/dashboard/DashboardAlert";
import { DashboardTabs } from "@/components/dashboard/tabs/DashboardTabs";

const DashboardPage = () => {
  return (
    <AuthenticatedLayout 
      title="Dashboard" 
      description="Visão geral de seus procedimentos e pagamentos"
    >
      <div className="grid gap-6">
        <DashboardOverview />
        <DashboardAlert />
        <DashboardTabs />
      </div>
    </AuthenticatedLayout>
  );
};

export default DashboardPage;
