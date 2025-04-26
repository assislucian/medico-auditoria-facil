
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function DashboardAlert() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 flex items-center">
        <div className="bg-primary/10 p-2 rounded-full mr-4">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium">
            Você recuperou R$ 2.450,00 este mês. Excelente!
          </p>
          <p className="text-sm text-muted-foreground">
            Continue acompanhando seus pagamentos para maximizar seus rendimentos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
