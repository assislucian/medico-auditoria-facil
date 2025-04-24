
/**
 * ComparisonSummary.tsx
 * 
 * Componente que exibe um resumo dos resultados da comparação.
 * Mostra valores CBHPM esperados, valores pagos, diferenças e contagem de procedimentos.
 */

import { Separator } from '@/components/ui/separator';

interface ComparisonSummaryProps {
  data?: {
    valorCBHPM: number;
    valorPago: number;
    diferenca: number;
    procedimentosNaoPagos: number;
  };
}

/**
 * Componente de resumo dos totais da comparação
 */
export function ComparisonSummary({ data }: ComparisonSummaryProps) {
  if (!data) return null;
  
  // Formatar valores para o formato brasileiro
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const valorCBHPM = formatCurrency(data.valorCBHPM);
  const valorPago = formatCurrency(data.valorPago);
  const diferenca = formatCurrency(Math.abs(data.diferenca));
  
  // Calcular percentuais
  const percPago = data.valorCBHPM > 0 
    ? ((data.valorPago / data.valorCBHPM) * 100).toFixed(1) 
    : '0';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-lg bg-card border">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          Valor CBHPM Total
        </div>
        <div className="text-2xl font-bold print:text-lg">
          {valorCBHPM}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Base para comparação
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-card border">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          Valor Pago Total
        </div>
        <div className="text-2xl font-bold print:text-lg">
          {valorPago}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {percPago}% do valor CBHPM
        </div>
      </div>
      
      <div className={`p-4 rounded-lg border ${data.diferenca < 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        <div className={`text-sm font-medium mb-1 ${data.diferenca < 0 ? 'text-red-700' : 'text-green-700'}`}>
          {data.diferenca < 0 ? 'Diferença (Glosa)' : 'Diferença (Extra)'}
        </div>
        <div className={`text-2xl font-bold print:text-lg ${data.diferenca < 0 ? 'text-red-700' : 'text-green-700'}`}>
          {diferenca}
        </div>
        <div className={`text-xs mt-1 ${data.diferenca < 0 ? 'text-red-600' : 'text-green-600'}`}>
          {data.diferenca < 0 ? 'Valor a recuperar' : 'Valor acima do esperado'}
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-card border">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          Procedimentos Glosados
        </div>
        <div className="text-2xl font-bold print:text-lg">
          {data.procedimentosNaoPagos}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Procedimentos não pagos
        </div>
      </div>
    </div>
  );
}
