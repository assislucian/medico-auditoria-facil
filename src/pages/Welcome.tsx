
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActivateTrialResponse {
  success: boolean;
  message?: string;
  trial_end_date?: string;
}

const WelcomePage = () => {
  const [isActivating, setIsActivating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get return path from location state, or default to dashboard
  const returnTo = location.state?.returnTo || '/dashboard';

  const handleStartTrial = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para ativar o trial');
      return;
    }
    
    setIsActivating(true);
    try {
      console.log('Activating trial for user:', user.id);
      const { data, error } = await supabase.rpc('activate_trial', {
        user_id: user.id
      }) as { data: ActivateTrialResponse, error: any };

      if (error) {
        console.error('Error activating trial:', error);
        throw error;
      }
      
      console.log('Trial activation response:', data);
      
      if (data) {
        if (!data.success) {
          toast.error(data.message || 'Erro ao ativar trial');
          return;
        }

        toast.success('Trial ativado com sucesso!');
        navigate(returnTo, { 
          state: { startTour: true },
          replace: true 
        });
      } else {
        toast.error('Resposta vazia ao ativar o trial');
      }
    } catch (error) {
      console.error('Erro ao ativar trial:', error);
      toast.error('Erro ao ativar o trial. Por favor, tente novamente.');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Bem-vindo ao MedCheck | Período Trial</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gradient mb-2">
              Bem-vindo ao MedCheck!
            </CardTitle>
            <CardDescription className="text-lg">
              Sua conta foi criada com sucesso. Aproveite 7 dias gratuitos de todas as funcionalidades premium.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4">
                {[
                  'Análise automatizada de contracheques médicos',
                  'Identificação de glosas e inconsistências',
                  'Relatórios detalhados de pagamentos',
                  'Suporte prioritário via chat',
                  'Exportação ilimitada de relatórios'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  className="w-full md:w-auto px-8"
                  onClick={handleStartTrial}
                  disabled={isActivating}
                >
                  {isActivating ? 'Ativando...' : 'Começar 7 dias grátis'}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Sem compromisso. Cancele a qualquer momento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default WelcomePage;
