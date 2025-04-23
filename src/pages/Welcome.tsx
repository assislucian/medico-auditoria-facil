
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the expected return type from the RPC function
interface ActivateTrialResponse {
  success: boolean;
  message?: string;
  trial_end_date?: string;
}

const WelcomePage = () => {
  const [isActivating, setIsActivating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartTrial = async () => {
    if (!user) return;
    
    setIsActivating(true);
    try {
      // Call our new database function to activate trial
      const { data, error } = await supabase
        .rpc<ActivateTrialResponse>('activate_trial', {
          user_id: user.id
        });

      if (error) throw error;

      if (data && !data.success) {
        toast.error(data.message || 'Erro ao ativar trial');
        return;
      }

      toast.success('Trial ativado com sucesso!');
      navigate('/dashboard');
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
