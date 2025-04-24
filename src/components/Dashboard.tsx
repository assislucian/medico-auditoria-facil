
/**
 * Dashboard.tsx
 * 
 * Componente principal do Dashboard que compõe todos os elementos 
 * da tela principal, incluindo cabeçalho, cards de status,
 * gráficos analíticos e atividades recentes.
 */

import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatusCards } from "./dashboard/StatusCards";
import { AnalyticsChart } from "./dashboard/AnalyticsChart";
import { RecentActivities } from "./dashboard/RecentActivities";
import ComparisonView from "./ComparisonView";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Cabeçalho do dashboard com boas-vindas e informações gerais */}
      <DashboardHeader />
      
      {/* Cards de status com métricas importantes */}
      <StatusCards />
      
      {/* Seção com gráficos analíticos e atividades recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsChart />
        <RecentActivities />
      </div>
      
      {/* Visualização de comparativos CBHPM */}
      <div className="pt-4">
        <ComparisonView />
      </div>
    </div>
  );
};

export default Dashboard;
