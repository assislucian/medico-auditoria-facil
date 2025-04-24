
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTrialStatus } from "@/hooks/use-trial-status";
import { differenceInDays } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SubscriptionCard() {
  const { status, endDate, isLoading } = useTrialStatus();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Carregando informações...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const daysLeft = endDate ? differenceInDays(new Date(endDate), new Date()) : 0;
  const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Plano Atual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'active' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">Trial Gratuito</h4>
                {endDate && (
                  <p className={`text-sm ${isExpiringSoon ? 'text-red-500' : 'text-muted-foreground'}`}>
                    Expira em: {new Date(endDate).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              <Button onClick={() => navigate('/pricing')}>
                Assinar Plano
              </Button>
            </div>
            {isExpiringSoon && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Seu período de avaliação expira em {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}. 
                  Assine um plano para continuar usando todas as funcionalidades.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {status === 'expired' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-red-500">Trial Expirado</h4>
                <p className="text-sm text-muted-foreground">
                  Seu período de avaliação terminou
                </p>
              </div>
              <Button onClick={() => navigate('/pricing')} variant="destructive">
                Assinar Agora
              </Button>
            </div>
          </>
        )}

        {status === 'not_started' && (
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold">Trial Não Iniciado</h4>
              <p className="text-sm text-muted-foreground">
                Comece seu período de avaliação gratuito
              </p>
            </div>
            <Button onClick={() => navigate('/welcome')}>
              Iniciar Trial
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
