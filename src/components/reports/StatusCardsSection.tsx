
import { StatusCard } from "@/components/StatusCard";
import { Wallet, AlertCircle, TrendingUp, FileText } from "lucide-react";

export function StatusCardsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatusCard
        title="Total Recebido"
        value="R$ 98.720,00"
        icon={Wallet}
        trend={{ value: 12, isPositive: true }}
        description="Valor total recebido em 2025"
      />
      <StatusCard
        title="Total Glosado"
        value="R$ 14.430,00"
        icon={AlertCircle}
        trend={{ value: 8, isPositive: false }}
        className="border-red-500/20"
        description="Valor total glosado em 2025"
      />
      <StatusCard
        title="Total Recuperado"
        value="R$ 8.250,00"
        icon={TrendingUp}
        trend={{ value: 18, isPositive: true }}
        className="border-green-500/20"
        description="Valor recuperado após auditoria"
      />
      <StatusCard
        title="Procedimentos"
        value="142"
        icon={FileText}
        description="Total de procedimentos analisados"
      />
    </div>
  );
}
