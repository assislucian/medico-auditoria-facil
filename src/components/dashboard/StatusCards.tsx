
import { FileText, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { StatusCard } from "@/components/StatusCard";

export function StatusCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard
        title="Total Recebido"
        value="R$ 39.600,00"
        icon={FileText}
        trend={{ value: 8, isPositive: true }}
        description="Pagamentos em 2025"
        className="border-primary/20 bg-primary/5"
      />
      <StatusCard
        title="Total Glosado"
        value="R$ 7.300,00"
        icon={AlertCircle}
        trend={{ value: 12, isPositive: false }}
        className="border-destructive/20 bg-destructive/5"
        description="Valor glosado em 2025"
      />
      <StatusCard
        title="Procedimentos"
        value="86"
        icon={TrendingUp}
        description="Procedimentos analisados"
        className="border-primary/20 bg-primary/5"
      />
      <StatusCard
        title="Auditorias Pendentes"
        value="2"
        icon={Clock}
        className="border-warning/20 bg-warning/5"
        description="Uploads pendentes"
      />
    </div>
  );
}
