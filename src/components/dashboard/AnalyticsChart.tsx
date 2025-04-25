
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function AnalyticsChart() {
  const { data, isLoading } = useDashboardStats();

  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Análises Recentes</CardTitle>
            <CardDescription>Valores recebidos e glosados por mês</CardDescription>
          </div>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyData || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `R$${value/1000}k`} 
                  domain={['auto', 'auto']} 
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), undefined]}
                  labelFormatter={(label) => `Mês: ${label}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <ReferenceLine y={0} stroke="#000" />
                <Bar 
                  dataKey="recebido" 
                  name="Recebido" 
                  fill="#1E40AF" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={40} 
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="glosado" 
                  name="Glosado" 
                  fill="#EF4444" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={40} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
