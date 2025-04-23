
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatusCards } from "./dashboard/StatusCards";
import { AnalyticsChart } from "./dashboard/AnalyticsChart";
import { RecentActivities } from "./dashboard/RecentActivities";
import ComparisonView from "./ComparisonView";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatusCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsChart />
        <RecentActivities />
      </div>
      <div className="pt-4">
        <ComparisonView />
      </div>
    </div>
  );
};

export default Dashboard;
