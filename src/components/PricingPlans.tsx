
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type BillingInterval = 'monthly' | 'yearly';

const plans = [
  {
    id: 'individual-monthly',
    name: 'Individual Mensal',
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
  },
  {
    id: 'individual-yearly',
    name: 'Individual Anual',
    description: 'Plano ideal para médicos individuais com desconto',
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
      'Prioridade no atendimento',
    ],
    isFeatured: true,
  },
  {
    id: 'clinic-monthly',
    name: 'Clínica Mensal',
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
  },
  {
    id: 'clinic-yearly',
    name: 'Clínica Anual',
    description: 'Para clínicas e grupos médicos com desconto',
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
      'Treinamento personalizado',
    ],
  },
];

const PricingPlans = () => {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');

  const handlePlanSelect = (planId: string) => {
    toast('Redirecionando para checkout...', {
      description: 'Esta funcionalidade estará disponível em breve.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-3xl font-bold text-center">Planos MedCheck</h2>
        <p className="text-center text-muted-foreground max-w-2xl">
          Escolha o plano ideal para suas necessidades e comece a recuperar valores glosados hoje mesmo
        </p>
        
        <div className="flex items-center border border-input rounded-lg p-1 mt-6">
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
            <span className="ml-2 bg-green-500/20 text-green-500 text-xs py-0.5 px-1.5 rounded-full">
              -16%
            </span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans
          .filter(plan => {
            // Show yearly plans when yearly is selected, and monthly when monthly is selected
            if (billingInterval === 'yearly') {
              return plan.id.includes('yearly');
            } else {
              return plan.id.includes('monthly');
            }
          })
          .map((plan) => (
            <Card 
              key={plan.id} 
              className={cn(
                "flex flex-col",
                plan.isFeatured && "border-primary shadow-md shadow-primary/20"
              )}
            >
              {plan.isFeatured && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Mais popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">
                      {plan.price[billingInterval]}
                    </span>
                    <span className="text-muted-foreground ml-2 mb-1">
                      /{billingInterval === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {billingInterval === 'yearly' && (
                    <p className="text-green-500 text-sm mt-1">
                      Economize {plan.discount.yearly} com o pagamento anual
                    </p>
                  )}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePlanSelect(plan.id)}
                  className="w-full"
                  variant={plan.isFeatured ? 'default' : 'outline'}
                >
                  Assinar plano
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
