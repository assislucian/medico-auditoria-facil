import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import { DashboardOverview } from "../components/dashboard/DashboardOverview";
import { DashboardAlert } from "../components/dashboard/DashboardAlert";
import { DashboardTabs } from "../components/dashboard/tabs/DashboardTabs";
import PageHeader from "../components/layout/PageHeader";
import { useAuth } from "../contexts/auth/AuthContext";
import { UserMenu } from "../components/navbar/UserMenu";
import { LayoutDashboard, ArrowUpRight, AlertCircle, FileText, ClipboardList, TrendingUp } from "lucide-react";
import InfoCard from "../components/ui/InfoCard";
import { formatCurrency } from "../utils/format";

const DashboardPage = () => {
  const { userProfile, signOut } = useAuth();
  return (
    <AuthenticatedLayout 
      title="Dashboard" 
      description="Visão geral de seus procedimentos e pagamentos"
    >
      <PageHeader
        title="Dashboard"
        icon={<LayoutDashboard size={28} />}
        actions={userProfile ? (
          <UserMenu
            name={userProfile.name || 'Usuário'}
            email={userProfile.email || 'sem-email@exemplo.com'}
            specialty={userProfile.crm || ''}
            avatarUrl={userProfile.avatarUrl || undefined}
            onLogout={signOut}
          />
        ) : null}
      />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <InfoCard
          icon={<ArrowUpRight className="h-6 w-6 text-green-600" />}
          title={<span className="text-xs font-semibold text-gray-700">Total Recebido</span>}
          value={<span className="text-2xl md:text-3xl font-bold text-green-700">{formatCurrency(12597)}</span>}
          description={<span className="text-xs text-gray-500">Recebido nos últimos 30 dias</span>}
          variant="success"
          className="bg-card rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-all duration-200"
        />
        <InfoCard
          icon={<AlertCircle className="h-6 w-6 text-red-600" />}
          title={<span className="text-xs font-semibold text-gray-700">Total Glosado</span>}
          value={<span className="text-2xl md:text-3xl font-bold text-red-700">{formatCurrency(1438)}</span>}
          description={<span className="text-xs text-gray-500">Glosado nos últimos 30 dias</span>}
          variant="danger"
          className="bg-card rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-all duration-200"
        />
        <InfoCard
          icon={<FileText className="h-6 w-6 text-blue-700" />}
          title={<span className="text-xs font-semibold text-gray-700">Procedimentos</span>}
          value={<span className="text-2xl md:text-3xl font-bold text-blue-700">284</span>}
          description={<span className="text-xs text-gray-500">Analisados nos últimos 30 dias</span>}
          variant="info"
          className="bg-card rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-all duration-200"
        />
        <InfoCard
          icon={<ClipboardList className="h-6 w-6 text-amber-700" />}
          title={<span className="text-xs font-semibold text-gray-700">Auditorias Pendentes</span>}
          value={<span className="text-2xl md:text-3xl font-bold text-amber-700">8</span>}
          description={<span className="text-xs text-gray-500">Uploads aguardando sua revisão</span>}
          variant="warning"
          className="bg-card rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-all duration-200"
        />
      </div>
      <InfoCard
        icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
        title="Você recuperou R$ 2.450,00 este mês. Excelente!"
        description="Continue acompanhando seus pagamentos para maximizar seus rendimentos."
        variant="info"
        className="w-full mb-6"
      />
      <div className="grid gap-6">
        <DashboardTabs />
      </div>
    </AuthenticatedLayout>
  );
};

export default DashboardPage;
