import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SubscriptionCard() {
  const navigate = useNavigate();
  const hasActivePlan = false; // This should come from your subscription context/hook

  return (
    <Card className="w-full bg-card hover:bg-accent/5 transition-colors">
      <CardHeader className="flex flex-row items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <div>
          <CardTitle className="text-xl">Plano Atual</CardTitle>
          <CardDescription>
            Informações sobre seu plano
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {hasActivePlan ? (
          <div>Plano Pro</div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Nenhum plano selecionado
            </p>
            <Button 
              variant="default"
              onClick={() => navigate('/planos')}
              className="w-full md:w-auto"
            >
              Ver Planos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
