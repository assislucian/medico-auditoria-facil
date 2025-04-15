
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, Headset, BadgeDollarSign, ShieldCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/use-theme';

type BillingInterval = 'monthly' | 'yearly';

const plans = [
  {
    id: 'individual-monthly',
    name: 'Individual',
    description: 'Plano ideal para médicos individuais',
    price: {
      monthly: 'R$ 89,90',
      yearly: 'R$ 899,00',
    },
    discount: {
      yearly: '16%',
    },
    features: [
      '1 CRM registrado',
      'Uploads ilimitados',
      'Histórico completo',
      'Exportação para Excel',
      'Suporte por email',
    ],
    icon: Star,
    bgColor: 'from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30',
  },
  {
    id: 'clinic-monthly',
    name: 'Clínica',
    description: 'Para clínicas e grupos médicos',
    price: {
      monthly: 'R$ 299,90',
      yearly: 'R$ 2.999,00',
    },
    discount: {
      yearly: '16%',
    },
    features: [
      'Até 5 CRMs registrados',
      'Uploads ilimitados',
      'Histórico completo',
      'Exportação para Excel',
      'Suporte prioritário',
      'Dashboard avançado para clínicas',
      'Relatórios consolidados',
    ],
    icon: BadgeDollarSign,
    bgColor: 'from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/30',
    isFeatured: true,
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    description: 'Soluções personalizadas para hospitais',
    price: {
      monthly: 'Sob consulta',
      yearly: 'Sob consulta',
    },
    features: [
      'CRMs ilimitados',
      'Uploads ilimitados',
      'Histórico completo',
      'Exportação personalizada',
      'Suporte premium 24/7',
      'Integrações com sistemas',
      'Dashboard personalizado',
      'Treinamento dedicado',
      'API para integração',
    ],
    icon: ShieldCheck,
    bgColor: 'from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30',
    isEnterprise: true,
  }
];

const PricingPlans = () => {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const { theme } = useTheme();

  const handlePlanSelect = (planId: string) => {
    if (planId.includes('premium')) {
      toast('Fale com nossa equipe de vendas', {
        description: 'Entraremos em contato para criar uma solução personalizada.',
      });
    } else {
      toast('Redirecionando para checkout...', {
        description: 'Esta funcionalidade estará disponível em breve.',
      });
    }
  };
  
  // Filtra os planos com base no intervalo de cobrança selecionado
  const filteredPlans = plans.map(plan => {
    // Adiciona o intervalo ao ID do plano
    const planIdWithInterval = billingInterval === 'monthly' 
      ? plan.id.replace('-yearly', '-monthly') 
      : plan.id.replace('-monthly', '-yearly');
    
    return {
      ...plan,
      id: planIdWithInterval,
    };
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-3xl font-bold text-center">Planos MedCheck</h2>
        <p className="text-center text-muted-foreground max-w-2xl">
          Escolha o plano ideal para suas necessidades e comece a recuperar valores glosados hoje mesmo
        </p>
        
        <div className="flex items-center border border-input bg-background rounded-lg p-1 mt-6">
          <Button
            variant={billingInterval === 'monthly' ? 'default' : 'ghost'}
            onClick={() => setBillingInterval('monthly')}
            className="rounded-r-none min-w-[100px]"
          >
            Mensal
          </Button>
          <Button
            variant={billingInterval === 'yearly' ? 'default' : 'ghost'}
            onClick={() => setBillingInterval('yearly')}
            className="rounded-l-none min-w-[100px]"
          >
            Anual
            <span className="ml-2 bg-green-500/20 text-green-700 dark:text-green-400 text-xs py-0.5 px-1.5 rounded-full">
              -16%
            </span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={cn(
              "flex flex-col h-full transition-all hover:scale-[1.02] hover:shadow-lg",
              plan.isFeatured && "border-primary shadow-md shadow-primary/20",
              theme === 'dark' ? 'bg-card' : `bg-gradient-to-br ${plan.bgColor}`
            )}
          >
            {plan.isFeatured && (
              <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                Mais popular
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  {plan.icon && <plan.icon className="h-5 w-5 text-primary" />}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <div className="flex items-end">
                  <span className="text-3xl font-bold">
                    {plan.price[billingInterval]}
                  </span>
                  {!plan.isEnterprise && (
                    <span className="text-muted-foreground ml-2 mb-1">
                      /{billingInterval === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  )}
                </div>
                {billingInterval === 'yearly' && plan.discount?.yearly && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                    Economize {plan.discount.yearly} com o pagamento anual
                  </p>
                )}
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handlePlanSelect(plan.id)}
                className={cn(
                  "w-full group",
                  plan.isEnterprise ? "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700" : ""
                )}
                variant={plan.isFeatured ? 'default' : plan.isEnterprise ? 'default' : 'outline'}
              >
                {plan.isEnterprise ? (
                  <>
                    Fale com especialista
                    <Headset className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  </>
                ) : (
                  <>
                    Assinar plano
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="max-w-2xl mx-auto bg-secondary/50 rounded-lg p-6 mt-10">
        <h3 className="text-xl font-bold mb-4">Perguntas Frequentes</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Posso cancelar a qualquer momento?</h4>
            <p className="text-muted-foreground text-sm mt-1">
              Sim, você pode cancelar sua assinatura a qualquer momento. Para planos mensais, você terá acesso até o final do período pago.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Como funciona o período de teste gratuito?</h4>
            <p className="text-muted-foreground text-sm mt-1">
              Atualmente não oferecemos período de teste, mas você pode usar recursos limitados gratuitamente.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Preciso fornecer dados do cartão para criar uma conta?</h4>
            <p className="text-muted-foreground text-sm mt-1">
              Não, você pode criar uma conta gratuita sem fornecer dados de pagamento. Apenas ao assinar um plano precisará informar seus dados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
