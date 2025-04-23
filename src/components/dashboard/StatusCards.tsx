
import { FileText, AlertCircle, Clock } from "lucide-react";
import { StatusCard } from "@/components/StatusCard";

export function StatusCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard
        title="Total Recebido"
        value="R$ 39.600,00"
        icon={FileText}
        trend={{ value: 8, isPositive: true }}
        description="Pagamentos recebidos em 2025"
      />
      <StatusCard
        title="Total Glosado"
        value="R$ 7.300,00"
        icon={AlertCircle}
        trend={{ value: 12, isPositive: false }}
        className="border-red-500/20"
        description="Valor total glosado em 2025"
      />
      <StatusCard
        title="Procedimentos"
        value="86"
        icon={FileText}
        description="Total de procedimentos analisados"
      />
      <StatusCard
        title="Auditorias Pendentes"
        value="2"
        icon={Clock}
        className="border-amber-500/20"
        description="Uploads pendentes de análise"
      />
    </div>
  );
}
