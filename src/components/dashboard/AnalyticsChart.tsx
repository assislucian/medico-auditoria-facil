
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function AnalyticsChart() {
  const { data, isLoading } = useDashboardStats();

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
              <BarChart data={data?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip formatter={(value) => [`R$ ${value},00`, undefined]} />
                <Bar dataKey="recebido" name="Recebido" fill="#1E40AF" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="glosado" name="Glosado" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
