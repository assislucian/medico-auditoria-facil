
/**
 * StatusBadge.tsx
 * 
 * Componente para exibir o status de uma análise com visual adequado.
 * Mostra badges coloridas de acordo com o status da análise.
 */

import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

/**
 * Badge para exibição visual do status da análise
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  // Definir aparência baseada no status
  if (status === "Analisado") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="mr-1 h-3 w-3" />
        Analisado
      </Badge>
    );
  } else if (status === "Pendente") {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        <Clock className="mr-1 h-3 w-3" />
        Pendente
      </Badge>
    );
  } else if (status === "Erro") {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <AlertCircle className="mr-1 h-3 w-3" />
        Erro
      </Badge>
    );
  }
  
  // Fallback para status desconhecidos
  return <Badge variant="outline">{status}</Badge>;
}
