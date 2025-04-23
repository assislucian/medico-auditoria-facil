
import { FileText, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { StatusCard } from "@/components/StatusCard";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function StatusCards() {
  const { data, isLoading } = useDashboardStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard
        title="Total Recebido"
        value={isLoading ? "Carregando..." : formatCurrency(data?.totals.totalRecebido || 0)}
        icon={FileText}
        trend={{ value: 8, isPositive: true }}
        description="Pagamentos em 2025"
        className="border-primary/20 bg-primary/5"
      />
      <StatusCard
        title="Total Glosado"
        value={isLoading ? "Carregando..." : formatCurrency(data?.totals.totalGlosado || 0)}
        icon={AlertCircle}
        trend={{ value: 12, isPositive: false }}
        className="border-destructive/20 bg-destructive/5"
        description="Valor glosado em 2025"
      />
      <StatusCard
        title="Procedimentos"
        value={isLoading ? "Carregando..." : String(data?.totals.totalProcedimentos || 0)}
        icon={TrendingUp}
        description="Procedimentos analisados"
        className="border-primary/20 bg-primary/5"
      />
      <StatusCard
        title="Auditorias Pendentes"
        value={isLoading ? "Carregando..." : String(data?.totals.auditoriaPendente || 0)}
        icon={Clock}
        className="border-warning/20 bg-warning/5"
        description="Uploads pendentes"
      />
    </div>
  );
}
