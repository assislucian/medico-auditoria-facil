
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "Analisado") {
    return (
      <Badge className="bg-green-600/10 text-green-600 border-green-200">
        <Check className="mr-1 h-3 w-3" />
        Analisado
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-amber-600/10 text-amber-600 border-amber-200">
      <Clock className="mr-1 h-3 w-3" />
      Pendente
    </Badge>
  );
}
