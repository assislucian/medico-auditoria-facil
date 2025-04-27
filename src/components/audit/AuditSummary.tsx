
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

interface AuditSummaryProps {
  summary: {
    totalExpected: number;
    totalPaid: number;
    totalDifference: number;
    underPaidCount: number;
    overPaidCount: number;
    correctPaidCount: number;
  };
}

export function AuditSummary({ summary }: AuditSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Esperado</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalExpected)}</div>
          <p className="text-xs text-muted-foreground">Valor CBHPM</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Recebido</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalPaid)}</div>
          <p className="text-xs text-muted-foreground">Valor total recebido</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Diferença</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${summary.totalDifference < 0 ? 'text-red-500' : summary.totalDifference > 0 ? 'text-green-500' : ''}`}>
            {formatCurrency(summary.totalDifference)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.totalDifference < 0 ? 'Valor a recuperar' : 'Diferença total'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center">
              <ArrowDownIcon className="h-4 w-4 text-red-500 mb-1" />
              <div className="text-xl font-bold">{summary.underPaidCount}</div>
              <p className="text-xs text-muted-foreground">Abaixo</p>
            </div>
            <div className="flex flex-col items-center">
              <MinusIcon className="h-4 w-4 text-blue-500 mb-1" />
              <div className="text-xl font-bold">{summary.correctPaidCount}</div>
              <p className="text-xs text-muted-foreground">Correto</p>
            </div>
            <div className="flex flex-col items-center">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mb-1" />
              <div className="text-xl font-bold">{summary.overPaidCount}</div>
              <p className="text-xs text-muted-foreground">Acima</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
